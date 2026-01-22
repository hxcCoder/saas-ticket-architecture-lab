import { Execution } from "../Execution";
import { ExecutionStatus } from "../ExecutionStatus";
import { Process } from "../../process/Process";
import { ProcessStep } from "../../process/ProcessStep";

describe("Execution.markStepDone", () => {
    it("completes execution when all steps are done", () => {
    const process = Process.create("process-1", "Test");

    process.addStep(
        new ProcessStep({ id: "step-1", name: "Step 1", order: 1 })
    );

    process.activate();

    const execution = Execution.start("exec-1", process);

    // Act
    execution.markStepDone("step-1");

    // Assert
    expect(execution.getStatus()).toBe(ExecutionStatus.COMPLETED);
});

it("throws if step does not exist", () => {
    const process = Process.create("process-1", "Test");

    process.addStep(
        new ProcessStep({ id: "step-1", name: "Step 1", order: 1 })
    );

    process.activate();

    const execution = Execution.start("exec-1", process);

    expect(() => {
        execution.markStepDone("invalid-step");
    }).toThrow();
});
});
