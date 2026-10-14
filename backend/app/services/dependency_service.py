from collections import defaultdict, deque

from app.services.repository import DataRepository


class DependencyService:
    def __init__(self, repo: DataRepository):
        self.repo = repo

    def get_task_graph(self) -> dict:
        nodes = []
        edges = []

        for task in self.repo.tasks:
            if task.task_id.startswith("WP-"):
                continue

            nodes.append(
                {
                    "id": task.task_id,
                    "label": task.task_name,
                    "dept_id": task.dept_id,
                    "status": task.status,
                    "planned_start": task.planned_start,
                    "planned_end": task.planned_end,
                    "actual_start": task.actual_start,
                    "actual_end": task.actual_end,
                }
            )

        for dependency in self.repo.task_dependencies:
            edges.append(
                {
                    "source": dependency.predecessor_task_id,
                    "target": dependency.successor_task_id,
                    "type": dependency.dependency_type,
                    "lag_days": dependency.lag_days,
                }
            )

        return {
            "nodes": nodes,
            "edges": edges,
        }

    def get_component_graph(self) -> dict:
        nodes = []
        edges = []

        involved_component_ids = set()

        for dependency in self.repo.component_dependencies:
            involved_component_ids.add(
                dependency.component_id
            )
            involved_component_ids.add(
                dependency.depends_on_component_id
            )

        for component_id in involved_component_ids:
            component = self.repo.component_by_id.get(
                component_id
            )

            if not component:
                continue

            nodes.append(
                {
                    "id": component.component_id,
                    "label": component.component_name,
                    "type": component.component_type,
                    "status": component.status,
                    "dept_id": component.owner_dept_id,
                }
            )

        for dependency in self.repo.component_dependencies:
            edges.append(
                {
                    "source": (
                        dependency.depends_on_component_id
                    ),
                    "target": dependency.component_id,
                    "dependency_type": (
                        dependency.dependency_type
                    ),
                }
            )

        return {
            "nodes": nodes,
            "edges": edges,
        }

    def get_task_impact(
        self,
        task_id: str,
    ) -> dict | None:
        task = self.repo.task_by_id.get(task_id)

        if not task:
            return None

        adjacency = defaultdict(list)

        for dependency in self.repo.task_dependencies:
            adjacency[
                dependency.predecessor_task_id
            ].append(
                dependency.successor_task_id
            )

        queue = deque([(task_id, 0)])
        visited = {task_id}

        downstream = []

        while queue:
            current_task_id, depth = queue.popleft()

            for successor_id in adjacency[current_task_id]:
                if successor_id in visited:
                    continue

                visited.add(successor_id)

                successor = self.repo.task_by_id.get(
                    successor_id
                )

                if successor:
                    downstream.append(
                        {
                            "task_id": successor.task_id,
                            "task_name": successor.task_name,
                            "dept_id": successor.dept_id,
                            "status": successor.status,
                            "depth": depth + 1,
                        }
                    )

                queue.append(
                    (
                        successor_id,
                        depth + 1,
                    )
                )

        impacted_departments = sorted(
            {
                item["dept_id"]
                for item in downstream
            }
        )

        impacted_task_ids = {
            item["task_id"]
            for item in downstream
        }

        impacted_milestones = []

        for milestone in self.repo.milestones:
            linked = set(milestone.task_ids)

            if linked & impacted_task_ids:
                impacted_milestones.append(
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
                    }
                )

        return {
            "task": {
                "task_id": task.task_id,
                "task_name": task.task_name,
                "dept_id": task.dept_id,
                "status": task.status,
            },
            "downstream_task_count": len(downstream),
            "impacted_departments": (
                impacted_departments
            ),
            "impacted_milestones": (
                impacted_milestones
            ),
            "downstream_tasks": downstream,
        }

    def get_component_impact(
        self,
        component_id: str,
    ) -> dict | None:
        component = self.repo.component_by_id.get(
            component_id
        )

        if not component:
            return None

        adjacency = defaultdict(list)

        # if A depends on B, then B blocks A
        for dependency in self.repo.component_dependencies:
            adjacency[
                dependency.depends_on_component_id
            ].append(
                (
                    dependency.component_id,
                    dependency.dependency_type,
                )
            )

        queue = deque([(component_id, 0)])
        visited = {component_id}

        downstream = []

        while queue:
            current_id, depth = queue.popleft()

            for dependent_id, dep_type in adjacency[
                current_id
            ]:
                if dependent_id in visited:
                    continue

                visited.add(dependent_id)

                dependent = self.repo.component_by_id.get(
                    dependent_id
                )

                if dependent:
                    downstream.append(
                        {
                            "component_id": (
                                dependent.component_id
                            ),
                            "component_name": (
                                dependent.component_name
                            ),
                            "dept_id": (
                                dependent.owner_dept_id
                            ),
                            "status": dependent.status,
                            "dependency_type": dep_type,
                            "depth": depth + 1,
                        }
                    )

                queue.append(
                    (
                        dependent_id,
                        depth + 1,
                    )
                )

        return {
            "component": {
                "component_id": component.component_id,
                "component_name": component.component_name,
                "dept_id": component.owner_dept_id,
                "status": component.status,
            },
            "downstream_component_count": len(
                downstream
            ),
            "downstream_components": downstream,
        }