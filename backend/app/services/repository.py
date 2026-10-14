from pathlib import Path

from app.models.component import (
    Component,
    ComponentDependency,
)
from app.models.finance import (
    BudgetAllocation,
    Expenditure,
    FundingTranche,
    PurchaseOrder,
)
from app.models.project import (
    Department,
    Milestone,
    ProgressUpdate,
    Researcher,
    TaskDependency,
    WorkPackage,
)
from app.models.timesheet import TimesheetEntry
from app.services.data_loader import (
    DataValidationIssue,
    load_csv,
)


class DataRepository:
    def __init__(self, data_dir: Path):
        self.data_dir = data_dir

        self.departments: list[Department] = []
        self.researchers: list[Researcher] = []
        self.tasks: list[WorkPackage] = []
        self.task_dependencies: list[TaskDependency] = []
        self.progress_updates: list[ProgressUpdate] = []

        self.components: list[Component] = []
        self.component_dependencies: list[ComponentDependency] = []

        self.tranches: list[FundingTranche] = []
        self.allocations: list[BudgetAllocation] = []
        self.purchase_orders: list[PurchaseOrder] = []
        self.expenditures: list[Expenditure] = []

        self.timesheets: list[TimesheetEntry] = []
        self.milestones: list[Milestone] = []

        self.validation_issues: list[DataValidationIssue] = []

    def _load(self, filename, model):
        records, issues = load_csv(
            self.data_dir / filename,
            model,
        )

        self.validation_issues.extend(issues)

        return records

    def load_all(self):
        self.validation_issues.clear()

        self.departments = self._load(
            "departments.csv",
            Department,
        )

        self.researchers = self._load(
            "researchers.csv",
            Researcher,
        )

        self.tasks = self._load(
            "work_packages.csv",
            WorkPackage,
        )

        self.task_dependencies = self._load(
            "task_dependencies.csv",
            TaskDependency,
        )

        self.progress_updates = self._load(
            "progress_updates.csv",
            ProgressUpdate,
        )

        self.components = self._load(
            "components.csv",
            Component,
        )

        self.component_dependencies = self._load(
            "component_dependencies.csv",
            ComponentDependency,
        )

        self.tranches = self._load(
            "funding_tranches.csv",
            FundingTranche,
        )

        self.allocations = self._load(
            "budget_allocations.csv",
            BudgetAllocation,
        )

        self.purchase_orders = self._load(
            "purchase_orders.csv",
            PurchaseOrder,
        )

        self.expenditures = self._load(
            "expenditures.csv",
            Expenditure,
        )

        self.timesheets = self._load(
            "timesheets.csv",
            TimesheetEntry,
        )

        self.milestones = self._load(
            "milestones.csv",
            Milestone,
        )

        self._build_indexes()

    def _build_indexes(self):
        self.department_by_id = {
            item.dept_id: item
            for item in self.departments
        }

        self.researcher_by_id = {
            item.researcher_id: item
            for item in self.researchers
        }

        self.task_by_id = {
            item.task_id: item
            for item in self.tasks
        }

        self.component_by_id = {
            item.component_id: item
            for item in self.components
        }

        self.tranche_by_id = {
            item.tranche_id: item
            for item in self.tranches
        }

        self.allocation_by_id = {
            item.allocation_id: item
            for item in self.allocations
        }

        self.po_by_id = {
            item.po_id: item
            for item in self.purchase_orders
        }