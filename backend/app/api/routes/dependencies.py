from fastapi import APIRouter, Depends, HTTPException

from app.core.dependencies import get_repository
from app.services.dependency_service import (
    DependencyService,
)
from app.services.repository import DataRepository


router = APIRouter()


@router.get("/dependencies/tasks")
def get_task_dependencies(
    repo: DataRepository = Depends(get_repository),
):
    service = DependencyService(repo)

    return service.get_task_graph()


@router.get(
    "/dependencies/tasks/{task_id}/impact"
)
def get_task_impact(
    task_id: str,
    repo: DataRepository = Depends(get_repository),
):
    service = DependencyService(repo)

    result = service.get_task_impact(task_id)

    if not result:
        raise HTTPException(
            status_code=404,
            detail="Task not found",
        )

    return result


@router.get("/dependencies/components")
def get_component_dependencies(
    repo: DataRepository = Depends(get_repository),
):
    service = DependencyService(repo)

    return service.get_component_graph()


@router.get(
    "/dependencies/components/{component_id}/impact"
)
def get_component_impact(
    component_id: str,
    repo: DataRepository = Depends(get_repository),
):
    service = DependencyService(repo)

    result = service.get_component_impact(
        component_id
    )

    if not result:
        raise HTTPException(
            status_code=404,
            detail="Component not found",
        )

    return result