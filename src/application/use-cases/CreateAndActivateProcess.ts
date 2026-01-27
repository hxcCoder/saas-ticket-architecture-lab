import { Process } from "../../domain/entities/process/Process";
import { ProcessStep } from "../../domain/entities/process/ProcessStep";
import { ProcessRepository } from "./ports/ProcessRepository";
import { SubscriptionService } from "./ports/SubscriptionService";
import { UnitOfWork } from "./ports/UnitOfWork";

// Definimos el contrato de entrada con IDs para los pasos
export interface CreateProcessInput {
    id: string;
    organizationId: string;
    name: string;
    steps: { 
        id: string;     // <-- El ID viene desde afuera (UUID recomendado)
        name: string; 
        order: number 
    }[];
}

export class CreateAndActivateProcess {
    constructor(
        private readonly processRepo: ProcessRepository,
        private readonly subscriptionService: SubscriptionService,
        private readonly unitOfWork: UnitOfWork
    ) {}

    async execute(input: CreateProcessInput): Promise<void> {
        // 1. Regla de Negocio: Validar límites de la organización
        const canCreate = await this.subscriptionService.canCreateProcess(input.organizationId);
        if (!canCreate) {
            throw new Error("Organization cannot create more processes: Plan limit reached");
        }

        // 2. Crear el Aggregate Root (Process)
        const process = Process.create(input.id, input.name, input.organizationId);

        // 3. Añadir los pasos usando el constructor de objeto que definimos
        input.steps.forEach(s => {
            process.addStep(new ProcessStep({
                id: s.id,
                name: s.name,
                order: s.order
            }));
        });

        // 4. Cambiar estado (Dispara validaciones de dominio como 'mínimo 1 paso')
        process.activate();

        // 5. Persistencia Atómica
        // Usamos el Unit of Work para asegurar que si algo falla al guardar, no quede nada a medias
        await this.unitOfWork.run(async (tx) => {
        await this.processRepo.save(process, tx);
});

    }
}