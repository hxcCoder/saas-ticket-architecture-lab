import { describe, it, expect, beforeEach } from '@jest/globals';
import { Execution } from '../Execution.js';
import { ExecutionStatus } from '../ExecutionStatus.js';
import { ExecutionStep, ExecutionStepStatus } from '../ExecutionStep.js';
import { Process } from '../../process/Process.js';
import { ProcessStep } from '../../process/ProcessStep.js';
import { InvalidProcessStateError } from '../../process/ProcessErrors.js';
import { ExecutionStarted } from '../events/ExecutionStarted.js';
import { ExecutionStepCompleted } from '../events/ExecutionStepCompleted.js';
import { ExecutionCompleted } from '../events/ExecutionCompleted.js';

describe('Execution Domain Entity', () => {
    let activeProcess: Process;
    let inactiveProcess: Process;

    beforeEach(() => {
        // Configuramos Procesos de prueba usando la propia API del dominio.
        // No utilizamos Application Fakes aquí para mantener el dominio aislado.
        activeProcess = Process.create('proc-1', 'Test Process', 'org-1');
        activeProcess.addStep(new ProcessStep({ id: 'step-1', name: 'Step 1', order: 1 }));
        activeProcess.addStep(new ProcessStep({ id: 'step-2', name: 'Step 2', order: 2 }));
        activeProcess.activate(); // Lo pasamos a estado ACTIVE

        inactiveProcess = Process.create('proc-2', 'Inactive Process', 'org-1');
        inactiveProcess.addStep(new ProcessStep({ id: 'step-3', name: 'Step 3', order: 1 }));
        // No lo activamos intencionalmente
    });

    describe('start()', () => {
        it('debe iniciar una ejecución y registrar el evento ExecutionStarted', () => {
            const execution = Execution.start('exec-1', activeProcess);

            expect(execution.getId()).toBe('exec-1');
            expect(execution.getProcessId()).toBe('proc-1');
            expect(execution.getStatus()).toBe(ExecutionStatus.RUNNING);
            expect(execution.getSteps().length).toBe(2);

            const events = execution.pullDomainEvents();
            expect(events).toHaveLength(1);
            expect(events[0]).toBeInstanceOf(ExecutionStarted);
        });

        it('debe lanzar InvalidProcessStateError si el proceso no está activo', () => {
            expect(() => {
                Execution.start('exec-2', inactiveProcess);
            }).toThrow(InvalidProcessStateError);
        });

        it('debe lanzar Error si el proceso no tiene pasos configurados', () => {
            const emptyProcess = Process.create('proc-3', 'Empty Process', 'org-1');
            emptyProcess.activate();

            expect(() => {
                Execution.start('exec-3', emptyProcess);
            }).toThrow('Execution must contain at least one step');
        });
    });

    describe('rehydrate()', () => {
        it('debe rehidratar la entidad correctamente sin emitir nuevos eventos', () => {
            const step1 = ExecutionStep.rehydrate({ stepId: 'step-1', status: ExecutionStepStatus.PENDING });
            const step2 = ExecutionStep.rehydrate({ stepId: 'step-2', status: ExecutionStepStatus.COMPLETED });
            
            const execution = Execution.rehydrate({
                id: 'exec-rehydrated',
                processId: 'proc-1',
                status: ExecutionStatus.RUNNING,
                steps: [step1, step2]
            });

            expect(execution.getId()).toBe('exec-rehydrated');
            expect(execution.getStatus()).toBe(ExecutionStatus.RUNNING);
            expect(execution.getSteps()).toHaveLength(2);
            expect(execution.pullDomainEvents()).toHaveLength(0); // Validamos que la rehidratación no dispare eventos
        });

        it('debe lanzar Error si se detectan pasos duplicados en la rehidratación', () => {
            const step1 = ExecutionStep.rehydrate({ stepId: 'step-1', status: ExecutionStepStatus.PENDING });
            const duplicateStep = ExecutionStep.rehydrate({ stepId: 'step-1', status: ExecutionStepStatus.PENDING });

            expect(() => {
                Execution.rehydrate({
                    id: 'exec-dup',
                    processId: 'proc-1',
                    status: ExecutionStatus.RUNNING,
                    steps: [step1, duplicateStep]
                });
            }).toThrow('Duplicate execution steps detected');
        });
    });

    describe('markStepDone()', () => {
        let execution: Execution;

        beforeEach(() => {
            execution = Execution.start('exec-prog', activeProcess);
            execution.pullDomainEvents(); // Limpiamos los eventos iniciales de 'start()'
        });

        it('debe marcar el paso como completado y registrar ExecutionStepCompleted', () => {
            execution.markStepDone('step-1');

            expect(execution.isStepCompleted('step-1')).toBe(true);
            
            const events = execution.pullDomainEvents();
            expect(events).toHaveLength(1);
            expect(events[0]).toBeInstanceOf(ExecutionStepCompleted);
        });

        it('debe finalizar la ejecución global si todos los pasos terminaron (y emitir ExecutionCompleted)', () => {
            execution.markStepDone('step-1');
            execution.markStepDone('step-2');

            expect(execution.getStatus()).toBe(ExecutionStatus.COMPLETED);
            
            const events = execution.pullDomainEvents();
            // Validamos que el último evento emitido marque el fin de la ejecución
            expect(events[events.length - 1]).toBeInstanceOf(ExecutionCompleted);
        });

        it('no debe mutar estado ni emitir eventos si el paso ya estaba completado', () => {
            execution.markStepDone('step-1');
            execution.pullDomainEvents(); // Limpiamos el evento del primer "done"

            execution.markStepDone('step-1'); // Intentamos marcarlo de nuevo

            expect(execution.pullDomainEvents()).toHaveLength(0);
        });

        it('debe lanzar Error si el ID del paso no pertenece a la ejecución', () => {
            expect(() => {
                execution.markStepDone('step-unknown');
            }).toThrow('Execution step not found');
        });

        it('debe lanzar Error si la ejecución ya no está en estado RUNNING', () => {
            execution.markStepDone('step-1');
            execution.markStepDone('step-2'); // Aquí pasa automáticamente a COMPLETED

            expect(() => {
                // Intentar mutar un estado de algo ya completado
                execution.markStepDone('step-1');
            }).toThrow('Cannot update steps when execution is not running');
        });
    });
});