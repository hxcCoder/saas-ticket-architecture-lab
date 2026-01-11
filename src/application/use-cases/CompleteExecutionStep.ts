import { ExecutionRepository } from "./ports/ExecutionRepository";
import { AuditRepository } from "./ports/AuditRepository";

type Input = {
    executionId: string;
    stepId: string;
};

export class CompleteExecutionStep {
    constructor(
    private readonly executionRepository: ExecutionRepository,
    private readonly auditRepository: AuditRepository
) {}

async execute(input: Input): Promise<void> {
    const execution = await this.executionRepository.findById(input.executionId);

    if (!execution) {
        throw new Error("Execution not found");
    }

    execution.markStepDone(input.stepId);

    await this.executionRepository.save(execution);

    for (const event of execution.pullDomainEvents()) {
        await this.auditRepository.save(event);
    }
}
}
