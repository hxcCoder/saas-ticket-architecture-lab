import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { CreateAndActivateProcess } from '../CreateAndActivateProcess.js';
import { InMemoryProcessRepository } from '../ports/test/fakes/InMemoryProcessRepository.js';
import { InMemoryUnitOfWork } from '../ports/test/fakes/InMemoryUnitOfWork.js';
import { SubscriptionService } from '../ports/SubscriptionService.js';

describe('CreateAndActivateProcess Use Case', () => {
    let processRepo: InMemoryProcessRepository;
    let uow: InMemoryUnitOfWork;
    let subscriptionService: jest.Mocked<SubscriptionService>;
    let useCase: CreateAndActivateProcess;

beforeEach(() => {
    processRepo = new InMemoryProcessRepository();
    uow = new InMemoryUnitOfWork();
    subscriptionService = {
        canCreateProcess: jest.fn()
    } as any;
    useCase = new CreateAndActivateProcess(processRepo, subscriptionService, uow);
});

it('should create and activate a process with steps', async () => {
    subscriptionService.canCreateProcess.mockResolvedValue(true);

    const input = {
        id: 'p1',
        organizationId: 'org1',
        name: 'My Process',
        steps: [
        { id: 's1', name: 'Step 1', order: 1 },
        { id: 's2', name: 'Step 2', order: 2 }
    ]
    };

    await useCase.execute(input);

    const saved = await processRepo.findById('p1');
    expect(saved).not.toBeNull();
    expect(saved?.getStatus()).toBe('ACTIVE');
    expect(saved?.getSteps().length).toBe(2);
    expect(subscriptionService.canCreateProcess).toHaveBeenCalledWith('org1');
});

it('should throw if subscription limit reached', async () => {
    subscriptionService.canCreateProcess.mockResolvedValue(false);

    const input = {
        id: 'p2',
        organizationId: 'org1',
        name: 'My Process',
        steps: [{ id: 's1', name: 'Step 1', order: 1 }]
    };

    await expect(useCase.execute(input)).rejects.toThrow('Plan limit reached');
    const saved = await processRepo.findById('p2');
    expect(saved).toBeNull();
});
});