import { DomainEvent } from "../../audit/shared/DomainEvent";

export class ProcessActivated implements DomainEvent {
    readonly occurredOn: Date;

    constructor(public readonly processId: string) {
    this.occurredOn = new Date();
}
}
