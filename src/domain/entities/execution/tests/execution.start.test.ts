import { Execution } from "../Execution";
import { ExecutionStatus } from "../ExecutionStatus";
import { Process } from "../../process/Process";
import { ProcessStep } from "../../process/ProcessStep";

describe("Execution.start", () => {
  it("starts an execution for an active process", () => {
    // Arrange
    const process = Process.create("process-1", "Test process");

    process.addStep(
      new ProcessStep({
        id: "step-1",
        name: "First step",
        order: 1,
      })
    );

    process.activate();

    // Act
    const execution = Execution.start("exec-1", process);

    // Assert
    expect(execution.getStatus()).toBe(ExecutionStatus.RUNNING);
    expect(execution.getProcessId()).toBe("process-1");
    expect(execution.getSteps().length).toBe(1);
  });

  it("throws if process is not active", () => {
    const process = Process.create("process-2", "Inactive process");

    expect(() => {
      Execution.start("exec-2", process);
    }).toThrow();
  });
});
