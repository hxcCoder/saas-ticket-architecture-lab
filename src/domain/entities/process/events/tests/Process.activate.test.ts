import { describe, it, expect } from '@jest/globals';
import { ProcessArchived } from '../ProcessArchived.js';

describe('ProcessArchived Domain Event', () => {
    it('debe serializarse correctamente', () => {
        const event = new ProcessArchived('proc-123');
        
        expect(event.getEventName()).toBe('process.archived');
        
        const primitives = event.toPrimitives();
        expect(primitives.processId).toBe('proc-123');
        expect(event.occurredOn).toBeInstanceOf(Date);
    });
});