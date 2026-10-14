from collections import defaultdict

from app.schemas.anomaly import Anomaly
from app.services.repository import DataRepository


class AnomalyService:
    def __init__(self, repo: DataRepository):
        self.repo = repo

    def detect_all(self) -> list[Anomaly]:
        anomalies: list[Anomaly] = []

        anomalies.extend(
            self._detect_unreleased_tranche_spending()
        )
        anomalies.extend(
            self._detect_missing_purchase_orders()
        )
        anomalies.extend(
            self._detect_po_overspending()
        )
        anomalies.extend(
            self._detect_same_requester_approver()
        )
        anomalies.extend(
            self._detect_exited_approvers()
        )
        anomalies.extend(
            self._detect_exited_timesheets()
        )
        anomalies.extend(
            self._detect_task_dependency_violations()
        )
        anomalies.extend(
            self._detect_component_dependency_violations()
        )
        anomalies.extend(
            self._detect_timesheet_overallocation()
        )
        anomalies.extend(
            self._detect_milestone_conflicts()
        )

        return anomalies

    def _detect_unreleased_tranche_spending(
        self,
    ) -> list[Anomaly]:
        anomalies = []

        for expense in self.repo.expenditures:
            allocation = self.repo.allocation_by_id.get(
                expense.allocation_id
            )

            if not allocation:
                continue

            tranche = self.repo.tranche_by_id.get(
                allocation.tranche_id
            )

            if not tranche:
                continue

            if tranche.status != "released":
                anomalies.append(
                    Anomaly(
                        id=f"FIN-001-{expense.expense_id}",
                        rule="FIN-001",
                        severity="critical",
                        category="finance",
                        record_id=expense.expense_id,
                        related_record_id=tranche.tranche_id,
                        title="Spending from unreleased funding",
                        message=(
                            f"Expense {expense.expense_id} for "
                            f"₹{expense.amount_inr:,.0f} uses "
                            f"{tranche.tranche_id}, which has not "
                            "been released."
                        ),
                        recommendation=(
                            "Finance should verify the allocation "
                            "and funding source before approval."
                        ),
                    )
                )

        return anomalies

    def _detect_missing_purchase_orders(
        self,
    ) -> list[Anomaly]:
        anomalies = []

        required_categories = {
            "equipment",
            "civil_works",
        }

        for expense in self.repo.expenditures:
            if (
                expense.category in required_categories
                and expense.amount_inr > 500_000
                and not expense.po_id
            ):
                anomalies.append(
                    Anomaly(
                        id=f"FIN-002-{expense.expense_id}",
                        rule="FIN-002",
                        severity="critical",
                        category="finance",
                        record_id=expense.expense_id,
                        title="Purchase order required",
                        message=(
                            f"₹{expense.amount_inr:,.0f} "
                            f"{expense.category.replace('_', ' ')} "
                            "expense has no purchase order."
                        ),
                        recommendation=(
                            "Verify that the purchase followed "
                            "the required procurement process."
                        ),
                    )
                )

        return anomalies

    def _detect_po_overspending(
        self,
    ) -> list[Anomaly]:
        anomalies = []

        payments_by_po = defaultdict(int)

        for expense in self.repo.expenditures:
            if expense.po_id:
                payments_by_po[expense.po_id] += expense.amount_inr

        for po_id, paid in payments_by_po.items():
            po = self.repo.po_by_id.get(po_id)

            if not po:
                continue

            if paid > po.po_amount_inr:
                difference = paid - po.po_amount_inr

                anomalies.append(
                    Anomaly(
                        id=f"FIN-003-{po_id}",
                        rule="FIN-003",
                        severity="critical",
                        category="finance",
                        record_id=po_id,
                        title="Purchase order value exceeded",
                        message=(
                            f"Payments against {po_id} total "
                            f"₹{paid:,.0f}, exceeding the PO "
                            f"value of ₹{po.po_amount_inr:,.0f} "
                            f"by ₹{difference:,.0f}."
                        ),
                        recommendation=(
                            "Finance should review all payments "
                            "linked to this purchase order."
                        ),
                    )
                )

        return anomalies

    def _detect_same_requester_approver(
        self,
    ) -> list[Anomaly]:
        anomalies = []

        for expense in self.repo.expenditures:
            if expense.requested_by == expense.approved_by:
                anomalies.append(
                    Anomaly(
                        id=f"FIN-004-{expense.expense_id}",
                        rule="FIN-004",
                        severity="critical",
                        category="finance",
                        record_id=expense.expense_id,
                        title="Self-approved expense",
                        message=(
                            f"Expense {expense.expense_id} was "
                            "requested and approved by the same person."
                        ),
                        recommendation=(
                            "Assign approval to a different "
                            "authorised project member."
                        ),
                    )
                )

        return anomalies

    def _detect_exited_approvers(
        self,
    ) -> list[Anomaly]:
        anomalies = []

        for expense in self.repo.expenditures:
            researcher = self.repo.researcher_by_id.get(
                expense.approved_by
            )

            if not researcher:
                continue

            if (
                researcher.left_on
                and expense.expense_date > researcher.left_on
            ):
                anomalies.append(
                    Anomaly(
                        id=f"PEO-001-{expense.expense_id}",
                        rule="PEO-001",
                        severity="critical",
                        category="people",
                        record_id=expense.expense_id,
                        related_record_id=researcher.researcher_id,
                        title="Approval after project exit",
                        message=(
                            f"{researcher.full_name} approved "
                            f"{expense.expense_id} after leaving "
                            "the project."
                        ),
                        recommendation=(
                            "Finance should verify this approval."
                        ),
                    )
                )

        return anomalies

    def _detect_exited_timesheets(
        self,
    ) -> list[Anomaly]:
        anomalies = []

        for entry in self.repo.timesheets:
            researcher = self.repo.researcher_by_id.get(
                entry.researcher_id
            )

            if not researcher or not researcher.left_on:
                continue

            if entry.week_start > researcher.left_on:
                anomalies.append(
                    Anomaly(
                        id=(
                            f"PEO-002-"
                            f"{entry.researcher_id}-"
                            f"{entry.week_start}"
                        ),
                        rule="PEO-002",
                        severity="critical",
                        category="people",
                        record_id=entry.researcher_id,
                        title="Hours logged after project exit",
                        message=(
                            f"{researcher.full_name} logged "
                            f"{entry.hours:g} hours for the week "
                            f"starting {entry.week_start} after "
                            "leaving the project."
                        ),
                        recommendation="Review this timesheet entry.",
                    )
                )

        return anomalies

    def _detect_task_dependency_violations(
        self,
    ) -> list[Anomaly]:
        anomalies = []

        for dependency in self.repo.task_dependencies:
            predecessor = self.repo.task_by_id.get(
                dependency.predecessor_task_id
            )

            successor = self.repo.task_by_id.get(
                dependency.successor_task_id
            )

            if not predecessor or not successor:
                continue

            if (
                successor.actual_start
                and predecessor.actual_end
                and successor.actual_start < predecessor.actual_end
            ):
                anomalies.append(
                    Anomaly(
                        id=(
                            f"TASK-001-"
                            f"{predecessor.task_id}-"
                            f"{successor.task_id}"
                        ),
                        rule="TASK-001",
                        severity="warning",
                        category="task",
                        record_id=successor.task_id,
                        related_record_id=predecessor.task_id,
                        title="Task started too early",
                        message=(
                            f"{successor.task_name} started before "
                            f"{predecessor.task_name} finished."
                        ),
                        recommendation=(
                            "Review the reported task dates or "
                            "dependency definition."
                        ),
                    )
                )

            if (
                successor.actual_end
                and predecessor.actual_end
                and successor.actual_end < predecessor.actual_end
            ):
                anomalies.append(
                    Anomaly(
                        id=(
                            f"TASK-002-"
                            f"{predecessor.task_id}-"
                            f"{successor.task_id}"
                        ),
                        rule="TASK-002",
                        severity="critical",
                        category="task",
                        record_id=successor.task_id,
                        related_record_id=predecessor.task_id,
                        title="Task dependency conflict",
                        message=(
                            f"{successor.task_name} is reported "
                            f"complete before prerequisite "
                            f"{predecessor.task_name}."
                        ),
                    )
                )

        return anomalies

    def _detect_component_dependency_violations(
        self,
    ) -> list[Anomaly]:
        anomalies = []

        for dependency in self.repo.component_dependencies:
            component = self.repo.component_by_id.get(
                dependency.component_id
            )

            required = self.repo.component_by_id.get(
                dependency.depends_on_component_id
            )

            if not component or not required:
                continue

            if (
                component.status in {"installed", "tested"}
                and required.status not in {"installed", "tested"}
            ):
                anomalies.append(
                    Anomaly(
                        id=(
                            f"COMP-001-"
                            f"{component.component_id}-"
                            f"{required.component_id}"
                        ),
                        rule="COMP-001",
                        severity="critical",
                        category="component",
                        record_id=component.component_id,
                        related_record_id=required.component_id,
                        title="Component installed before dependency",
                        message=(
                            f"{component.component_name} is marked "
                            f"{component.status}, but required "
                            f"{dependency.dependency_type} component "
                            f"{required.component_name} is only "
                            f"{required.status}."
                        ),
                        recommendation=(
                            "Verify installation status and "
                            "dependency readiness."
                        ),
                    )
                )

        return anomalies

    def _detect_timesheet_overallocation(
        self,
    ) -> list[Anomaly]:
        anomalies = []

        weekly_hours = defaultdict(float)

        for entry in self.repo.timesheets:
            key = (
                entry.researcher_id,
                entry.week_start,
            )

            weekly_hours[key] += entry.hours

        for (
            researcher_id,
            week_start,
        ), hours in weekly_hours.items():
            researcher = self.repo.researcher_by_id.get(
                researcher_id
            )

            if not researcher:
                continue

            expected_hours = (
                40
                * researcher.project_allocation_pct
                / 100
            )

            if hours > expected_hours:
                anomalies.append(
                    Anomaly(
                        id=(
                            f"TIME-001-"
                            f"{researcher_id}-"
                            f"{week_start}"
                        ),
                        rule="TIME-001",
                        severity="warning",
                        category="timesheet",
                        record_id=researcher_id,
                        title="Hours exceed project allocation",
                        message=(
                            f"{researcher.full_name} logged "
                            f"{hours:g} hours for the week of "
                            f"{week_start}, while their "
                            f"{researcher.project_allocation_pct:g}% "
                            f"allocation corresponds to "
                            f"{expected_hours:g} hours."
                        ),
                        recommendation=(
                            "Review the person's weekly "
                            "project allocation and timesheets."
                        ),
                    )
                )

        return anomalies

    def _detect_milestone_conflicts(
        self,
    ) -> list[Anomaly]:
        anomalies = []

        for milestone in self.repo.milestones:
            if milestone.reported_status != "completed":
                continue

            incomplete_tasks = []

            for task_id in milestone.task_ids:
                task = self.repo.task_by_id.get(task_id)

                if task and task.status != "completed":
                    incomplete_tasks.append(task)

            if incomplete_tasks:
                task_names = ", ".join(
                    task.task_name
                    for task in incomplete_tasks
                )

                anomalies.append(
                    Anomaly(
                        id=(
                            f"MILESTONE-001-"
                            f"{milestone.milestone_id}"
                        ),
                        rule="MILESTONE-001",
                        severity="critical",
                        category="milestone",
                        record_id=milestone.milestone_id,
                        title="Milestone status may be inaccurate",
                        message=(
                            f"{milestone.milestone_name} is reported "
                            f"complete, but these linked tasks are "
                            f"not complete: {task_names}."
                        ),
                        recommendation=(
                            "The PMO should verify the milestone "
                            "before the corresponding funding "
                            "release is relied upon."
                        ),
                    )
                )

        return anomalies