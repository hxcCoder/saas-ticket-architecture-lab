import { DomainEvent } from "../../audit/shared/DomainEvent";

export class ExecutionCompleted implements DomainEvent {
  readonly occurredOn: Date;

  constructor(
    public readonly executionId: string
  ) {
    this.occurredOn = new Date();
  }
}
