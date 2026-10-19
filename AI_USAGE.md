# AI Usage

AI tools were used during development of this assignment.

The primary AI assistant used was **ChatGPT**.

## How AI was used

AI assistance was used for:

- reviewing the assignment requirements
- planning the backend and frontend architecture
- discussing folder structure
- generating initial implementation scaffolding
- reviewing FastAPI and Pydantic model designs
- debugging validation issues in the supplied datasets
- suggesting anomaly-detection rules based on the assignment brief
- reviewing dependency-graph implementation
- generating and refining React/TypeScript UI components
- generating test cases
- debugging failing tests
- discussing Docker configuration
- drafting project documentation

## Examples

### Data validation

AI helped investigate why the number of loaded expenditure and timesheet records differed from the source row counts.

The final decisions about whether malformed rows should be rejected, normalized or represented differently were reviewed against the supplied data and implemented in the project.

### Business-rule detection

AI assisted in translating the project rules into implementation candidates such as:

- unreleased-tranche spending
- PO requirements
- requester/approver conflicts
- post-exit activity
- task dependency violations
- component installation dependency violations
- project allocation / timesheet violations
- milestone status inconsistencies

The resulting behavior was tested against the supplied project datasets.

### Frontend

AI helped scaffold and refine:

- project overview
- department views
- budget dashboard
- anomaly review
- dependency visualization
- people views

I reviewed and integrated the generated code into the project rather than treating generated output as automatically correct.

### Testing and debugging

AI was used to reason about failing Pytest results.

For example, it helped identify that many timesheet rows contained either a `task_id` or an `activity`, requiring the model to support both legitimate formats.

## Verification

AI-generated suggestions were verified through:

- source-data inspection
- FastAPI Swagger testing
- manual frontend testing
- Pytest
- TypeScript/compiler feedback
- application runtime behavior

AI output was not considered authoritative without verification.

## Responsibility

I remain responsible for:

- architecture choices
- understanding the implementation
- integrating the code
- validating the behavior
- debugging errors
- testing the final application
- explaining the solution and trade-offs

No supplied assignment dataset was replaced with AI-generated data.