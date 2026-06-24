import { Process } from "../../../../../domain/entities/process/Process.js";
import { ProcessRepository } from "../../ProcessRepository.js";

export class InMemoryProcessRepository implements ProcessRepository {
    private store = new Map<string, Process>();

async save(process: Process): Promise<void> {
    this.store.set(process.getId(), process);
}

async findById(id: string): Promise<Process | null> {
    return this.store.get(id) ?? null;
}
}