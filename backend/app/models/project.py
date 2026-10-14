from datetime import date
from typing import Literal

from pydantic import BaseModel, field_validator


ResearcherStatus = Literal[
    "active",
    "on_leave",
    "exited",
]

TaskStatus = Literal[
    "not_started",
    "in_progress",
    "completed",
]


class Department(BaseModel):
    dept_id: str
    dept_name: str
    scope: str
    total_budget_inr: int
    head_researcher_id: str


class Researcher(BaseModel):
    researcher_id: str
    full_name: str
    dept_id: str
    role: str
    email: str
    project_allocation_pct: float
    monthly_cost_inr: int
    joined_on: date
    left_on: date | None = None
    status: ResearcherStatus


class WorkPackage(BaseModel):
    task_id: str
    parent_task_id: str | None = None
    dept_id: str
    task_name: str
    component_id: str | None = None
    owner_researcher_id: str

    planned_start: date | None = None
    planned_end: date | None = None
    actual_start: date | None = None
    actual_end: date | None = None

    status: TaskStatus | None = None

    @field_validator("status", mode="before")
    @classmethod
    def normalize_status(cls, value):
        if value is None or value == "":
            return None

        normalized = str(value).strip().lower().replace(" ", "_")

        return normalized


class TaskDependency(BaseModel):
    predecessor_task_id: str
    successor_task_id: str
    dependency_type: Literal["finish_to_start"]
    lag_days: int


class ProgressUpdate(BaseModel):
    update_id: str
    task_id: str
    report_date: date
    percent_complete: float
    reported_by: str
    blocker: str | None = None
    note: str | None = None


class Milestone(BaseModel):
    milestone_id: str
    milestone_name: str
    due_date: date
    linked_task_ids: str
    releases_tranche_id: str | None = None
    reported_status: str

    @property
    def task_ids(self) -> list[str]:
        return [
            task_id.strip()
            for task_id in self.linked_task_ids.split(";")
            if task_id.strip()
        ]