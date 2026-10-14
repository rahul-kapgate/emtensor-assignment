from fastapi import APIRouter, Depends, HTTPException

from app.core.dependencies import get_repository
from app.services.repository import DataRepository


router = APIRouter()


@router.get("/people")
def get_people(
    repo: DataRepository = Depends(get_repository),
):
    return [
        {
            "researcher_id": item.researcher_id,
            "full_name": item.full_name,
            "dept_id": item.dept_id,
            "role": item.role,
            "email": item.email,
            "project_allocation_pct": (
                item.project_allocation_pct
            ),
            "joined_on": item.joined_on,
            "left_on": item.left_on,
            "status": item.status,
        }
        for item in repo.researchers
    ]


@router.get("/people/{researcher_id}")
def get_person(
    researcher_id: str,
    repo: DataRepository = Depends(get_repository),
):
    researcher = repo.researcher_by_id.get(
        researcher_id
    )

    if not researcher:
        raise HTTPException(
            status_code=404,
            detail="Researcher not found",
        )

    tasks = [
        task
        for task in repo.tasks
        if task.owner_researcher_id == researcher_id
    ]

    timesheets = [
        item
        for item in repo.timesheets
        if item.researcher_id == researcher_id
    ]

    total_hours = sum(
        item.hours
        for item in timesheets
    )

    return {
        "researcher": researcher,
        "tasks": tasks,
        "timesheet_summary": {
            "entry_count": len(timesheets),
            "total_hours": total_hours,
        },
    }