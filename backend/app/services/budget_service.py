from collections import defaultdict

from app.services.repository import DataRepository


class BudgetService:
    def __init__(self, repo: DataRepository):
        self.repo = repo

    def get_summary(self) -> dict:
        total_grant = sum(
            tranche.amount_inr
            for tranche in self.repo.tranches
        )

        received = sum(
            tranche.amount_inr
            for tranche in self.repo.tranches
            if tranche.status == "released"
        )

        allocated = sum(
            allocation.amount_inr
            for allocation in self.repo.allocations
        )

        spent = sum(
            expense.amount_inr
            for expense in self.repo.expenditures
        )

        return {
            "total_grant_inr": total_grant,
            "received_inr": received,
            "allocated_inr": allocated,
            "spent_inr": spent,
             "grant_received_pct": (
        round(received / total_grant * 100, 2)
        if total_grant
        else 0
    ),

    "allocation_utilization_pct": (
        round(spent / allocated * 100, 2)
        if allocated
        else 0
    ),

    "received_utilization_pct": (
        round(spent / received * 100, 2)
        if received
        else 0
    ),
            "unallocated_inr": total_grant - allocated,
            "unspent_allocated_inr": allocated - spent,
            "received_remaining_inr": received - spent,
        }

    def get_department_breakdown(self) -> list[dict]:
        allocation_by_department = defaultdict(int)
        spent_by_department = defaultdict(int)

        for allocation in self.repo.allocations:
            allocation_by_department[
                allocation.dept_id
            ] += allocation.amount_inr

        for expense in self.repo.expenditures:
            spent_by_department[
                expense.dept_id
            ] += expense.amount_inr

        result = []

        for department in self.repo.departments:
            allocated = allocation_by_department[
                department.dept_id
            ]

            spent = spent_by_department[
                department.dept_id
            ]

            result.append(
                {
                    "dept_id": department.dept_id,
                    "dept_name": department.dept_name,
                    "budget_inr": department.total_budget_inr,
                    "allocated_inr": allocated,
                    "spent_inr": spent,
                    "remaining_inr": allocated - spent,
                    "utilization_pct": (
                        round(
                            spent / allocated * 100,
                            2,
                        )
                        if allocated
                        else 0
                    ),
                }
            )

        return result

    def get_tranche_breakdown(self) -> list[dict]:
        allocation_by_tranche = defaultdict(int)
        spent_by_tranche = defaultdict(int)

        for allocation in self.repo.allocations:
            allocation_by_tranche[
                allocation.tranche_id
            ] += allocation.amount_inr

        for expense in self.repo.expenditures:
            allocation = self.repo.allocation_by_id.get(
                expense.allocation_id
            )

            if not allocation:
                continue

            spent_by_tranche[
                allocation.tranche_id
            ] += expense.amount_inr

        result = []

        for tranche in self.repo.tranches:
            allocated = allocation_by_tranche[
                tranche.tranche_id
            ]

            spent = spent_by_tranche[
                tranche.tranche_id
            ]

            result.append(
                {
                    "tranche_id": tranche.tranche_id,
                    "status": tranche.status,
                    "amount_inr": tranche.amount_inr,
                    "allocated_inr": allocated,
                    "spent_inr": spent,
                    "remaining_inr": (
                        tranche.amount_inr - spent
                    ),
                    "expected_release": (
                        tranche.expected_release
                    ),
                    "actual_release": (
                        tranche.actual_release
                    ),
                    "condition_milestone_id": (
                        tranche.condition_milestone_id
                    ),
                }
            )

        return result

    def get_category_breakdown(self) -> list[dict]:
        allocated_by_category = defaultdict(int)
        spent_by_category = defaultdict(int)

        for allocation in self.repo.allocations:
            allocated_by_category[
                allocation.category
            ] += allocation.amount_inr

        for expense in self.repo.expenditures:
            spent_by_category[
                expense.category
            ] += expense.amount_inr

        categories = (
            set(allocated_by_category)
            | set(spent_by_category)
        )

        return [
            {
                "category": category,
                "allocated_inr": (
                    allocated_by_category[category]
                ),
                "spent_inr": (
                    spent_by_category[category]
                ),
                "remaining_inr": (
                    allocated_by_category[category]
                    - spent_by_category[category]
                ),
            }
            for category in sorted(categories)
        ]