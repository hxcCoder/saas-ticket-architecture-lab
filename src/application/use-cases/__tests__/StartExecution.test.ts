import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { StartExecution } from '../StartExecution.js';
import { InMemoryExecutionRepository } from '../ports/test/fakes/InMemoryExecutionRepository.js';
import { InMemoryProcessRepository } from '../ports/test/fakes/InMemoryProcessRepository.js';
import { InMemoryAuditRepository } from '../ports/test/fakes/InMemoryAuditRepository.js';
import { InMemoryUnitOfWork } from '../ports/test/fakes/InMemoryUnitOfWork.js';
import { ProcessFactory } from './fakes/ProcessFactory.js';
import { ProcessNotActive } from '../../../domain/entities/execution/ExecutionErrors.js';

describe('StartExecution Use Case', () => {
    let execRepo: InMemoryExecutionRepository;
    let processRepo: InMemoryProcessRepository;
    let auditRepo: InMemoryAuditRepository;
    let uow: InMemoryUnitOfWork;
    let useCase: StartExecution;

beforeEach(() => {
    execRepo = new InMemoryExecutionRepository();
    processRepo = new InMemoryProcessRepository();
    auditRepo = new InMemoryAuditRepository();
    uow = new InMemoryUnitOfWork();
    useCase = new StartExecution(execRepo, processRepo, auditRepo, uow);
});

it('should start execution for an active process', async () => {
    const process = ProcessFactory.withSteps('proc1', 'My Process', 'org1', [
        { id: 's1', name: 'Step 1', order: 1 }
    ]);
    process.activate();
    await processRepo.save(process);

    await useCase.execute('proc1', 'exec1');

    const execution = await execRepo.findById('exec1');
    expect(execution).not.toBeNull();
    expect(execution?.getStatus()).toBe('RUNNING');
    expect(execution?.getSteps().length).toBe(1);

    const events = auditRepo.getEvents();
    expect(events.some(e => e.constructor.name === 'ExecutionStarted')).toBe(true);
});

it('should throw if process is not active', async () => {
    const process = ProcessFactory.create('proc2', 'Inactive', 'org1');
    await processRepo.save(process);

    await expect(useCase.execute('proc2', 'exec2')).rejects.toThrow(ProcessNotActive);
});

    it('should throw if process not found', async () => {
    await expect(useCase.execute('non-existent', 'exec3')).rejects.toThrow(ProcessNotActive);
});
});