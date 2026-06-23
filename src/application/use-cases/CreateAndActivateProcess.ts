import { injectable, inject } from 'inversify';
import { Process } from "../../domain/entities/process/Process.js";
import { ProcessStep } from "../../domain/entities/process/ProcessStep.js";
import { ProcessRepository } from "./ports/ProcessRepository.js";
import { SubscriptionService } from "./ports/SubscriptionService.js";
import { UnitOfWork } from "./ports/UnitOfWork.js";

export interface CreateProcessInput {
    id: string;
    organizationId: string;
    name: string;
    steps: { 
        id: string;     
        name: string; 
        order: number 
    }[];
}

@injectable()
export class CreateAndActivateProcess {
    constructor(
        @inject('ProcessRepository') private readonly processRepo: ProcessRepository,
        @inject('SubscriptionService') private readonly subscriptionService: SubscriptionService,
        @inject('UnitOfWork') private readonly unitOfWork: UnitOfWork
    ) {}

    async execute(input: CreateProcessInput): Promise<void> {
        const canCreate = await this.subscriptionService.canCreateProcess(input.organizationId);
        if (!canCreate) {
            throw new Error("Organization cannot create more processes: Plan limit reached");
        }

        const process = Process.create(input.id, input.name, input.organizationId);

        input.steps.forEach(s => {
            process.addStep(new ProcessStep({
                id: s.id,
                name: s.name,
                order: s.order
            }));
        });

        process.activate();

        
        await this.unitOfWork.run(async () => {
            await this.processRepo.save(process);
        });
    }
}