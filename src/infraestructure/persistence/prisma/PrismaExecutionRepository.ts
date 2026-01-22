import { ExecutionRepository } from "../../../application/use-cases/ports/ExecutionRepository"
import { Execution } from "../../../domain/entities/execution/Execution"
import { ExecutionStatus } from "../../../domain/entities/execution/ExecutionStatus"
import { getPrismaClient } from "./PrismaClient"
import { ExecutionStep, ExecutionStepStatus } from "../../../domain/entities/execution/ExecutionStep"

export class PrismaExecutionRepository implements ExecutionRepository {
  private prisma = getPrismaClient()

  async save(execution: Execution): Promise<void> {
    try {
      await this.prisma.execution.upsert({
        where: { id: execution.getId() },
        update: {
          status: execution.getStatus(),
        },
        create: {
          id: execution.getId(),
          processId: execution.getProcessId(),
          status: execution.getStatus(),
        },
      })
    } catch (error) {
      throw new Error(`Failed to save execution: ${(error as Error).message}`);
    }
  }

  async findById(id: string): Promise<Execution | null> {
    try {
      const row = await this.prisma.execution.findUnique({
        where: { id },
        include: { steps: true },
      })

      if (!row) return null

      return Execution.rehydrate({
        id: row.id,
        processId: row.processId,
        status: row.status as ExecutionStatus,
        steps: row.steps.map((step: {
          stepId: string
          status: string
        }) =>
          ExecutionStep.rehydrate({
            stepId: step.stepId,
            status: step.status as ExecutionStepStatus,
          })
        ),
      })
    } catch (error) {
      throw new Error(`Failed to find execution: ${(error as Error).message}`);
    }
  }
}