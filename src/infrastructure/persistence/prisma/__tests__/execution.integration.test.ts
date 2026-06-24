import { describe, it, expect, beforeAll, jest } from '@jest/globals';
import { PrismaUnitOfWork } from '../PrismaUnitOfWork.js';
import { PrismaExecutionRepository } from '../PrismaExecutionRepository.js';
import { ExecutionFactory } from '../../../../application/use-cases/test/fakes/ExecutionFactory.js';
import { getPrismaClient } from '../PrismaClient.js';

const prisma = getPrismaClient();
const outboxRepo = {
  save: jest.fn(),
  findPending: jest.fn(),
  markAsPublished: jest.fn(),
};
const uow = new PrismaUnitOfWork();
const repo = new PrismaExecutionRepository(outboxRepo as any);

describe('Execution Repository Integration', () => {
  beforeAll(async () => {
    await prisma.executionStep.deleteMany({});
    await prisma.execution.deleteMany({});
  });

  it('should save and retrieve an execution', async () => {
    const execution = ExecutionFactory.createExecution();
    await uow.run(async () => await repo.save(execution));

    const loaded = await repo.findById(execution.getId());
    expect(loaded).not.toBeNull();
    expect(loaded!.getId()).toBe(execution.getId());
    expect(loaded!.getSteps().length).toBe(execution.getSteps().length);
  });
});