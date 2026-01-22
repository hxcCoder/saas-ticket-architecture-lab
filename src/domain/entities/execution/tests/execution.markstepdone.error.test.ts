import { Execution } from "../Execution";
import { Process } from "../../process/Process";
import { ProcessStep } from "../../process/ProcessStep";

describe("Execution.markStepDone - errors", () => {

function buildExecution(): Execution {
    const process = Process.create("process-1", "Test process");

    process.addStep(
        new ProcessStep({
        id: "step-1",
        name: "Only step",
        order: 1,
        })
    );

    process.activate();

    return Execution.start("exec-1", process);
}

it("throws error if step does not exist", () => {
    const execution = buildExecution();

    expect(() => {
        execution.markStepDone("non-existent-step");
    }).toThrow("Execution step not found");
});

});
