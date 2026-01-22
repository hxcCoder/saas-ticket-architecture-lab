import { Router } from 'express';
import { ProcessController } from './ProcessController';
import { container } from '../../infraestructure/config/container';

export class ProcessRoutes {
  public router: Router;
  private controller: ProcessController;

  constructor() {
    this.router = Router();
    this.controller = container.get(ProcessController);
    this.initRoutes();
  }

  private initRoutes(): void {
    this.router.post('/start-execution', this.controller.startExecution.bind(this.controller));
    // Agrega más rutas si hay otros métodos en controller
  }
}