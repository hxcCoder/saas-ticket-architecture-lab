import { Container } from 'inversify';
import { ExecutionRepository } from '../../application/use-cases/ports/ExecutionRepository';
import { AuditRepository } from '../../application/use-cases/ports/AuditRepository';
import { PrismaExecutionRepository } from '../persistence/prisma/PrismaExecutionRepository';
import { PrismaAuditRepository } from '../persistence/prisma/PrismaAuditRepository';
import { StartExecution } from '../../application/use-cases/StartExecution';
import { ProcessController } from '../../interfaces/http/ProcessController';
import { ProcessRoutes } from '../../interfaces/http/ProcessRoutes';

const container = new Container();
container.bind<ExecutionRepository>('ExecutionRepository').to(PrismaExecutionRepository);
container.bind<AuditRepository>('AuditRepository').to(PrismaAuditRepository);
container.bind(StartExecution).toSelf();
container.bind(ProcessController).toSelf();
container.bind(ProcessRoutes).toSelf();

export { container };