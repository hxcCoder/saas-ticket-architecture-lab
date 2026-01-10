export namespace ExecutionErrors {
    export class ProcessNotActive extends Error {
    constructor() {
        super("Cannot start execution from inactive process");
    }
}

export class ExecutionNotRunning extends Error {
    constructor() {
        super("Execution is not running");
    }
}

export class ExecutionAlreadyCompleted extends Error {
    constructor() {
        super("Execution already completed");
    }
}
}
