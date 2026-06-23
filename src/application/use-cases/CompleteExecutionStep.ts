import { injectable, inject } from 'inversify';
import { ExecutionRepository } from './ports/ExecutionRepository.js';
import { AuditRepository } from './ports/AuditRepository.js';
import { UnitOfWork } from './ports/UnitOfWork.js';

@injectable()
export class CompleteExecutionStep {
  constructor(
    @inject('ExecutionRepository') private executionRepo: ExecutionRepository,
    @inject('AuditRepository') private auditRepo: AuditRepository,
    @inject('UnitOfWork') private unitOfWork: UnitOfWork
  ) {}

  async execute(executionId: string, stepId: string): Promise<void> {
    // 1. Lectura (Fuera de la transacción)
    const execution = await this.executionRepo.findById(executionId);
    if (!execution) throw new Error('Execution not found');

    // 2. Ejecutar regla de negocio / mutación de estado
    execution.markStepDone(stepId);

    // 3. Extraer eventos de dominio generados por markStepDone (ej. ExecutionStepCompleted)
    const domainEvents = execution.pullDomainEvents();

    // 4. Persistencia Atómica
    await this.unitOfWork.run(async () => {
      await this.executionRepo.save(execution);
      
      // Guardar los eventos en auditoría
      await this.auditRepo.saveEvents(domainEvents);
    });
  }
}