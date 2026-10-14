from fastapi import APIRouter, Depends

from app.core.dependencies import get_repository
from app.services.repository import DataRepository


router = APIRouter()


@router.get("/health")
def health():
    return {
        "status": "healthy",
    }


@router.get("/data-summary")
def data_summary(
    repo: DataRepository = Depends(get_repository),
):
    return {
        "departments": len(repo.departments),
        "researchers": len(repo.researchers),
        "tasks": len(repo.tasks),
        "task_dependencies": len(repo.task_dependencies),
        "progress_updates": len(repo.progress_updates),
        "components": len(repo.components),
        "component_dependencies": len(
            repo.component_dependencies
        ),
        "tranches": len(repo.tranches),
        "allocations": len(repo.allocations),
        "purchase_orders": len(repo.purchase_orders),
        "expenditures": len(repo.expenditures),
        "timesheets": len(repo.timesheets),
        "milestones": len(repo.milestones),
        "validation_issues": len(
            repo.validation_issues
        ),
    }