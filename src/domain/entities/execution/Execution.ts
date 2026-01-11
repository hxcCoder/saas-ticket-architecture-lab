import { Process } from "../process/Process";
import { ExecutionStatus } from "./ExecutionStatus";
import { ExecutionStep } from "./ExecutionStep";
import { DomainEvent } from "../audit/shared/DomainEvent";
import { ExecutionStarted } from "./events/ExecutionStarted";
import { ExecutionStepCompleted } from "./events/ExecutionStepCompleted";
import { ExecutionCompleted } from "./events/ExecutionCompleted";
import { InvalidProcessStateError } from "../process/ProcessErrors";
import { ProcessStep } from "../process/ProcessStep";

export class Execution {
  private readonly id: string;
  private readonly processId: string;
  private status: ExecutionStatus;
  private steps: ExecutionStep[];
  private domainEvents: DomainEvent[] = [];

  // Constructor para crear nueva ejecución
  private constructor(
    id: string,
    processId: string,
    status: ExecutionStatus,
    steps: ExecutionStep[],
    recordEvent: boolean
  ) {
    this.id = id;
    this.processId = processId;
    this.status = status;
    this.steps = steps;

    if (recordEvent) {
      this.record(new ExecutionStarted(this.id, this.processId));
    }
  }

  // 🔹 Caso de uso: iniciar ejecución
  static start(id: string, process: Process): Execution {
    if (!process.isActive()) {
      throw new InvalidProcessStateError(
        "Cannot execute an inactive process"
      );
    }

    const steps = process.getSteps().map(
      step => ExecutionStep.fromProcessStep(step)
    );

    return new Execution(
      id,
      process.getId(),
      ExecutionStatus.RUNNING,
      steps,
      true
    );
  }

  // 🔹 Infraestructura: rehidratar desde DB
  static rehydrate(params: {
    id: string;
    processId: string;
    status: ExecutionStatus;
    steps: ExecutionStep[];
  }): Execution {
    return new Execution(
      params.id,
      params.processId,
      params.status,
      params.steps,
      false
    );
  }

  // -------------------------
  // Comportamiento de dominio
  // -------------------------

  markStepDone(stepId: string): void {
    const step = this.steps.find(s => s.getStepId() === stepId);
    if (!step) throw new Error("Execution step not found");

    step.markDone();
    this.record(new ExecutionStepCompleted(this.id, stepId));

    if (this.steps.every(s => s.isDone())) {
      this.status = ExecutionStatus.COMPLETED;
      this.record(new ExecutionCompleted(this.id));
    }
  }

  pullDomainEvents(): DomainEvent[] {
    const events = [...this.domainEvents];
    this.domainEvents = [];
    return events;
  }

  private record(event: DomainEvent): void {
    this.domainEvents.push(event);
  }

  // Getters para infraestructura
  getId(): string {
    return this.id;
  }

  getProcessId(): string {
    return this.processId;
  }

  getStatus(): ExecutionStatus {
    return this.status;
  }

  getSteps(): ExecutionStep[] {
    return [...this.steps];
  }
}
