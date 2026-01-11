import { ExecutionRepository } from "../../../application/use-cases/ports/ExecutionRepository";
import { Execution } from "../../../domain/entities/execution/Execution";
import { prisma } from "../PrismaClient";
import { ExecutionStep } from "../../../domain/entities/execution/ExecutionStep";
import { ExecutionStatus } from "../../../domain/entities/execution/ExecutionStatus";
import { ExecutionStep as PrismaExecutionStep } from "@prisma/client";

export class PrismaExecutionRepository implements ExecutionRepository {

  async findById(id: string): Promise<Execution | null> {
    const record = await prisma.execution.findUnique({
      where: { id },
      include: { steps: true },
    });

    if (!record) return null;

    return Execution.rehydrate({
      id: record.id,
      processId: record.processId,
      status: record.status as ExecutionStatus,
      steps: record.steps.map((step: PrismaExecutionStep) =>
        ExecutionStep.rehydrate({
          stepId: step.stepId,
          status: step.status,
        })
      ),
    });
  }

  async save(execution: Execution): Promise<void> {
    await prisma.$transaction(async (tx) => {
      await tx.execution.update({
        where: { id: execution.getId() },
        data: {
          status: execution.getStatus(),
        },
      });

      for (const step of execution.getSteps()) {
        await tx.executionStep.update({
          where: {
            executionId_stepId: {
              executionId: execution.getId(),
              stepId: step.getStepId(),
            },
          },
          data: {
            status: step.getStatus(),
          },
        });
      }
    });
  }
}
