## Process & Compliance Automation SaaS

Backend system for modeling, executing and auditing business processes with strict domain rules and controlled state transitions.

The project focuses on correctness, traceability and long‑term maintainability rather than fast prototyping.

## Overview

Many organizations run critical processes that:

- depend on informal knowledge

- are executed inconsistently

- lack explicit rules

- cannot be audited reliably

This system turns those workflows into:

- structured process definitions

- rule‑driven executions

- controlled lifecycle states

- immutable audit logs

The result is operational clarity and compliance‑ready process management.

## Core Domain
Organization (Tenant)

- -Represents a company using the system. Controls operational state, users and subscription limits.

User & Role

- Users act within an organization and are restricted by explicit permissions.

Process (Aggregate Root)

- Defines a workflow composed of ordered steps. Owns lifecycle transitions and business validation.

Process Step

- Atomic unit inside a process. Exists only within its parent process.

Execution

- Concrete instance of a process run. Tracks progress, errors and completion.

Audit Log

- Immutable record of relevant system actions.

Subscription & Plan

- Enforces operational limits such as active processes and executions.

## Process Lifecycle

DRAFT → ACTIVE → PAUSED → ARCHIVED

Key domain rules:

- Only draft processes can be activated

- Active processes cannot be modified directly

- Suspended organizations cannot execute processes

- Plan limits restrict activations and executions

- Every relevant action generates an audit reco

## Example Flow: Create and Activate Process

1- Validate user permissions

2- Validate organization state

3- Create process in DRAFT

4- Validate process steps and ordering

5- Enforce subscription limits

6- Transition process to ACTIVE

7- Register audit event

All business rules are enforced in the domain layer. Controllers only orchestrate use cases.

## Architecture

- The system follows Clean Architecture with Domain‑Driven Design principles.

interfaces/ HTTP API layer
application/ Use cases and orchestration
domain/ Entities, rules, states, events
infrastructure/ Database and external services

Persistence is accessed only through interfaces (ports) defined in the application layer.

This prevents business logic from depending on frameworks or databases.

## Running Locally

### Requirements
- Node.js 18+
- PostgreSQL
- npm or yarn

### Setup

```bash
git clone <repo-url>
cd <project-folder>
npm install
```

## Environment

Create a .env file:
```bash
DATABASE_URL=postgresql://user:password@localhost:5432/process_saas
```
## Database
```bash
npx prisma migrate dev
```

## Start server
```bash
npm run dev
```
## Example API Request

Create and activate a process:

```bash 
http
POST /processes

{
  "name": "Invoice Approval",
  "steps": [
    { "name": "Submit invoice" },
    { "name": "Manager review" },
    { "name": "Finance approval" }
  ]
}
Response:

{
  "id": "process_123",
  "status": "ACTIVE"
}
```

## Testing Approach

- Domain entities tested for invariants and state transitions

- Use cases tested with in‑memory repositories

- Domain events validated

- Focus: business correctness before infrastructure behavior.

## Technology Stack

- TypeScript

- Node.js

- Prisma ORM

- Clean Architecture

- Domain‑Driven Design

- Automated unit testing

## Current Scope (MVP)

- Organization management

- Users and roles

- Process definition

- Process activation

- Execution engine

- Audit logging

- Subscription limits

## Planned Improvements

- Process designer UI

- Execution monitoring dashboard

- Advanced audit reports

- SaaS billing system

- Visual automation layer

- Cloud deployment

## Design Principles

Business rules live in the domain

State transitions are explicit

No hidden side effects

Auditability is mandatory

Infrastructure never drives domain behavior

## Technical Decisions

**Why Domain-Driven Design**  
To keep business rules explicit and protected from infrastructure concerns.

**Why Clean Architecture**  
To prevent frameworks and databases from driving core logic.

**Why PostgreSQL + Prisma**  
Reliable relational data with type-safe persistence and migrations.

**Why Domain Events**  
To ensure traceability and future integration capabilities.

## Project Structure

```text
src/
├── application/           # Use Cases and Ports (Orchestration)
│   ├── use-cases/
│   └── ports/
│
├── domain/                # Business Rules (Entities, Value Objects)
│   ├── entities/
│   │   ├── audit/
│   │   ├── execution/
│   │   ├── organization/
│   │   └── process/
│   └── shared/            # Domain Events & Errors
│
├── infrastructure/        # Frameworks & Drivers (External details)
│   ├── config/
│   └── persistence/
│       ├── prisma/        # ORM Implementation
│       └── services/
│
├── interfaces/            # Entry Points (API, Controllers)
│   └── http/
│
└── generated/             # Prisma Client 
```
## Author

Benjamin Millalonco

Backend developer focused on domain modeling, automation and scalable systems.