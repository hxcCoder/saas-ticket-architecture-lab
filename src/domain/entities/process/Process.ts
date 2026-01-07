// src/domain/entities/process/Process.ts || 1
import { ProcessStep } from "./ProcessStep";
import { DomainEvent } from "../shared/DomainEvent";
import {
    ProcessAlreadyActiveError,
    ProcessCannotBeActivatedError,
    ProcessHasNoStepsError,
} from "./ProcessErrors";

export enum ProcessStatus {
    DRAFT = "draft",
    ACTIVE = "active",
    ARCHIVED = "archived",
}

export class Process {
    private domainEvents: DomainEvent[] = [];

    private constructor(
    private readonly id: string,
    private readonly organizationId: string,
    private name: string,
    private status: ProcessStatus,
    private steps: ProcessStep[]
) {}

  // 🪨 Ritual de nacimiento
static create(id: string, organizationId: string, name: string): Process {
    return new Process(
        id,
        organizationId,
        name,
        ProcessStatus.DRAFT,
        []
    );
}

  // 📜 Definir la ley
defineSteps(steps: ProcessStep[]): void {
    if (this.status !== ProcessStatus.DRAFT) {
    throw new ProcessCannotBeActivatedError();
    }

    if (steps.length === 0) {
    throw new ProcessHasNoStepsError();
    }

    this.steps = steps;
}

  // 🔥 Consagrar la ley
activate(): void {
    if (this.status === ProcessStatus.ACTIVE) {
        throw new ProcessAlreadyActiveError();
    }

    if (this.steps.length === 0) {
        new ProcessHasNoStepsError();
    }

    this.status = ProcessStatus.ACTIVE;

    // evento se registra, no se envía
    // eso es trabajo de aplicación
}

archive(): void {
    this.status = ProcessStatus.ARCHIVED;
}

pullDomainEvents(): DomainEvent[] {
    const events = [...this.domainEvents];
    this.domainEvents = [];
    return events;
}
}
