import { describe, it, expect } from '@jest/globals';
import { DomainError } from '../DomainError.js';
import { DomainEvent } from '../DomainEvent.js';

// Implementaciones concretas para probar las clases abstractas
class TestError extends DomainError {
    constructor(message: string) {
        super(message);
    }
}

class TestEvent extends DomainEvent {
    getEventName(): string { return 'test.event.fired'; }
    toPrimitives(): Record<string, unknown> { return { dummy: true }; }
}

describe('Shared Domain Classes', () => {
    describe('DomainError', () => {
        it('debe inicializarse capturando correctamente el nombre de la clase y la fecha', () => {
            const error = new TestError('Mensaje de prueba');
            
            expect(error.message).toBe('Mensaje de prueba');
            expect(error.name).toBe('TestError'); // Valida el new.target.prototype
            expect(error.occurredAt).toBeInstanceOf(Date);
        });
    });

    describe('DomainEvent', () => {
        it('debe autogenerar eventId (UUID) y occurredOn si no se proveen', () => {
            const event = new TestEvent();
            
            expect(event.eventId).toBeDefined();
            expect(typeof event.eventId).toBe('string');
            expect(event.occurredOn).toBeInstanceOf(Date);
            
            // Validamos los métodos abstractos implementados
            expect(event.getEventName()).toBe('test.event.fired');
            expect(event.toPrimitives()).toEqual({ dummy: true });
        });

        it('debe respetar el eventId y occurredOn pasados explícitamente en el constructor', () => {
            const mockDate = new Date('2024-01-01T00:00:00Z');
            const event = new TestEvent('uuid-custom-123', mockDate);
            
            expect(event.eventId).toBe('uuid-custom-123');
            expect(event.occurredOn).toEqual(mockDate);
        });
    });
});