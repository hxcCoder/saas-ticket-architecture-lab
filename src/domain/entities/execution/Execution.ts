// src/domain/entities/execution/Execution.ts
import { Process } from "../process/Process.js";
import { ExecutionStatus } from "./ExecutionStatus.js";
import { ExecutionStep, ExecutionStepStatus } from "./ExecutionStep.js";
import { DomainEvent } from "../audit/shared/DomainEvent.js";
import { ExecutionStarted } from "./events/ExecutionStarted.js";
import { ExecutionStepCompleted } from "./events/ExecutionStepCompleted.js";
import { ExecutionCompleted } from "./events/ExecutionCompleted.js";
import { InvalidProcessStateError } from "../process/ProcessErrors.js";

export class Execution {
  private domainEvents: DomainEvent[] = [];

  private constructor(
    private readonly id: string,
    private readonly processId: string,
    private status: ExecutionStatus,
    private steps: ExecutionStep[],
    recordEvent: boolean
  ) {
    Execution.validateState(status, steps);

    if (recordEvent) {
      this.record(new ExecutionStarted(this.id, this.processId));
    }
  }

  static start(id: string, process: Process): Execution {
    if (!process.isActive()) {
      throw new InvalidProcessStateError("Cannot execute an inactive process");
    }

    const steps = process
      .getSteps()
      .map(step => ExecutionStep.fromProcessStep(step));

    if (steps.length === 0) {
      throw new Error("Execution must contain at least one step");
    }

    return new Execution(
      id,
      process.getId(),
      ExecutionStatus.RUNNING,
      steps,
      true
    );
  }

  static rehydrate(params: {
    id: string;
    processId: string;
    status: ExecutionStatus;
    steps: ExecutionStep[];
  }): Execution {
    Execution.validateState(params.status, params.steps);

    const unique = new Set(params.steps.map(s => s.getStepId()));
    if (unique.size !== params.steps.length) {
      throw new Error("Duplicate execution steps detected");
    }

    return new Execution(
      params.id,
      params.processId,
      params.status,
      params.steps,
      false
    );
  }

  markStepDone(stepId: string): void {
    if (this.status !== ExecutionStatus.RUNNING) {
      throw new Error("Cannot update steps when execution is not running");
    }

    const step = this.steps.find(s => s.getStepId() === stepId);
    if (!step) throw new Error("Execution step not found");

    if (step.isDone()) return;

    step.markDone();
    this.record(new ExecutionStepCompleted(this.id, stepId));

    if (this.steps.every(s => s.isDone())) {
      this.status = ExecutionStatus.COMPLETED;
      this.record(new ExecutionCompleted(this.id));
    }
  }

  pullDomainEvents(): DomainEvent[] {
    const events = this.domainEvents;
    this.domainEvents = [];
    return events;
  }

  private record(event: DomainEvent): void {
    this.domainEvents.push(event);
  }

  getId(): string { return this.id; }
  getProcessId(): string { return this.processId; }
  getStatus(): ExecutionStatus { return this.status; }
  getSteps(): ExecutionStep[] { return [...this.steps]; }

  isStepCompleted(stepId: string): boolean {
    const step = this.steps.find(s => s.getStepId() === stepId);
    return step?.isDone() ?? false;
  }

  private static validateState(
    status: ExecutionStatus,
    steps: ExecutionStep[]
  ): void {
    if (!Object.values(ExecutionStatus).includes(status)) {
      throw new Error("Invalid ExecutionStatus");
    }

    if (!Array.isArray(steps)) {
      throw new Error("Steps must be an array");
    }
  }

  static createForTest(
    id: string,
    processId: string,
    steps: ExecutionStep[] = []
  ): Execution {
    return new Execution(
      id,
      processId,
      ExecutionStatus.RUNNING,
      steps,
      false
    );
  }
}
