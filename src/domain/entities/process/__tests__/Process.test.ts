import { describe, it, expect, beforeEach } from '@jest/globals';
import { Process } from '../Process.js';
import { ProcessStep } from '../ProcessStep.js';
import { ProcessStatus } from '../ProcessStatus.js'; // Asumiendo que existe según tu árbol
import { ProcessCreated } from '../events/ProcessCreated.js';
import { ProcessActivated } from '../events/ProcessActivated.js';

describe('Process Domain Entity', () => {
    it('debe crear un nuevo proceso y emitir el evento ProcessCreated', () => {
        const process = Process.create('proc-1', 'Onboarding', 'org-1');
        
        expect(process.getId()).toBe('proc-1');
        expect(process.isActive()).toBe(false); // Al nacer, no debería estar activo
        
        const events = process.pullDomainEvents();
        expect(events).toHaveLength(1);
        expect(events[0].constructor.name).toBe('ProcessCreated');
    });

    it('debe permitir añadir pasos (ProcessStep) correctamente', () => {
        const process = Process.create('proc-1', 'Onboarding', 'org-1');
        const step = new ProcessStep({ id: 'step-1', name: 'Validación KYC', order: 1 });
        
        process.addStep(step);
        
        const steps = process.getSteps();
        expect(steps).toHaveLength(1);
        expect(steps[0]).toBe(step); // Verifica que sea la misma instancia
    });

    it('debe activar el proceso y emitir ProcessActivated', () => {
        const process = Process.create('proc-1', 'Onboarding', 'org-1');
        process.addStep(new ProcessStep({ id: 'step-1', name: 'Validación KYC', order: 1 }));
        process.pullDomainEvents(); // Limpiar eventos de la creación

        process.activate();
        
        expect(process.isActive()).toBe(true);
        
        const events = process.pullDomainEvents();
        expect(events).toHaveLength(1);
        expect(events[0].constructor.name).toBe('ProcessActivated');
    });

    it('debe fallar al intentar activar un proceso sin pasos configurados', () => {
        const process = Process.create('proc-2', 'Empty Process', 'org-1');
        
        // En DDD, activar un proceso sin pasos suele ser un estado inválido.
        // Si tienes esta regla de negocio, este test la cubre:
        expect(() => {
            process.activate();
        }).toThrow(); // Si usas un Custom Error, pon .toThrow(TuErrorCustom)
    });
});