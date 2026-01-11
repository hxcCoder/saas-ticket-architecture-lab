import crypto from "crypto";

export abstract class DomainEvent {
    public readonly id: string;
    public readonly occurredOn: Date;

    protected constructor(id?: string, occurredOn?: Date) {
    this.id = id ?? crypto.randomUUID();
    this.occurredOn = occurredOn ?? new Date();
}

    abstract getEventName(): string;
}
