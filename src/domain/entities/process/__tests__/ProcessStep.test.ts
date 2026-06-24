import { describe, it, expect } from '@jest/globals';
import { ProcessStep } from '../ProcessStep.js';

describe('ProcessStep Domain Entity', () => {
    it('debe instanciarse correctamente mapeando las propiedades', () => {
        const step = new ProcessStep({ 
            id: 'step-xyz', 
            name: 'Aprobación Legal', 
            order: 5 
        });

        // Casteamos la entidad a 'any' solo para propósitos de test.
        // Esto silencia el error 2341 y nos permite leer variables privadas.
        const anyStep = step as any;

        // Validamos buscando la propiedad privada directamente o su getter si existe
        expect(anyStep.id || anyStep.getId?.()).toBe('step-xyz');
        expect(anyStep.name || anyStep.getName?.()).toBe('Aprobación Legal');
        expect(anyStep.order || anyStep.getOrder?.()).toBe(5);
    });
});