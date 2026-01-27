import { ProcessRepository } from "../../../application/use-cases/ports/ProcessRepository";
import { Process } from "../../../domain/entities/process/Process";
import { getPrismaClient } from "./PrismaClient";

export class PrismaProcessRepository implements ProcessRepository {
    // Usamos un getter privado para mantener el código limpio y consistente
    private get db() {
        return getPrismaClient();
    }

    async save(process: Process): Promise<void> {
        await this.db.process.upsert({
            where: { id: process.getId() },
            update: {
                status: process.getStatus(),
                name: process.getName(),
            },
            create: {
                id: process.getId(),
                name: process.getName(),
                organizationId: process.getOrganizationId(),
                status: process.getStatus(),
                steps: {
                    create: process.getSteps().map(step => ({
                        id: step.getId(), 
                        name: step.getName(),
                        order: step.getOrder()
                    }))
                }
            }
        });
    }

    async findById(id: string): Promise<Process | null> {
        const data = await this.db.process.findUnique({
            where: { id },
            include: { steps: true }
        });

        if (!data) return null;

        // Rehidratación PROFESIONAL:
        // Usamos un método estático "rehydrate" para no disparar el evento "ProcessCreated"
        // cada vez que consultamos la base de datos.
        return Process.rehydrate({
            id: data.id,
            name: data.name,
            organizationId: data.organizationId,
            status: data.status as any,
            steps: data.steps.map((s: { name: string; order: number }) => ({ 
            name: s.name, 
            order: s.order 
        }))
        });
    }
}