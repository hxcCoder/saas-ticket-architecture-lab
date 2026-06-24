import { UnitOfWork } from "../../UnitOfWork.js";

export class InMemoryUnitOfWork implements UnitOfWork {
    async run<T>(work: () => Promise<T>): Promise<T> {
    return work();
}
}