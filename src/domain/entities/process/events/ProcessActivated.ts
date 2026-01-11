import { DomainEvent } from "../../audit/shared/DomainEvent";

export class ProcessActivated extends DomainEvent {
  constructor(public readonly processId: string) {
    super();
  }

  getEventName(): string {
    return "process.activated";
  }
}
