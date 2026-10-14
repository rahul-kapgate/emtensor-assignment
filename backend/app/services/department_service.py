from collections import defaultdict

from app.services.budget_service import BudgetService
from app.services.repository import DataRepository


class DepartmentService:
    def __init__(self, repo: DataRepository):
        self.repo = repo

    def get_departments(self) -> list[dict]:
        budget_service = BudgetService(self.repo)

        budget_by_dept = {
            item["dept_id"]: item
            for item in budget_service.get_department_breakdown()
        }

        result = []

        for department in self.repo.departments:
            tasks = [
                task
                for task in self.repo.tasks
                if (
                    task.dept_id == department.dept_id
                    and not task.task_id.startswith("WP-")
                )
            ]

            researchers = [
                researcher
                for researcher in self.repo.researchers
                if researcher.dept_id == department.dept_id
            ]

            completed = sum(
                1
                for task in tasks
                if task.status == "completed"
            )

            result.append(
                {
                    "dept_id": department.dept_id,
                    "dept_name": department.dept_name,
                    "scope": department.scope,
                    "head_researcher_id": (
                        department.head_researcher_id
                    ),
                    "people_count": len(researchers),
                    "task_count": len(tasks),
                    "completed_tasks": completed,
                    "completion_pct": (
                        round(
                            completed / len(tasks) * 100,
                            2,
                        )
                        if tasks
                        else 0
                    ),
                    "budget": budget_by_dept.get(
                        department.dept_id
                    ),
                }
            )

        return result

    def get_department(
        self,
        dept_id: str,
    ) -> dict | None:
        department = self.repo.department_by_id.get(dept_id)

        if not department:
            return None

        tasks = [
            task
            for task in self.repo.tasks
            if (
                task.dept_id == dept_id
                and not task.task_id.startswith("WP-")
            )
        ]

        researchers = [
            researcher
            for researcher in self.repo.researchers
            if researcher.dept_id == dept_id
        ]

        allocations = [
            allocation
            for allocation in self.repo.allocations
            if allocation.dept_id == dept_id
        ]

        expenses = [
            expense
            for expense in self.repo.expenditures
            if expense.dept_id == dept_id
        ]

        completed = sum(
            1
            for task in tasks
            if task.status == "completed"
        )

        in_progress = sum(
            1
            for task in tasks
            if task.status == "in_progress"
        )

        not_started = sum(
            1
            for task in tasks
            if task.status == "not_started"
        )

        allocated = sum(
            item.amount_inr
            for item in allocations
        )

        spent = sum(
            item.amount_inr
            for item in expenses
        )

        return {
            "department": {
                "dept_id": department.dept_id,
                "dept_name": department.dept_name,
                "scope": department.scope,
                "total_budget_inr": (
                    department.total_budget_inr
                ),
                "head_researcher_id": (
                    department.head_researcher_id
                ),
            },
            "task_summary": {
                "total": len(tasks),
                "completed": completed,
                "in_progress": in_progress,
                "not_started": not_started,
                "completion_pct": (
                    round(
                        completed / len(tasks) * 100,
                        2,
                    )
                    if tasks
                    else 0
                ),
            },
            "budget": {
                "allocated_inr": allocated,
                "spent_inr": spent,
                "remaining_inr": allocated - spent,
            },
            "tasks": [
                {
                    "task_id": task.task_id,
                    "task_name": task.task_name,
                    "status": task.status,
                    "owner_researcher_id": (
                        task.owner_researcher_id
                    ),
                    "planned_start": task.planned_start,
                    "planned_end": task.planned_end,
                    "actual_start": task.actual_start,
                    "actual_end": task.actual_end,
                }
                for task in tasks
            ],
            "people": [
                {
                    "researcher_id": (
                        researcher.researcher_id
                    ),
                    "full_name": researcher.full_name,
                    "role": researcher.role,
                    "allocation_pct": (
                        researcher.project_allocation_pct
                    ),
                    "status": researcher.status,
                }
                for researcher in researchers
            ],
        }