import { Request, Response } from 'express';
import { StartExecution } from '../../application/use-cases/StartExecution';
import { z } from 'zod';

const startExecutionSchema = z.object({
  processId: z.string().uuid(),
  executionId: z.string().uuid(),
});

export class ProcessController {
  constructor(private startExecUseCase: StartExecution) {} // Renombrado para evitar duplicado

  async startExecution(req: Request, res: Response): Promise<void> {
    try {
      const { processId, executionId } = startExecutionSchema.parse(req.body);
      await this.startExecUseCase.execute(processId, executionId);
      res.status(201).send();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Invalid input' });
      } else {
        res.status(500).json({ error: (error as Error).message });
      }
    }
  }
}