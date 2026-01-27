import { ExecutionRepository } from "../../../application/use-cases/ports/ExecutionRepository";
import { Execution } from "../../../domain/entities/execution/Execution";
import { ExecutionStep } from "../../../domain/entities/execution/ExecutionStep";
import { ExecutionStatus } from "../../../domain/entities/execution/ExecutionStatus";
import { ExecutionStepStatus } from "../../../domain/entities/execution/ExecutionStep";
import { getPrismaClient } from "./PrismaClient";
import { OutboxRepository } from "./PrismaOutboxRepository";
import { toJsonValue } from "./Json";
import { PrismaClient } from "@prisma/client";

export class PrismaExecutionRepository implements ExecutionRepository {
  private prisma = getPrismaClient();

  constructor(private readonly outboxRepo: OutboxRepository) {}

  async save(execution: Execution): Promise<void> {
    const events = execution.pullDomainEvents();

    await this.prisma.$transaction(async (tx: PrismaClient) => {
      await tx.execution.upsert({
        where: { id: execution.getId() },
        update: {
          status: execution.getStatus(),
        },
        create: {
          id: execution.getId(),
          processId: execution.getProcessId(),
          status: execution.getStatus(),
        },
      });

      for (const step of execution.getSteps()) {
        await tx.executionStep.upsert({
          where: { id: step.getStepId() },
          update: {
            status: step.getStatus(),
          },
          create: {
            id: step.getStepId(),
            executionId: execution.getId(),
            stepId: step.getStepId(),
            status: step.getStatus(),
          },
        });
      }

      for (const event of events) {
        await this.outboxRepo.save({
          id: event.eventId,
          eventName: event.getEventName(),
          payload: toJsonValue(event.toPrimitives()),
          occurredOn: event.occurredOn,
          published: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    });
  }

  async findById(id: string): Promise<Execution | null> {
    const row = await this.prisma.execution.findUnique({
      where: { id },
      include: { steps: true },
    });

    if (!row) return null;

    return Execution.rehydrate({
      id: row.id,
      processId: row.processId,
      status: row.status as ExecutionStatus,
      steps: row.steps.map(
      (step: { stepId: string; status: string }) =>
        ExecutionStep.rehydrate({
          stepId: step.stepId,
          status: step.status as ExecutionStepStatus,
    })
),
    });
  }
}
