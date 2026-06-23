import { injectable, inject } from 'inversify';
import { PrismaClient, StepStatus } from "../../../generated/prisma/index.js";
import { getPrismaClient } from "./PrismaClient.js";
import { transactionStorage } from "./PrismaContext.js"; // 🌟 Importamos el storage
import { ExecutionRepository } from "../../../application/use-cases/ports/ExecutionRepository.js";
import { OutboxRepository } from "../../../application/use-cases/ports/OutBoxRepository.js";
import { Execution } from "../../../domain/entities/execution/Execution.js";
import { ExecutionStep, ExecutionStepStatus } from "../../../domain/entities/execution/ExecutionStep.js";
import { ExecutionStatus } from "../../../domain/entities/execution/ExecutionStatus.js";
import { toJsonValue } from "./Json.js";

type DbExecutionStep = {
  stepId: string;
  status: string;
};

type DbExecution = {
  id: string;
  processId: string;
  status: string;
  steps: DbExecutionStep[];
};

const toPrismaStepStatus = (status: ExecutionStepStatus): StepStatus =>
  status as unknown as StepStatus;

@injectable()
export class PrismaExecutionRepository implements ExecutionRepository {
  private prisma: PrismaClient = getPrismaClient();

  //  Interceptor de transacción silencioso
  private get db() {
    const tx = transactionStorage.getStore();
    return tx ? tx : this.prisma;
  }

  constructor(
    @inject('OutBoxRepository') private readonly outboxRepo: OutboxRepository
  ) {}

  async save(execution: Execution): Promise<void> {
    const events = execution.pullDomainEvents();

  
    await this.db.execution.upsert({
      where: { id: execution.getId() },
      update: { status: execution.getStatus() as ExecutionStatus },
      create: {
        id: execution.getId(),
        processId: execution.getProcessId(),
        status: execution.getStatus() as ExecutionStatus,
      },
    });

    for (const step of execution.getSteps()) {
      await this.db.executionStep.upsert({
        where: {
          executionId_stepId: {
            executionId: execution.getId(),
            stepId: step.getStepId(),
          },
        },
        update: { status: toPrismaStepStatus(step.getStatus()) },
        create: {
          executionId: execution.getId(),
          stepId: step.getStepId(),
          status: toPrismaStepStatus(step.getStatus()),
        },
      });
    }

    // El outboxRepo internamente también usará 'this.db' gracias a Inversify y el Storage
    for (const event of events) {
      await this.outboxRepo.save({
        id: event.eventId,
        eventName: event.getEventName(),
        payload: toJsonValue(event.toPrimitives()),
        occurredOn: event.occurredOn,
        published: false,
      });
    }
  }

  async findById(id: string): Promise<Execution | null> {
  
    const row = await this.db.execution.findUnique({
      where: { id },
      include: { steps: true },
    });
    if (!row) return null;

    const dbRow = row as unknown as DbExecution;
    return Execution.rehydrate({
      id: dbRow.id,
      processId: dbRow.processId,
      status: dbRow.status as ExecutionStatus,
      steps: dbRow.steps.map(step =>
        ExecutionStep.rehydrate({
          stepId: step.stepId,
          status: step.status as ExecutionStepStatus,
        })
      ),
    });
  }
}