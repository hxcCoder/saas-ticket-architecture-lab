import { DomainEvent } from "../../../../../domain/entities/audit/shared/DomainEvent.js";
import { AuditRepository } from "../../AuditRepository.js";

export class InMemoryAuditRepository implements AuditRepository {
    private events: DomainEvent[] = [];

    async saveEvents(events: DomainEvent[]): Promise<void> {
    this.events.push(...events);
}

getEvents(): DomainEvent[] {
    return this.events;
}

clear(): void {
    this.events = [];
}
}