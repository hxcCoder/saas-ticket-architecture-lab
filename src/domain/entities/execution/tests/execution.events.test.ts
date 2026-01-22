import { Execution } from "../Execution";
import { Process } from "../../process/Process";
import { ProcessStep } from "../../process/ProcessStep";
import { ExecutionStarted } from "../events/ExecutionStarted";
import { ExecutionStepCompleted } from "../events/ExecutionStepCompleted";
import { ExecutionCompleted } from "../events/ExecutionCompleted";

describe("Execution domain events", () => {
    it("emits correct events during lifecycle", () => {
        const process = Process.create("p-1", "Process");

        process.addStep(
            new ProcessStep({
                id: "s-1",
                name: "Step",
                order: 0,
            })
        );

        process.activate();

        const execution = Execution.start("e-1", process);

        const startEvents = execution.pullDomainEvents();
        expect(startEvents[0]).toBeInstanceOf(ExecutionStarted);

        execution.markStepDone("s-1");

        const finishEvents = execution.pullDomainEvents();
        expect(finishEvents[0]).toBeInstanceOf(ExecutionStepCompleted);
        expect(finishEvents[1]).toBeInstanceOf(ExecutionCompleted);
    });
});
