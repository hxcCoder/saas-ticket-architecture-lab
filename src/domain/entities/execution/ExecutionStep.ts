import { ProcessStep } from "../process/ProcessStep";

export enum ExecutionStepStatus {
    PENDING = "PENDING",
    DONE = "DONE",
    FAILED = "FAILED",
}

export class ExecutionStep {
    private readonly stepId: string;
    private status: ExecutionStepStatus;

    private constructor(stepId: string) {
        this.stepId = stepId;
        this.status = ExecutionStepStatus.PENDING;
    }

    static fromProcessStep(step: ProcessStep): ExecutionStep {
        return new ExecutionStep(step.getId());
    }

    markDone(): void {
        if (this.status !== ExecutionStepStatus.PENDING) return;
        this.status = ExecutionStepStatus.DONE;
    }

    isDone(): boolean {
        return this.status === ExecutionStepStatus.DONE;
    }
    getStepId(): string {
return this.stepId;
}

}
