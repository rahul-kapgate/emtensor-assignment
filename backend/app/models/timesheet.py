from datetime import date

from pydantic import BaseModel


class TimesheetEntry(BaseModel):
    researcher_id: str
    week_start: date
    task_id: str | None = None
    activity: str
    hours: float