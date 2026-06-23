import { AuditRepository } from "../../../application/use-cases/ports/AuditRepository.js";
import { DomainEvent } from "../../../domain/entities/audit/shared/DomainEvent.js";
import { getPrismaClient } from "./PrismaClient.js";
import { Prisma } from "../../../generated/prisma/index.js";
import { transactionStorage } from "./PrismaContext.js";

export class PrismaAuditRepository implements AuditRepository {
  private readonly prisma = getPrismaClient();

  private get db() {
    const tx = transactionStorage.getStore();
    return tx ? tx : this.prisma;
  }

  async saveEvents(events: DomainEvent[]): Promise<void> {
    try {
      for (const event of events) {
        const primitives = event.toPrimitives();

        await this.db.auditLog.create({
          data: {
            eventId: event.eventId,
            eventName: event.getEventName(),
            eventData: primitives as Prisma.InputJsonValue,
            payload: primitives as Prisma.InputJsonValue,
            occurredOn: event.occurredOn,
          },
        });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to save events: ${error.message}`);
      }
      throw new Error("Failed to save events");
    }
  }
}