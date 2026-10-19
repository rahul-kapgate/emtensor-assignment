# SHAKTI-1 Project Intelligence Dashboard

A full-stack project intelligence dashboard built for the **SHAKTI-1 Supercomputer Programme** at VIT.

The application transforms the supplied project datasets into a clear operational view of:

- project progress
- milestones
- funding and expenditure
- department performance
- people allocation
- task dependencies
- component dependencies
- rule violations and anomalies

The goal is to help project leadership quickly understand **what is happening, what is blocked, where money is going, and what needs attention**.

---

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- TanStack Query
- React Router
- Axios
- React Flow / `@xyflow/react`
- Lucide React

### Backend

- Python
- FastAPI
- Pydantic
- Python `csv` module
- Pytest

### Infrastructure

- Docker
- Docker Compose

---

## Project Structure

```text
emtensor-assignment/
├── data/
│   ├── departments.csv
│   ├── researchers.csv
│   ├── work_packages.csv
│   ├── task_dependencies.csv
│   ├── progress_updates.csv
│   ├── components.csv
│   ├── component_dependencies.csv
│   ├── funding_tranches.csv
│   ├── budget_allocations.csv
│   ├── purchase_orders.csv
│   ├── expenditures.csv
│   ├── timesheets.csv
│   ├── milestones.csv
│   └── component_hierarchy.json
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── main.py
│   ├── tests/
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── features/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── types/
│   │   └── lib/
│   └── package.json
│
├── docs/
│   └── wireframe.png
│
├── README.md
├── DECISIONS.md
├── AI_USAGE.md
└── docker-compose.yml
```

---

## Features

### 1. Executive Overview

The overview provides a one-screen summary of:

- total programme grant
- funds received
- total allocated
- total spent
- overall project completion
- task status
- milestone progress
- department progress
- critical issues and warnings

Reported milestone status is shown alongside actual linked-task completion so inconsistencies are visible.

---

### 2. Department Intelligence

The department section shows all participating departments and their:

- project scope
- task completion
- number of project members
- allocated budget
- spending
- remaining budget
- budget utilization

Each department has a detailed view containing:

- task summary
- financial summary
- individual tasks
- planned and actual dates
- assigned researchers

---

### 3. Budget & Funding

The budget dashboard connects:

```text
Funding Tranches
      ↓
Budget Allocations
      ↓
Expenditures
```

It provides:

- grant received
- grant allocated
- total expenditure
- unallocated funds
- remaining released funds
- department utilization
- category utilization
- tranche status
- milestone-linked tranche information

---

### 4. Issues & Anomalies

The backend evaluates the supplied data against project business rules and presents violations in plain language.

The Issues page supports:

- severity filtering
- category filtering
- text search
- rule-code visibility
- affected record IDs
- related record IDs
- recommended actions

Implemented rules include:

| Rule | Description |
|---|---|
| `FIN-001` | Spending against an unreleased funding tranche |
| `FIN-002` | Equipment/civil expense above ₹5 lakh without a PO |
| `FIN-003` | Payments against a PO exceed its value |
| `FIN-004` | Requester and approver are the same person |
| `PEO-001` | Approval performed after a researcher exited |
| `PEO-002` | Timesheet logged after a researcher exited |
| `TASK-001` | Successor task begins before predecessor completion |
| `TASK-002` | Successor finishes before predecessor completion |
| `COMP-001` | Component installed/tested before a dependency |
| `TIME-001` | Weekly hours exceed allowed project allocation |
| `MILESTONE-001` | Reported milestone completion conflicts with linked-task completion |

---

## Dependency Intelligence

The system models two different dependency networks.

### Task Dependencies

```text
Task
 ↓
Dependent Task
 ↓
Department
 ↓
Milestone
 ↓
Potential funding impact
```

Selecting a task shows:

- downstream work
- dependency depth
- impacted departments
- affected milestones

For example, the supplied dataset contains a cross-department chain beginning with `CIV-04` and propagating through electrical, electronics, computing and physics work.

### Component Dependencies

The component graph shows technical installation dependencies.

Selecting a component identifies all downstream components that may be affected if it is unavailable or delayed.

---

## People

The people section provides:

- researcher name
- department
- role
- employment status
- project allocation
- monthly cost

Individual researcher pages show:

- profile details
- assigned tasks
- allocation
- timesheet hours
- timesheet entry count

---

## Data Loading & Validation

The supplied CSV and JSON files remain unchanged and are treated as the source of truth.

Data is loaded at backend startup using Python's standard `csv` module and validated using Pydantic models.

Invalid records are not silently converted into valid records.

Instead, validation problems are retained as data-quality issues.

For example, the expenditure dataset contains malformed records such as:

- a currency-formatted numeric value
- a non-ISO date
- a missing required invoice number

These records remain unchanged in the source files and are excluded from calculations when they cannot be safely validated.

The timesheet model supports both:

```text
task-specific entry
task_id present
activity optional
```

and:

```text
general project activity
task_id absent
activity present
```

---

## Backend Architecture

The backend follows a layered structure:

```text
CSV / JSON
    ↓
Pydantic Models
    ↓
Data Loader
    ↓
DataRepository
    ↓
Domain Services
    ↓
FastAPI Routes
```

The source datasets are small enough to load into memory at application startup.

This avoids introducing a database purely for persistence when the supplied files are already the authoritative dataset.

---

## API Endpoints

### System

```text
GET /api/health
GET /api/data-summary
```

### Project

```text
GET /api/overview
GET /api/milestones
GET /api/project/task-summary
GET /api/project/department-progress
```

### Departments

```text
GET /api/departments
GET /api/departments/{dept_id}
```

### Budget

```text
GET /api/budget/summary
GET /api/budget/departments
GET /api/budget/tranches
GET /api/budget/categories
```

### Issues

```text
GET /api/anomalies
GET /api/anomalies/summary
```

### Dependencies

```text
GET /api/dependencies/tasks
GET /api/dependencies/tasks/{task_id}/impact

GET /api/dependencies/components
GET /api/dependencies/components/{component_id}/impact
```

### People

```text
GET /api/people
GET /api/people/{researcher_id}
```

Interactive FastAPI documentation is available at:

```text
http://localhost:8000/docs
```

---

## Running Locally

### Backend

```bash
cd backend

python -m venv .venv
```

Windows:

```bash
.venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run:

```bash
fastapi dev app/main.py
```

Backend:

```text
http://localhost:8000
```

---

### Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## Running Tests

From `backend/`:

```bash
pytest -v
```

The test suite covers:

- dataset loading
- repository indexes
- malformed source-data handling
- financial calculations
- anomaly generation
- anomaly structure
- dependency graphs
- dependency impact
- important API endpoints
- error responses

---

## Docker

The repository includes Docker configuration for reproducible execution.

From the repository root:

```bash
docker compose up --build
```

The data directory is mounted read-only into the backend container so the application cannot modify the source datasets.

```text
./data → /data:ro
```

Docker verification should be completed before final submission on a Docker-capable environment.

---

## Engineering Process

Development was split into focused commits covering:

- frontend initialization
- data models and loading
- project repository
- anomaly detection
- financial analysis
- dependency analysis
- project overview
- department and people APIs
- backend tests
- frontend dashboards and detail views

Feature work was developed using branches and pull requests rather than a single final commit.

---

## Design Philosophy

The project intentionally prioritizes a small number of useful screens instead of many shallow features.

The main design principles were:

1. surface important project information in under one minute
2. explain problems in plain language
3. preserve the supplied source data
4. make dependencies understandable visually
5. distinguish reported progress from derived progress
6. keep financial relationships traceable
7. make anomalies actionable rather than merely listing validation errors

---

## Additional Documentation

- [`DECISIONS.md`](./DECISIONS.md) — engineering and product decisions
- [`AI_USAGE.md`](./AI_USAGE.md) — AI-assisted development disclosure
- `docs/wireframe.png` — interface wireframe