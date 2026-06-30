<div align="center">

# Backend Tickets

**Ticket workflow automation backend** built with Domain-Driven Design, Clean Architecture, and Event-Driven patterns.

> _Disclaimer: This project is a personal laboratory to research advanced software architecture patterns. It is over-engineered by design to serve as a learning ground for distributed systems concepts._ 

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](#license)
[![Codecov](https://codecov.io/gh/hxcCoder/saas-ticket-backend/graph/badge.svg)](https://codecov.io/gh/hxcCoder/saas-ticket-backend)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Domain Model](#domain-model)
- [Event Flow](#event-flow)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [Getting Started](#getting-started)
- [Testing](#testing)
- [Roadmap](#roadmap)
- [Learning Goals](#learning-goals)
- [License](#license)

---

## Overview

Backend Tickets is a SaaS-oriented backend that lets an organization **define, activate, run, and monitor business processes** — think invoice approvals, onboarding checklists, or any multi-step internal workflow — without sacrificing maintainability as the system grows.

Under the hood, every state change is captured as a **Domain Event** and persisted transactionally through the **Outbox Pattern**, so the core workflow engine stays fully decoupled from whatever consumes those events downstream (notifications, analytics, third-party integrations, etc.).

The codebase is intentionally built as a reference implementation of Clean Architecture + DDD in TypeScript — strict layering, explicit domain rules, and invisible transactional consistency via `AsyncLocalStorage`.

## Features

| Category | What it does |
|---|---|
| **Process Management** | Create processes, activate workflows, define ordered steps, enforce domain rules |
| **Execution Engine** | Start executions, track status, complete steps, auto-emit domain events |
| **Event-Driven Core** | Domain Events · Audit Logging · Outbox Pattern · Event Publishing Worker |
| **SaaS Capabilities** | Multi-organization support, subscription validation, active process limits (`maxActiveProcesses`) |
| **Security & Validation** | JWT auth middleware, request validation with Zod, structured domain error handling |

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime / Framework | Node.js (ESM Node16 resolution), Express, TypeScript |
| Persistence | PostgreSQL, Prisma ORM |
| Architecture | InversifyJS (DI), AsyncLocalStorage (Unit of Work), Repository Pattern |
| Validation | Zod |
| Testing | Jest (`ts-jest`) |
| Logging | Winston, Morgan |

## Architecture

This project follows a strict layered architecture inspired by Clean Architecture and DDD — dependencies always point inward, toward the domain.

```text
src
├── domain            # Entities, domain events, custom domain errors, business rules
├── application       # Use cases, DTOs, ports (interfaces)
├── infrastructure    # Prisma implementations, external services, Event Worker, DI container
└── interfaces
    └── http          # Express Controllers, routes, Zod schemas, middlewares
```

Patterns in play: Clean Architecture · Domain-Driven Design · Repository Pattern · Dependency Injection · Unit of Work (AsyncLocalStorage) · Outbox Pattern · Event-Driven Architecture

## Domain Model

```mermaid
classDiagram
    class Process {
        +ProcessStep[] steps
        +ProcessStatus status
    }
    class Execution {
        +ExecutionStep[] steps
        +ExecutionStatus status
    }
    Process "1" --> "*" ProcessStep
    Execution "1" --> "*" ExecutionStep
    Process ..> Execution : instantiates
```

| Aggregate | Emits |
|---|---|
| Process | `process.created` · `process.activated` · `process.archived` |
| Execution | `execution.started` · `execution.step.completed` · `execution.completed` |

## Event Flow

```mermaid
flowchart TD
    A[Create Process] --> B(ProcessCreated)
    B --> C(ProcessActivated)
    C --> D[Start Execution]
    D --> E(ExecutionStarted)
    E --> F[Complete Step]
    F --> G(ExecutionStepCompleted)
    G -->|All Steps Done| H(ExecutionCompleted)
    H --> I[Outbox Transaction]
    I --> J[Publisher Worker]
```

Every domain event lands in the Outbox and AuditLog within the same atomic transaction as the state change, then gets relayed by the Publisher Worker — guaranteeing at-least-once delivery without ever risking an inconsistent state.

## API Reference

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | Health check |
| POST | `/api/organizations` | Create a new organization |
| POST | `/api/processes` | Create and activate a process |
| POST | `/api/processes/start-execution` | Start a new execution of an active process |

**`GET /health`**

```json
{
  "status": "OK"
}
```

**`POST /api/organizations`**

```json
{
  "name": "My Company",
  "status": "ACTIVE",
  "plan": "PRO"
}
```

**`POST /api/processes`**

```json
{
  "organizationId": "uuid",
  "name": "Invoice Approval",
  "steps": [
    { "id": "uuid", "name": "Review", "order": 1 }
  ]
}
```

**`POST /api/processes/start-execution`**

```json
{
  "processId": "uuid",
  "executionId": "uuid"
}
```

## Database Schema

Core entities managed via Prisma ORM:

`Organization` · `Subscription` · `Plan` · `Process` · `ProcessStep` · `Execution` · `ExecutionStep` · `Outbox` · `AuditLog`

## Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/your-user/saas-ticket-backend.git
cd saas-ticket-backend

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# then set DATABASE_URL and JWT_SECRET

# 4. Run migrations
npx prisma migrate dev

# 5. Generate the Prisma client
npx prisma generate

# 6. Start the dev server
npm run dev
```

The API will be available at `http://localhost:3000` (or whichever `PORT` you configure).

## Testing

```bash
# Run isolated Domain and Use Case unit tests
npm test

# Run infrastructure and Prisma integration tests
npm run test:integration

# Check coverage
npm run test:cov
```

## Learning Goals

This project was built to practice and demonstrate:

Advanced TypeScript · Clean Architecture · Domain-Driven Design · Event-Driven Systems · Backend Design · Invisible Transaction Management (`AsyncLocalStorage`) · Repository Pattern · Dependency Injection

## License

Distributed under the MIT License.
