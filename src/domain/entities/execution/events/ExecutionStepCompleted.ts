import { DomainEvent } from "../../audit/shared/DomainEvent";

export class ExecutionStepCompleted extends DomainEvent {
  constructor(
    public readonly executionId: string,
    public readonly stepId: string
  ) {
    super();
  }

  getEventName(): string {
    return "execution.step.completed";
  }
}
