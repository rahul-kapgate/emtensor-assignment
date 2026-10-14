from datetime import date

from pydantic import BaseModel, model_validator


class TimesheetEntry(BaseModel):
    researcher_id: str
    week_start: date
    task_id: str | None = None
    activity: str | None = None
    hours: float

    @model_validator(mode="after")
    def validate_task_or_activity(self):
        if not self.task_id and not self.activity:
            raise ValueError(
                "Either task_id or activity must be provided"
            )

        return self