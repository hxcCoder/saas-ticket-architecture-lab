// src/application/use-cases/ports/UnitOfWork.ts
import { PrismaClient } from '../../../generated/prisma/client';
import { OutboxRepository } from '../../../infrastructure/persistence/prisma/PrismaOutboxRepository';

export interface UnitOfWork {
    run<T>(work: () => Promise<T>): Promise<T>;
}
export class PrismaUnitOfWork {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly outboxRepo: OutboxRepository
  ) {}

  /**
   * Ejecuta una función dentro de una transacción atómica
   * ⚠️ En Prisma 5+, el tipo de 'tx' dentro de $transaction es un PrismaClient "recortado"
   */
  async executeInTransaction<T>(fn: (tx: PrismaClient) => Promise<T>): Promise<T> {
    return this.prisma.$transaction(async (tx) => {
      // 'tx' aquí es de tipo Omit<PrismaClient, "$transaction" | ...>
      // Forzamos el tipo para que TypeScript acepte
      const prismaTx = tx as unknown as PrismaClient;
      return fn(prismaTx);
    });
    
  }
  
}
