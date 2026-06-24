import { describe, it, expect } from '@jest/globals';
import { ExecutionStep, ExecutionStepStatus } from '../ExecutionStep.js';
import { ProcessStep } from '../../process/ProcessStep.js';

describe('ExecutionStep Domain Entity', () => {
    it('debe crearse desde un ProcessStep correctamente (fromProcessStep)', () => {
        // Usamos un ProcessStep ficticio simulando la entrada desde el agregado Process
        const processStep = new ProcessStep({ id: 'step-1', name: 'Validación', order: 1 });
        const step = ExecutionStep.fromProcessStep(processStep);
        
        expect(step.getStepId()).toBe('step-1');
        expect(step.isDone()).toBe(false);
    });

    it('debe rehidratarse con un estado previo (rehydrate)', () => {
        const step = ExecutionStep.rehydrate({ 
            stepId: 'step-2', 
            status: ExecutionStepStatus.DONE 
        });

        expect(step.getStepId()).toBe('step-2');
        expect(step.isDone()).toBe(true);
    });

    it('debe marcarse como completado si estaba pendiente (markDone)', () => {
        const step = ExecutionStep.rehydrate({ 
            stepId: 'step-3', 
            status: ExecutionStepStatus.PENDING 
        });

        expect(step.isDone()).toBe(false);
        step.markDone();
        expect(step.isDone()).toBe(true);
    });
});