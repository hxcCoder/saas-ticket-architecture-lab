import { DomainEvent } from "../../audit/shared/DomainEvent";

export class ProcessCreated implements DomainEvent {
    readonly occurredOn: Date;

constructor(
    public readonly processId: string,
    public readonly name: string
) {
    this.occurredOn = new Date();
}
}
