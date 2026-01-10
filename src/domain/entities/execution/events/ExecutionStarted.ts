import { DomainEvent } from "../../audit/shared/DomainEvent";

export class ExecutionStarted extends DomainEvent {
  static readonly EVENT_NAME = "execution.started";

  readonly executionId: string;
  readonly processId: string;

  constructor(executionId: string, processId: string) {
    super();
    this.executionId = executionId;
    this.processId = processId;
  }
}
