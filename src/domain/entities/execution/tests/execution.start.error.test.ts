import { Execution } from "../Execution";
import { Process } from "../../process/Process";

describe("Execution.start errors", () => {
    it("throws if process is not active", () => {
        const process = Process.create("p-1", "Process");

        expect(() => {
            Execution.start("e-1", process);
        }).toThrow();
    });
});
