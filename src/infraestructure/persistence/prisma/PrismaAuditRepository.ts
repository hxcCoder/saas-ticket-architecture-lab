import { AuditRepository } from "../../../application/use-cases/ports/AuditRepository";
import { DomainEvent } from "../../../domain/entities/audit/shared/DomainEvent";
import { prisma } from "../PrismaClient";

export class PrismaAuditRepository implements AuditRepository {

  async save(event: DomainEvent): Promise<void> {
    await prisma.auditEvent.create({
  data: {
    id: event.id,
    name: event.getEventName(),
    occurredOn: event.occurredOn,
    payload: JSON.stringify(event),
  },
});

  }
}
