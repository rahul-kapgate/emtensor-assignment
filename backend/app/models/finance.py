from datetime import date
from typing import Literal

from pydantic import BaseModel


ExpenseCategory = Literal[
    "equipment",
    "civil_works",
    "consumables",
    "manpower",
    "travel",
    "software_licences",
    "contingency",
]


class FundingTranche(BaseModel):
    tranche_id: str
    pct_of_grant: float
    amount_inr: int
    condition_milestone_id: str
    expected_release: date
    actual_release: date | None = None
    status: Literal["released", "pending"]


class BudgetAllocation(BaseModel):
    allocation_id: str
    dept_id: str
    category: ExpenseCategory
    tranche_id: str
    amount_inr: int


class PurchaseOrder(BaseModel):
    po_id: str
    dept_id: str
    vendor: str
    component_id: str
    category: ExpenseCategory
    po_amount_inr: int
    order_date: date
    expected_delivery: date
    actual_delivery: date | None = None
    po_status: Literal["open", "closed"]


class Expenditure(BaseModel):
    expense_id: str
    dept_id: str
    allocation_id: str
    category: ExpenseCategory
    po_id: str | None = None
    vendor: str | None = None
    amount_inr: int
    expense_date: date
    description: str
    invoice_no: str
    requested_by: str
    approved_by: str