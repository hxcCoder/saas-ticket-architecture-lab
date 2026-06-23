import { describe, it, expect, beforeEach } from '@jest/globals';
import { CompleteExecutionStep } from '../../CompleteExecutionStep.js';
import { InMemoryExecutionRepository } from './fakes/InMemoryExecutionRepository.js';
import { ExecutionStep } from './../../../../domain/entities/execution/ExecutionStep.js';

describe('CompleteExecutionStep Use Case', () => {
  let repo: InMemoryExecutionRepository;
  let useCase: CompleteExecutionStep;

  beforeEach(() => {
    repo = new InMemoryExecutionRepository();
    useCase = new CompleteExecutionStep(repo);
  });

  it('should mark step as completed', async () => {
    // 🔹 Creamos un step mock
    const stepMock: any = {
      getId: () => 'step1',
      getName: () => 'Step 1'
    };
    const step = ExecutionStep.fromProcessStep(stepMock);

    // 🔹 Creamos la ejecución in-memory
    const execution = repo.createDummyExecution([step]);
    await repo.save(execution);

    // 🔹 Ejecutamos el use case
    await useCase.execute(execution.getId(), 'step1');

    // 🔹 Verificamos que el step está completado
    const updated = await repo.findById(execution.getId());
    expect(updated?.isStepCompleted('step1')).toBe(true);

    // 🔹 Opcional: verificamos que el evento se registró
    const events = updated?.pullDomainEvents() ?? [];
    expect(events.some(e => e.constructor.name === 'ExecutionStepCompleted')).toBe(true);
  });
});
