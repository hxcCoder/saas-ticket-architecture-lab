import { injectable } from "inversify";
import { ProcessRepository } from "../../../application/use-cases/ports/ProcessRepository.js";
import { Process } from "../../../domain/entities/process/Process.js";
import { getPrismaClient } from "./PrismaClient.js";
import { transactionStorage } from "./PrismaContext.js";

@injectable()
export class PrismaProcessRepository implements ProcessRepository {
  private readonly prisma = getPrismaClient();

  //  Interceptor de transacción silencioso
  private get db() {
    const tx = transactionStorage.getStore();
    return tx ? tx : this.prisma;
  }

  async save(process: Process): Promise<void> {
    const stepsData = process.getSteps().map(step => ({
      id: step.getId(),
      name: step.getName(),
      order: step.getOrder(),
    }));

    await this.db.process.upsert({
      where: { id: process.getId() },
      update: {
        name: process.getName(),
        status: process.getStatus(),
        steps: { deleteMany: {}, create: stepsData },
      },
      create: {
        id: process.getId(),
        name: process.getName(),
        organizationId: process.getOrganizationId(),
        status: process.getStatus(),
        steps: { create: stepsData },
      },
    });
  }

  async findById(id: string): Promise<Process | null> {
    const data = await this.db.process.findUnique({
      where: { id },
      include: { steps: true },
    });
    if (!data) return null;

    return Process.rehydrate({
      id: data.id,
      name: data.name,
      organizationId: data.organizationId,
      status: data.status as any,
      steps: data.steps.map((s: any) => ({
        id: s.id,
        name: s.name,
        order: s.order,
      })),
    });
  }
}