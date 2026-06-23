import { AsyncLocalStorage } from 'async_hooks';
import { Prisma } from '../../../generated/prisma/client.js'; 

export const transactionStorage = new AsyncLocalStorage<Prisma.TransactionClient>();