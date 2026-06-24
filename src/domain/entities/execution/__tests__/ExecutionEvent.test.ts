import { describe, it, expect } from '@jest/globals';
// Corregido: Se añade la carpeta "events/" a las rutas
import { ExecutionStarted } from '../events/ExecutionStarted.js';
import { ExecutionCompleted } from '../events/ExecutionCompleted.js';
import { ExecutionStepCompleted } from '../events/ExecutionStepCompleted.js';

describe('Execution Domain Events', () => {
    it('ExecutionStarted debe inicializarse y serializarse correctamente', () => {
        const event = new ExecutionStarted('exec-1', 'proc-1');
        
        expect(event.getEventName()).toBe('execution.started');
        expect(event.eventId).toBeDefined(); // Heredado de DomainEvent
        
        const primitives = event.toPrimitives();
        expect(primitives.executionId).toBe('exec-1');
        expect(primitives.processId).toBe('proc-1');
        expect(primitives.occurredOn).toBeDefined();
    });

    it('ExecutionCompleted debe inicializarse y serializarse correctamente', () => {
        const event = new ExecutionCompleted('exec-1');
        
        expect(event.getEventName()).toBe('execution.completed');
        
        const primitives = event.toPrimitives();
        expect(primitives.executionId).toBe('exec-1');
    });

    it('ExecutionStepCompleted debe inicializarse y serializarse correctamente', () => {
        const event = new ExecutionStepCompleted('exec-1', 'step-1');
        
        expect(event.getEventName()).toBe('execution.step.completed');
        
        const primitives = event.toPrimitives();
        expect(primitives.executionId).toBe('exec-1');
        expect(primitives.stepId).toBe('step-1');
    });
});