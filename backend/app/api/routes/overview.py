from fastapi import APIRouter, Depends

from app.core.dependencies import get_repository
from app.services.project_service import (
    ProjectService,
)
from app.services.repository import DataRepository


router = APIRouter()


@router.get("/overview")
def get_overview(
    repo: DataRepository = Depends(get_repository),
):
    service = ProjectService(repo)

    return service.get_overview()


@router.get("/milestones")
def get_milestones(
    repo: DataRepository = Depends(get_repository),
):
    service = ProjectService(repo)

    return service.get_milestones()


@router.get("/project/task-summary")
def get_task_summary(
    repo: DataRepository = Depends(get_repository),
):
    service = ProjectService(repo)

    return service.get_task_summary()


@router.get("/project/department-progress")
def get_department_progress(
    repo: DataRepository = Depends(get_repository),
):
    service = ProjectService(repo)

    return service.get_department_progress()