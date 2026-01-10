import { Process } from "../process/Process";
import { ExecutionStatus } from "./ExecutionStatus";
import { ExecutionStep } from "./ExecutionStep";
import { DomainEvent } from "../audit/shared/DomainEvent";
import { ExecutionStarted } from "./events/ExecutionStarted";
import { InvalidProcessStateError } from "../process/ProcessErrors";
import { ProcessStep } from "../process/ProcessStep";
import { ExecutionStepCompleted } from "./events/ExecutionStepCompleted";
import { ExecutionCompleted } from "./events/ExecutionCompleted";

export class Execution {
    private readonly id: string;
    private readonly processId: string;
    private status: ExecutionStatus;
    private steps: ExecutionStep[];
    private domainEvents: DomainEvent[] = [];

    private constructor(id: string, process: Process) {
    if (!process.isActive()) {
        throw new InvalidProcessStateError(
        "Cannot execute an inactive process"
    );
    }

    this.id = id;
    this.processId = process.getId();
    this.status = ExecutionStatus.RUNNING;

    this.steps = process.getSteps().map(
        (step: ProcessStep) => ExecutionStep.fromProcessStep(step)
    );

    this.record(new ExecutionStarted(this.id, this.processId));
}

static start(id: string, process: Process): Execution {
    return new Execution(id, process);
}

complete(): void {
    if (this.steps.some(step => !step.isDone())) return;
    this.status = ExecutionStatus.COMPLETED;
}

pullDomainEvents(): DomainEvent[] {
    const events = [...this.domainEvents];
    this.domainEvents = [];
    return events;
}

private record(event: DomainEvent): void {
    this.domainEvents.push(event);
}
markStepDone(stepId: string): void {
    const step = this.steps.find(s => s.getStepId() === stepId);

if (!step) {
    throw new Error("Execution step not found");
}

    step.markDone();

    this.record(
    new ExecutionStepCompleted(this.id, stepId)
);

if (this.steps.every(s => s.isDone())) {
    this.status = ExecutionStatus.COMPLETED;
    this.record(new ExecutionCompleted(this.id));
}
}

}
