import { DomainEvent } from "../../audit/shared/DomainEvent";

export class ExecutionStarted extends DomainEvent {
  constructor(
    public readonly executionId: string,
    public readonly processId: string
  ) {
    super();
  }

  getEventName(): string {
    return "execution.started";
  }
}
