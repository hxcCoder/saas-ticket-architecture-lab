import { ProcessRepository } from "./ports/ProcessRepository";
import { ExecutionRepository } from "./ports/ExecutionRepository";
import { Execution } from "../../domain/entities/execution/Execution";

export class StartExecution {
  constructor(
    private readonly processRepo: ProcessRepository,
    private readonly executionRepo: ExecutionRepository
  ) {}

  async execute(command: {
    executionId: string;
    processId: string;
  }): Promise<void> {
    const process = await this.processRepo.findById(command.processId);

    if (!process) {
      throw new Error("Process not found");
    }

    const execution = Execution.start(
      command.executionId,
      process
    );

    await this.executionRepo.save(execution);
  }
}
