import { Process } from "../../../domain/entities/process/Process.js";

export interface ProcessRepository {
    findById(id: string): Promise<Process | null>;
    save(process: Process): Promise<void>; 
}