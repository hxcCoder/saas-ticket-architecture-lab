import { injectable } from 'inversify';
import { getPrismaClient } from './PrismaClient.js';
import { Prisma } from '../../../generated/prisma/index.js';
import { UnitOfWork } from '../../../application/use-cases/ports/UnitOfWork.js';
import { transactionStorage } from './PrismaContext.js';

@injectable()
export class PrismaUnitOfWork implements UnitOfWork {
  private readonly prisma = getPrismaClient();

  async run<T>(work: () => Promise<T>): Promise<T> {
    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      
      return transactionStorage.run(tx, work);
      
    }, {
      
      maxWait: 10000, // Tiempo máximo para conectarse (10 segundos)
      timeout: 20000  // Tiempo máximo para que dure la transacción (20 segundos)
    });
  }
}