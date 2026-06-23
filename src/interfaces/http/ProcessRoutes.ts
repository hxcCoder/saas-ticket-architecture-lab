import { Router } from 'express';
// 🚀 SOLUCIÓN A LOS ERRORES: Añadimos .js al final de las rutas locales
import { ProcessController } from './ProcessController.js';
import { container } from '../../infrastructure/config/container.js';

export class ProcessRoutes {
  public router: Router;
  private controller: ProcessController;

  constructor() {
    this.router = Router();
    this.controller = container.get(ProcessController);
    this.initRoutes();
  }

  private initRoutes(): void {
    // Paso 2 del Dashboard: Procesa el POST /api/processes
    this.router.post('/', this.controller.create.bind(this.controller));
    
    // Paso 3 del Dashboard: Procesa las ejecuciones
    this.router.post('/start-execution', this.controller.startExecution.bind(this.controller));
  }
}