import { DomainEvent } from "../../audit/shared/DomainEvent";

export class ProcessArchived implements DomainEvent {
    readonly occurredOn: Date;

constructor(public readonly processId: string) {
    this.occurredOn = new Date();
}
}
