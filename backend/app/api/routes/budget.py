from fastapi import APIRouter, Depends

from app.core.dependencies import get_repository
from app.services.budget_service import BudgetService
from app.services.repository import DataRepository


router = APIRouter()


@router.get("/budget/summary")
def get_budget_summary(
    repo: DataRepository = Depends(get_repository),
):
    service = BudgetService(repo)

    return service.get_summary()


@router.get("/budget/departments")
def get_department_budget(
    repo: DataRepository = Depends(get_repository),
):
    service = BudgetService(repo)

    return service.get_department_breakdown()


@router.get("/budget/tranches")
def get_tranches(
    repo: DataRepository = Depends(get_repository),
):
    service = BudgetService(repo)

    return service.get_tranche_breakdown()


@router.get("/budget/categories")
def get_category_breakdown(
    repo: DataRepository = Depends(get_repository),
):
    service = BudgetService(repo)

    return service.get_category_breakdown()