import { PrismaClient } from "../../../generated/prisma/index.js";
import { getPrismaClient } from "./PrismaClient.js";
import { transactionStorage } from "./PrismaContext.js";
import {
  OutboxRepository,
  OutboxEvent
} from "../../../application/use-cases/ports/OutBoxRepository.js";

export class PrismaOutboxRepository implements OutboxRepository {
  private readonly prisma: PrismaClient = getPrismaClient();

  private get db() {
    const tx = transactionStorage.getStore();
    return tx ? tx : this.prisma;
  }

  async save(event: OutboxEvent): Promise<void> {
    await this.db.outbox.create({
      data: {
        id: event.id,
        eventName: event.eventName,
        payload: event.payload ?? {},
        occurredOn: event.occurredOn,
        published: event.published,
      },
    });
  }

  async findPending(limit = 100): Promise<OutboxEvent[]> {
    const rows = await this.db.outbox.findMany({
      where: { published: false },
      take: limit,
    });

    return rows.map((r: any) => ({
      id: r.id,
      eventName: r.eventName,
      payload: r.payload,
      occurredOn: r.occurredOn,
      published: r.published,
    }));
  }

  async markAsPublished(id: string): Promise<void> {
    await this.db.outbox.update({
      where: { id },
      data: { published: true },
    });
  }
}