import { DomainEvent } from "../../audit/shared/DomainEvent";

export class ProcessCreated extends DomainEvent {
  constructor(
    public readonly processId: string,
    public readonly name: string
  ) {
    super();
  }

  getEventName(): string {
    return "process.created";
  }
}
