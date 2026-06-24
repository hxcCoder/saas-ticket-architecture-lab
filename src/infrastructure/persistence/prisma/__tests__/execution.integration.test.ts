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
    // Limpiamos las tablas hijas primero para evitar conflictos
    await prisma.executionStep.deleteMany({});
    await prisma.execution.deleteMany({});
  });

  it('should save and retrieve an execution', async () => {
    // 1. Generamos la ejecución simulada desde tu Factory
    const execution = ExecutionFactory.createExecution();
    const processId = execution.getProcessId(); // Obtenemos el ID del proceso generado
    const orgId = "org-test-exec"; 

    // 2. CREAMOS LOS REGISTROS PADRE (Para que la Foreign Key Constraint no explote)
    
    // a) Crear la Organización
    await prisma.organization.upsert({
      where: { id: orgId },
      update: {},
      create: {
        id: orgId,
        name: "Test Organization",
        status: "ACTIVE",
        plan: "PRO"
      }
    });

    // b) Crear el Proceso usando exactamente el processId que pide la Ejecución
    await prisma.process.upsert({
      where: { id: processId },
      update: {},
      create: {
        id: processId,
        name: "Test Process for Execution",
        organizationId: orgId,
        status: "ACTIVE"
      }
    });

    // 3. Guardamos la ejecución usando tu transacción invisible
    await uow.run(async () => {
      await repo.save(execution);
    });

    // 4. Afirmaciones (Asserts)
    const loaded = await repo.findById(execution.getId());
    expect(loaded).not.toBeNull();
    expect(loaded!.getId()).toBe(execution.getId());
    expect(loaded!.getSteps().length).toBe(execution.getSteps().length);
  });
});