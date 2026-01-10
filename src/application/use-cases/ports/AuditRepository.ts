import { DomainEvent } from "../../../domain/entities/audit/shared/DomainEvent";

export interface AuditRepository {
    save(event: DomainEvent): Promise<void>;
}
