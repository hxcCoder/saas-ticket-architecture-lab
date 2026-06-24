import { Process } from "../../Process.js";
import { ProcessStep } from "../../ProcessStep.js";
import { ProcessStatus } from "../../ProcessStatus.js";

describe("Process.activate", () => {
    it("activates a process with steps", () => {
        const process = Process.create("p-1", "My process", "org-123");

        const step = new ProcessStep({
            id: "s-1",
            name: "First step",
            order: 0,
        });

        process.addStep(step);
        process.activate();

        expect(process.getStatus()).toBe(ProcessStatus.ACTIVE);
        expect(process.isActive()).toBe(true);
    });
});
