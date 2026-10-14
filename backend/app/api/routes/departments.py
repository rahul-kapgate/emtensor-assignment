from fastapi import APIRouter, Depends, HTTPException

from app.core.dependencies import get_repository
from app.services.department_service import (
    DepartmentService,
)
from app.services.repository import DataRepository


router = APIRouter()


@router.get("/departments")
def get_departments(
    repo: DataRepository = Depends(get_repository),
):
    service = DepartmentService(repo)

    return service.get_departments()


@router.get("/departments/{dept_id}")
def get_department(
    dept_id: str,
    repo: DataRepository = Depends(get_repository),
):
    service = DepartmentService(repo)

    result = service.get_department(dept_id)

    if not result:
        raise HTTPException(
            status_code=404,
            detail="Department not found",
        )

    return result