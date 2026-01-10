import { ProcessStep } from "../process/ProcessStep";

export enum ExecutionStepStatus {
  PENDING = "PENDING",
  DONE = "DONE",
}

export class ExecutionStep {
  private readonly stepId: string;
  private status: ExecutionStepStatus;

  private constructor(stepId: string) {
    this.stepId = stepId;
    this.status = ExecutionStepStatus.PENDING;
  }

  static fromProcessStep(step: ProcessStep): ExecutionStep {
    return new ExecutionStep(step.id);
  }

  markAsDone(): void {
    this.status = ExecutionStepStatus.DONE;
  }

  isDone(): boolean {
    return this.status === ExecutionStepStatus.DONE;
  }

  getStepId(): string {
    return this.stepId;
  }
}
