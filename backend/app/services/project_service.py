from collections import Counter

from app.services.anomaly_service import AnomalyService
from app.services.budget_service import BudgetService
from app.services.repository import DataRepository


class ProjectService:
    def __init__(self, repo: DataRepository):
        self.repo = repo

    def get_task_summary(self) -> dict:
        tasks = [
            task
            for task in self.repo.tasks
            if not task.task_id.startswith("WP-")
        ]

        status_counts = Counter(
            task.status or "unknown"
            for task in tasks
        )

        total = len(tasks)

        completed = status_counts.get(
            "completed",
            0,
        )

        progress_pct = (
            round(completed / total * 100, 2)
            if total
            else 0
        )

        return {
            "total": total,
            "completed": completed,
            "in_progress": status_counts.get(
                "in_progress",
                0,
            ),
            "not_started": status_counts.get(
                "not_started",
                0,
            ),
            "unknown": status_counts.get(
                "unknown",
                0,
            ),
            "completion_pct": progress_pct,
        }

    def get_milestones(self) -> list[dict]:
        result = []

        for milestone in self.repo.milestones:
            linked_tasks = []

            completed_count = 0

            for task_id in milestone.task_ids:
                task = self.repo.task_by_id.get(
                    task_id
                )

                if not task:
                    continue

                if task.status == "completed":
                    completed_count += 1

                linked_tasks.append(
                    {
                        "task_id": task.task_id,
                        "task_name": task.task_name,
                        "status": task.status,
                        "dept_id": task.dept_id,
                    }
                )

            total_tasks = len(linked_tasks)

            actual_completion_pct = (
                round(
                    completed_count
                    / total_tasks
                    * 100,
                    2,
                )
                if total_tasks
                else 0
            )

            result.append(
                {
                    "milestone_id": (
                        milestone.milestone_id
                    ),
                    "milestone_name": (
                        milestone.milestone_name
                    ),
                    "due_date": milestone.due_date,
                    "reported_status": (
                        milestone.reported_status
                    ),
                    "releases_tranche_id": (
                        milestone.releases_tranche_id
                    ),
                    "linked_task_count": (
                        total_tasks
                    ),
                    "completed_task_count": (
                        completed_count
                    ),
                    "actual_completion_pct": (
                        actual_completion_pct
                    ),
                    "linked_tasks": linked_tasks,
                }
            )

        return result

    def get_department_progress(self) -> list[dict]:
        result = []

        for department in self.repo.departments:
            tasks = [
                task
                for task in self.repo.tasks
                if (
                    task.dept_id
                    == department.dept_id
                    and not task.task_id.startswith(
                        "WP-"
                    )
                )
            ]

            total = len(tasks)

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

            completion_pct = (
                round(
                    completed / total * 100,
                    2,
                )
                if total
                else 0
            )

            result.append(
                {
                    "dept_id": department.dept_id,
                    "dept_name": department.dept_name,
                    "total_tasks": total,
                    "completed": completed,
                    "in_progress": in_progress,
                    "not_started": not_started,
                    "completion_pct": (
                        completion_pct
                    ),
                }
            )

        return result

    def get_overview(self) -> dict:
        budget_service = BudgetService(
            self.repo
        )

        anomaly_service = AnomalyService(
            self.repo
        )

        anomalies = anomaly_service.detect_all()

        critical_count = sum(
            1
            for item in anomalies
            if item.severity == "critical"
        )

        warning_count = sum(
            1
            for item in anomalies
            if item.severity == "warning"
        )

        top_issues = sorted(
            anomalies,
            key=lambda item: (
                0
                if item.severity == "critical"
                else 1
            ),
        )[:5]

        return {
            "project": {
                "name": (
                    "SHAKTI-1 "
                    "Supercomputer Programme"
                ),
                "as_of_date": "2026-09-15",
            },

            "tasks": self.get_task_summary(),

            "budget": (
                budget_service.get_summary()
            ),

            "milestones": self.get_milestones(),

            "departments": (
                self.get_department_progress()
            ),

            "issues": {
                "total": len(anomalies),
                "critical": critical_count,
                "warning": warning_count,
                "top": [
                    {
                        "id": item.id,
                        "severity": (
                            item.severity
                        ),
                        "category": (
                            item.category
                        ),
                        "title": item.title,
                        "message": item.message,
                    }
                    for item in top_issues
                ],
            },
        }