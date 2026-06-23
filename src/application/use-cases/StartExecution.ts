import { injectable, inject } from 'inversify';
import { ExecutionRepository } from './ports/ExecutionRepository.js';
import { ProcessRepository } from './ports/ProcessRepository.js';
import { AuditRepository } from './ports/AuditRepository.js';
import { UnitOfWork } from './ports/UnitOfWork.js'; 
import { Execution } from '../../domain/entities/execution/Execution.js';
import { ProcessNotActive } from '../../domain/entities/execution/ExecutionErrors.js';

@injectable()
export class StartExecution {
  constructor(
    @inject('ExecutionRepository') private executionRepo: ExecutionRepository,
    @inject('ProcessRepository') private processRepo: ProcessRepository,
    @inject('AuditRepository') private auditRepo: AuditRepository,
    @inject('UnitOfWork') private unitOfWork: UnitOfWork // 
  ) {}

  async execute(processId: string, executionId: string): Promise<void> {
    // 1. Lectura (fuera de la transacción para no bloquear la BD innecesariamente)
    const process = await this.processRepo.findById(processId);
    if (!process || !process.isActive()) {
      throw new ProcessNotActive();
    }
    
    // 2. Lógica de Dominio
    const execution = Execution.start(executionId, process);

    //  Extraemos los eventos ANTES de pasarlos a los repositorios
    const domainEvents = execution.pullDomainEvents();

    // 3. Transacción Atómica
    await this.unitOfWork.run(async () => {
      // Como tu PrismaExecutionRepository fue modificado para usar this.db,
      // ahora se acoplará perfectamente a esta transacción invisible.
      await this.executionRepo.save(execution);
      
      // Usamos los eventos que extrajimos en la línea 29
      await this.auditRepo.saveEvents(domainEvents);
    });
  }
}