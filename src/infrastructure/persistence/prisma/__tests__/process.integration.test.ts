import { describe, it, expect, beforeAll } from '@jest/globals';
import { PrismaUnitOfWork } from '../PrismaUnitOfWork.js';
import { PrismaProcessRepository } from '../PrismaProcessRepository.js';
import { Process } from '../../../../domain/entities/process/Process.js';
import { ProcessStep } from '../../../../domain/entities/process/ProcessStep.js';
import { getPrismaClient } from '../PrismaClient.js';

beforeAll(async () => {
  // 1. Creamos la organización padre para que no falle la llave foránea
  await prisma.organization.upsert({
    where: { id: "org-123" },
    update: {},
    create: {
      id: "org-123",
      name: "Test Org",
      status: "ACTIVE",
      plan: "PRO"
    }
  });
});

const prisma = getPrismaClient();
const uow = new PrismaUnitOfWork();
const processRepo = new PrismaProcessRepository();

describe('Process Repository Integration', () => {
  beforeAll(async () => {
    await prisma.processStep.deleteMany({});
    await prisma.process.deleteMany({});
  });

  it('should save and retrieve a process with steps', async () => {
    const process = Process.create('p1', 'Test Process', 'org1');
    process.addStep(new ProcessStep({ id: 's1', name: 'Step 1', order: 1 }));
    process.addStep(new ProcessStep({ id: 's2', name: 'Step 2', order: 2 }));

    await uow.run(async () => await processRepo.save(process));

    const loaded = await processRepo.findById('p1');
    expect(loaded).not.toBeNull();
    expect(loaded!.getId()).toBe(process.getId());
    expect(loaded!.getSteps().length).toBe(2);
  });
});