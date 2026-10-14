from typing import Literal

from pydantic import BaseModel


Severity = Literal["critical", "warning", "info"]

Category = Literal[
    "finance",
    "people",
    "task",
    "component",
    "timesheet",
    "milestone",
]


class Anomaly(BaseModel):
    id: str
    rule: str
    severity: Severity
    category: Category

    record_id: str | None = None
    related_record_id: str | None = None

    title: str
    message: str
    recommendation: str | None = None