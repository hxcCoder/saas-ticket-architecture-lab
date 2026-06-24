import { describe, it, expect, beforeEach } from '@jest/globals';
import { EventPublisherWorker } from '../EventPublishWorker.js'; 
import { InMemoryOutboxRepository } from '../../../../application/use-cases/ports/test/InMemoryOutboxRepository.js';

describe('EventPublisherWorker Infrastructure Service', () => {
    let outboxRepo: InMemoryOutboxRepository;
    let worker: EventPublisherWorker;

    beforeEach(() => {
        outboxRepo = new InMemoryOutboxRepository();
        
        // CORRECCIÓN 1: TypeScript nos dice que solo recibe 1 argumento. 
        // Pasamos únicamente el repositorio.
        worker = new EventPublisherWorker(outboxRepo); 
    });

    it('debe procesar los eventos pendientes y marcarlos como publicados', async () => {
        await outboxRepo.save({
            id: 'evt-1',
            eventName: 'process.created',
            payload: { processId: 'p-1' },
            occurredOn: new Date(),
            published: false
        });

        // CORRECCIÓN 2: Reemplaza 'execute' por el nombre real de tu método.
        // Si al escribir "worker." VS Code te autocompleta con "run", "process" o "start", usa ese.
        await worker.publishPending(); 

        const pending = await outboxRepo.findPending();
        
        // Verificamos directamente que el worker hizo su trabajo mutando el estado en el repo
        expect(pending).toHaveLength(0);
    });

    it('no debe fallar si no hay eventos pendientes', async () => {
        // Al no haber eventos, el worker debe terminar su ejecución gracefully (sin arrojar errores)
        await expect(worker.publishPending()).resolves.not.toThrow();
    });
});