import { Container } from 'inversify';
import 'reflect-metadata'; // Asegúrate de tener esta importación al inicio para Inversify

// Interfaces/Puertos (Application)
import { ExecutionRepository } from '../../application/use-cases/ports/ExecutionRepository.js';
import { AuditRepository } from '../../application/use-cases/ports/AuditRepository.js';
import { ProcessRepository } from '../../application/use-cases/ports/ProcessRepository.js';
import { SubscriptionService } from '../../application/use-cases/ports/SubscriptionService.js';
import { UnitOfWork } from '../../application/use-cases/ports/UnitOfWork.js';
import { OutboxRepository } from '../../application/use-cases/ports/OutBoxRepository.js';

// Adaptadores de Persistencia (Infrastructure)
import { PrismaExecutionRepository } from '../persistence/prisma/PrismaExecutionRepository.js';
import { PrismaAuditRepository } from '../persistence/prisma/PrismaAuditRepository.js';
import { PrismaProcessRepository } from '../persistence/prisma/PrismaProcessRepository.js';
import { PrismaOutboxRepository } from '../persistence/prisma/PrismaOutboxRepository.js';
import { PrismaUnitOfWork } from '../persistence/prisma/PrismaUnitOfWork.js';
import { SubscriptionServiceImpl } from '../persistence/services/SubscriptionServiceImpl.js';

// Casos de Uso
import { StartExecution } from '../../application/use-cases/StartExecution.js';
import { CreateAndActivateProcess } from '../../application/use-cases/CreateAndActivateProcess.js';

// Controladores e Interfaces HTTP
import { ProcessController } from '../../interfaces/http/ProcessController.js';
import { ProcessRoutes } from '../../interfaces/http/ProcessRoutes.js';

const container = new Container();

// --- BINDINGS DE TU ARQUITECTURA ---

// Repositorios y Servicios
container.bind<ExecutionRepository>('ExecutionRepository').to(PrismaExecutionRepository).inSingletonScope();
container.bind<AuditRepository>('AuditRepository').to(PrismaAuditRepository).inSingletonScope();
container.bind<ProcessRepository>('ProcessRepository').to(PrismaProcessRepository).inSingletonScope();
container.bind<OutboxRepository>('OutBoxRepository').to(PrismaOutboxRepository).inSingletonScope();
container.bind<UnitOfWork>('UnitOfWork').to(PrismaUnitOfWork).inSingletonScope();
container.bind<SubscriptionService>('SubscriptionService').to(SubscriptionServiceImpl).inSingletonScope();

// Casos de Uso
container.bind<StartExecution>(StartExecution).toSelf().inSingletonScope();
container.bind<CreateAndActivateProcess>(CreateAndActivateProcess).toSelf().inSingletonScope();

// Capa HTTP (Controlador y Rutas)
container.bind<ProcessController>(ProcessController).toSelf().inSingletonScope();
container.bind<ProcessRoutes>(ProcessRoutes).toSelf().inSingletonScope();

export { container };