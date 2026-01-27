[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-v18+-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9-blue)](https://www.typescriptlang.org/)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](#) 
[![Coverage Status](https://img.shields.io/badge/coverage-100%25-brightgreen)](#)

# Workflow Execution System

Backend system for modeling, executing, and auditing business processes with **strict domain rules** and **controlled state transitions**.  
Focused on **business correctness, traceability, and long-term maintainability** rather than rapid prototyping.

---

## 🚀 Overview

Many organizations struggle with operational processes that:

- depend on informal knowledge  
- are executed inconsistently  
- lack explicit rules  
- cannot be audited reliably  

This system provides:

- structured **process definitions**  
- **rule-driven executions**  
- controlled **lifecycle states**  
- immutable **audit logs**  

Resulting in operational clarity and **compliance-ready process management**.

---

## 🧩 Core Domain

### Organization
- Represents a company using the system  
- Controls operational state, users, and subscription limits

### User & Role
- Users act within an organization  
- Access restricted by explicit permissions

### Process (Aggregate Root)
- Defines a workflow composed of **ordered steps**  
- Owns lifecycle transitions and business validation

### Process Step
- Atomic unit inside a process  
- Exists only within its parent process

### Execution
- Concrete instance of a process run  
- Tracks progress, errors, and completion

### Execution Step
- Represents execution of a process step  
- Tracks status: `PENDING`, `DONE`, `FAILED`

### Audit Log
- Immutable record of relevant system actions

### Subscription & Plan
- Enforces operational limits: active processes and executions

---

## 🔄 Process Lifecycle
**Key rules:**

- Only draft processes can be activated  
- Active processes cannot be modified directly  
- Suspended organizations cannot execute processes  
- Subscription plan limits restrict activations and executions  
- All relevant actions generate an **audit event**

---

## 📈 Example Flow: Create and Activate Process

```mermaid
flowchart TD
    A[Validate User Permissions] --> B[Validate Organization State]
    B --> C[Create Process in DRAFT]
    C --> D[Validate Steps & Ordering]
    D --> E[Enforce Subscription Limits]
    E --> F[Transition Process to ACTIVE]
    F --> G[Register Audit Event]
```

All business rules are enforced in the domain layer. Controllers only orchestrate use cases.

## Architecture
Clean Architecture + Domain-Driven Design

interfaces/  → HTTP API layer
application/ → Use cases and orchestration
domain/      → Entities, rules, states, events
infrastructure/ → Database and external services

Persistence is accessed only through interfaces (ports) defined in the application layer.
This prevents business logic from depending on frameworks or databases.

## Entity & Repository Flow
flowchart TB
  Process[Process]
  ProcessStep[ProcessStep]
  Execution[Execution]
  ExecutionStep[ExecutionStep]
  DomainEvent[DomainEvent]

  PrismaProcessRepository --> Process
  PrismaExecutionRepository --> Execution
  PrismaUnitOfWork --> PrismaProcessRepository
  PrismaUnitOfWork --> PrismaExecutionRepository
  PrismaUnitOfWork --> OutboxRepository
## Technology Stack
- *TypeScript / Node.js*

- *PostgreSQL + Prisma ORM*

- *Domain-Driven Design*

- *Clean Architecture*

- *Automated unit & integration tests*

## Running Locally
Requirements
- *Node.js 18+*

- *PostgreSQL*

- *npm or yarn*

## Setup
```bash
git clone <repo-url>
cd <project-folder>
npm install
```

## Environment
Create .env file:

- DATABASE_URL=postgresql://user:password@localhost:5432/workflow_system

## Database Migration
```bash
npx prisma migrate dev
```
## Start Server
```bash
npm run dev
```
## Example API Request
Create and activate a process:

POST /processes
Content-Type: application/json
```bash
{
  "name": "Invoice Approval",
  "steps": [
    { "name": "Submit invoice" },
    { "name": "Manager review" },
    { "name": "Finance approval" }
  ]
}
```
Response:

{
  "id": "process_123",
  "status": "ACTIVE"
}
## Testing Approach
- *Domain entities tested for invariants and state transitions*

- *Use cases tested with in-memory repositories*

- *Domain events validated for traceability*

*Focus*: business correctness before infrastructure behavior

##Project Structure
```text

src/
├── application/           # Use Cases and Ports
│   ├── use-cases/
│   └── ports/
├── domain/                # Entities, Value Objects, Domain Events
│   ├── entities/
│   │   ├── audit/
│   │   ├── execution/
│   │   ├── organization/
│   │   └── process/
│   └── shared/
├── infrastructure/        # ORM, services, UnitOfWork
│   ├── config/
│   └── persistence/
│       ├── prisma/
│       └── services/
├── interfaces/            # Controllers, HTTP routes
│   └── http/
└── generated/             # Prisma Client
```
## Design Principles
- *Business rules live in the domain layer*

- *State transitions are explicit*

- *No hidden side effects*

- *Auditability is mandatory*

- *Infrastructure never drives domain behavior*

## Technical Decisions
- *Domain-Driven Design:* keeps business rules explicit
- *Clean Architecture:* prevents frameworks from dictating logic
- *Prisma + PostgreSQL:* reliable relational data, type-safe ORM
- *Domain Events:* ensure traceability and future integrations

## Current MVP Scope
*Organization management*

*Users and roles*

*Process definition & activation*

*Execution engine*

*Audit logging*

*Subscription limits*

## Planned Improvements

- Process designer UI

- Execution monitoring dashboard

- Advanced audit reports

- SaaS billing system

- Visual automation layer

- Cloud deployment

## Author
Benjamin Millalonco
Backend developer focused on domain modeling, automation, and scalable systems

## License
MIT License © 2026 Benjamin Millalonco