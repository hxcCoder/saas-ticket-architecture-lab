    import { DomainEvent } from "../../../domain/entities/audit/shared/DomainEvent.js";

    export interface AuditRepository {
        saveEvents(events: DomainEvent[]): Promise<void>;
    }
