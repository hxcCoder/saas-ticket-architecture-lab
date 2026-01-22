// src/infraestructure/persistence/prisma/PrismaOutboxRepository.ts
import { PrismaClient, Outbox as PrismaOutbox } from "../../../generated/prisma";

export interface OutboxRepository {
  save(event: PrismaOutbox): Promise<void>;
  findPending(limit?: number): Promise<PrismaOutbox[]>;
  markAsPublished(id: string): Promise<void>;
}

export class PrismaOutboxRepository implements OutboxRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(event: PrismaOutbox) {
    await this.prisma.outbox.create({
      data: { ...event, payload: event.payload ?? {} },
    });
  }

  async findPending(limit = 100) {
    return this.prisma.outbox.findMany({
      where: { published: false },
      take: limit,
      orderBy: { occurredOn: "asc" },
    });
  }

  async markAsPublished(id: string) {
    await this.prisma.outbox.update({
      where: { id },
      data: { published: true },
    });
  }
}
