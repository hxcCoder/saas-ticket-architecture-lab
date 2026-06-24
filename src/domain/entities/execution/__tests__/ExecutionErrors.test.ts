import { describe, it, expect } from '@jest/globals';
import { InvalidExecutionStatusError, InvalidExecutionStepError, ProcessNotActive } from '../ExecutionErrors.js';

describe('Execution Custom Errors', () => {
    it('InvalidExecutionStatusError debe formatear el mensaje con el estado provisto', () => {
        const error = new InvalidExecutionStatusError('UNKNOWN_STATUS');
        expect(error.message).toBe('Invalid execution status: UNKNOWN_STATUS');
        expect(error.name).toBe('InvalidExecutionStatusError');
    });

    it('InvalidExecutionStepError debe heredar el mensaje literal', () => {
        const error = new InvalidExecutionStepError('Step config is malformed');
        expect(error.message).toBe('Step config is malformed');
        expect(error.name).toBe('InvalidExecutionStepError');
    });

    it('ProcessNotActive debe poseer un mensaje predeterminado inmutable', () => {
        const error = new ProcessNotActive();
        expect(error.message).toBe('Cannot start execution from inactive process');
        expect(error.name).toBe('ProcessNotActive');
    });
});