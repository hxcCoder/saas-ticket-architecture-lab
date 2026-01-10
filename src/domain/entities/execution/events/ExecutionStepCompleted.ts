import { DomainEvent } from "../../audit/shared/DomainEvent";

export class ExecutionStepCompleted implements DomainEvent {
  readonly occurredOn: Date;

  constructor(
    public readonly executionId: string,
    public readonly stepId: string
  ) {
    this.occurredOn = new Date();
  }
}
