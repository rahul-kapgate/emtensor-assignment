# Engineering & Product Decisions

This document records the main design and implementation decisions made while building the SHAKTI-1 Project Intelligence Dashboard.

---

## 1. Keep the supplied files as the source of truth

### Decision

The original CSV and JSON files are never edited by the application.

### Why

The assignment explicitly defines the supplied files as authoritative project data.

Changing malformed rows manually would make the dashboard appear cleaner but would hide important source-data problems.

Instead:

```text
Raw source file
      ↓
Validation
      ↓
Valid records → analytics
Invalid records → validation issues
```

This makes the application's behavior auditable.

---

## 2. No database for the assignment

### Decision

The FastAPI application loads the project files into an in-memory repository at startup.

### Why

The supplied dataset is relatively small and static.

Introducing PostgreSQL or another database would add:

- migrations
- persistence configuration
- import jobs
- synchronization concerns
- additional infrastructure

without adding meaningful value for this use case.

An in-memory repository provides fast indexed access while preserving the original files as the authoritative source.

If this application became a production multi-user platform, I would introduce persistent storage and a proper ingestion pipeline.

---

## 3. Pydantic at the ingestion boundary

### Decision

Each source dataset is parsed into typed Pydantic models.

### Why

The supplied datasets contain inconsistent and malformed data.

Pydantic provides a clear boundary between:

```text
untrusted source data
        ↓
validated domain data
```

Validation problems are collected rather than crashing the entire application.

---

## 4. Do not silently repair ambiguous data

### Decision

Records that cannot be interpreted safely are surfaced as validation issues instead of being automatically modified.

### Example

A value such as:

```text
₹14,746
```

could technically be normalized into:

```text
14746
```

but silently doing so changes the supplied source representation.

For this assignment, I chose visibility over hidden correction.

A production ingestion system could support configurable normalization while retaining both the original and normalized value.

---

## 5. Allow both valid timesheet shapes

### Decision

`activity` is optional when `task_id` exists, but a timesheet row must contain at least one of them.

Valid examples:

```text
task_id = ECE-04
activity = null
```

or:

```text
task_id = null
activity = General project admin
```

### Why

The supplied data uses both formats.

Treating `activity` as universally required would incorrectly reject legitimate task-specific timesheets.

---

## 6. Separate repository, services and API routes

### Decision

Backend responsibilities are separated into:

```text
Models
  ↓
Loader
  ↓
Repository
  ↓
Services
  ↓
API routes
```

### Why

Business logic such as anomaly detection and dependency impact should not live directly inside HTTP route functions.

This structure keeps the domain logic testable and makes future changes easier.

---

## 7. Model anomalies as first-class domain objects

### Decision

Business-rule violations are represented using a consistent `Anomaly` schema.

Each anomaly includes:

- rule code
- severity
- category
- record ID
- related record ID where applicable
- title
- plain-language explanation
- recommended action

### Why

Project leadership should not need to understand database fields or raw CSV rows to understand a problem.

A useful anomaly should answer:

```text
What happened?
Why does it matter?
Which record is involved?
What should someone check next?
```

---

## 8. Derive milestone health instead of trusting only reported status

### Decision

Milestones display both:

- self-reported milestone status
- actual completion of linked tasks

### Why

The supplied milestone status is explicitly self-reported.

Showing the linked-task completion next to it makes discrepancies visible without modifying the source status.

---

## 9. Treat tasks and components as separate dependency networks

### Decision

The UI provides separate task and component dependency modes.

### Why

They represent different questions.

Task dependency:

```text
What work is blocked if this activity slips?
```

Component dependency:

```text
What technical items cannot be installed if this component is unavailable?
```

Combining both into one graph would make the visualization harder for a non-technical stakeholder to interpret.

---

## 10. Orient dependency edges from prerequisite to dependent

### Decision

Edges are represented as:

```text
prerequisite → dependent
```

### Why

This makes downstream impact analysis intuitive.

Starting from one node, the system can traverse outward to answer:

```text
If this item slips, what else is affected?
```

---

## 11. Use breadth-first traversal for impact analysis

### Decision

Downstream impact is calculated using graph traversal with dependency depth.

### Why

The dataset is small enough that an in-memory graph traversal is simple and fast.

Depth also gives the frontend useful information such as:

```text
Level 1
Level 2
Level 3
```

which helps explain how far a delay propagates.

---

## 12. Avoid a large frontend state store

### Decision

TanStack Query manages server state.

Local React state manages filters, search and selected graph nodes.

### Why

The application does not currently contain complicated shared client-side mutations.

Adding Redux or another global store would increase complexity without solving a real problem.

---

## 13. Use React Flow for dependency visualization

### Decision

`@xyflow/react` is used to visualize task and component graphs.

### Why

A table can describe dependencies but does not communicate propagation well.

The graph makes it easier to understand:

```text
CIV
 ↓
EEE
 ↓
ECE
 ↓
CSE
 ↓
PHY
```

and selecting a node provides a simpler impact summary alongside the technical graph.

---

## 14. Prioritize decision-oriented screens

### Decision

The UI focuses on six primary areas:

```text
Overview
Departments
Dependencies
Budget
People
Issues
```

### Why

The assignment values clarity and usefulness more than feature count.

Each page answers a specific stakeholder question.

| Screen | Question |
|---|---|
| Overview | Is the programme healthy? |
| Departments | Which workstream is progressing or struggling? |
| Dependencies | What will be affected if something slips? |
| Budget | Where has funding gone? |
| People | Who is working on the project? |
| Issues | What requires attention? |

---

## 15. Use summary → detail navigation

### Decision

Departments and people have dedicated detail views.

### Why

The main screens should remain easy to scan.

Detailed task, budget and timesheet information is available only when the user chooses to investigate a specific entity.

---

## 16. Format financial values for humans

### Decision

Large INR values are displayed using lakh/crore notation where appropriate.

Examples:

```text
₹531,000,000
```

becomes:

```text
₹53.1 Cr
```

### Why

This is faster for an Indian project stakeholder to interpret.

Raw numeric values remain unchanged in the backend.

---

## 17. Test business logic, not UI implementation details

### Decision

The backend tests focus on:

- source-data loading
- repository indexing
- financial calculations
- validation behavior
- anomaly detection
- dependency impact
- important API responses

### Why

These areas contain the highest correctness risk.

The objective was meaningful coverage rather than maximizing a coverage percentage.

---

## 18. Keep Docker data mounts read-only

### Decision

The `data/` directory is mounted into Docker as read-only.

```text
./data:/data:ro
```

### Why

The running application should not be capable of mutating the supplied source-of-truth datasets.

---

## 19. Current limitations

The implementation intentionally leaves several capabilities outside the current scope:

- authentication and role-based permissions
- editing source records
- persistent database storage
- automated source-file re-ingestion
- what-if project simulation
- full automatic graph layout
- export/report generation

These would be reasonable next steps for a production version but were deprioritized in favor of correctness and clarity in the core assignment.