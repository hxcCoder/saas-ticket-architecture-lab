import { describe, it, expect, beforeEach } from '@jest/globals';
import { CompleteExecutionStep } from '../../CompleteExecutionStep.js';
import { InMemoryExecutionRepository } from './fakes/InMemoryExecutionRepository.js';
import { InMemoryAuditRepository } from './fakes/InMemoryAuditRepository.js';
import { InMemoryUnitOfWork } from './fakes/InMemoryUnitOfWork.js';
import { ExecutionFactory } from '../../__tests__/fakes/ExecutionFactory.js';

describe('CompleteExecutionStep Use Case', () => {
  let repo: InMemoryExecutionRepository;
  let auditRepo: InMemoryAuditRepository;
  let uow: InMemoryUnitOfWork;
  let useCase: CompleteExecutionStep;

  beforeEach(() => {
    repo = new InMemoryExecutionRepository();
    auditRepo = new InMemoryAuditRepository();
    uow = new InMemoryUnitOfWork();
    useCase = new CompleteExecutionStep(repo, auditRepo, uow);
  });

  it('should mark step as completed and save events', async () => {
    const execution = ExecutionFactory.createExecution();
    await repo.save(execution);

    await useCase.execute(execution.getId(), 'step1');

    const updated = await repo.findById(execution.getId());
    expect(updated?.isStepCompleted('step1')).toBe(true);

    const events = auditRepo.getEvents();
    expect(events.some(e => e.constructor.name === 'ExecutionStepCompleted')).toBe(true);
  });

  it('should throw if execution not found', async () => {
    await expect(useCase.execute('non-existent', 'step1')).rejects.toThrow('Execution not found');
  });
});