-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,
    "eventData" JSONB NOT NULL,
    "payload" JSONB NOT NULL,
    "occurredOn" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_organizationId_key" ON "Subscription"("organizationId");

-- CreateIndex
CREATE INDEX "Execution_processId_idx" ON "Execution"("processId");

-- CreateIndex
CREATE INDEX "ExecutionStep_stepId_idx" ON "ExecutionStep"("stepId");

-- CreateIndex
CREATE INDEX "Process_organizationId_idx" ON "Process"("organizationId");

-- CreateIndex
CREATE INDEX "ProcessStep_processId_idx" ON "ProcessStep"("processId");
