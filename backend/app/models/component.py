from typing import Literal

from pydantic import BaseModel


ComponentType = Literal[
    "system",
    "subsystem",
    "assembly",
    "rack",
    "node",
    "part",
]

ComponentStatus = Literal[
    "planned",
    "ordered",
    "delivered",
    "in_progress",
    "installed",
    "tested",
]

DependencyType = Literal[
    "cooling",
    "network",
    "physical_space",
    "power",
    "software",
]


class Component(BaseModel):
    component_id: str
    parent_component_id: str | None = None
    component_name: str
    component_type: ComponentType
    owner_dept_id: str
    quantity: int
    unit_cost_inr: int
    governing_task_id: str | None = None
    status: ComponentStatus


class ComponentDependency(BaseModel):
    component_id: str
    depends_on_component_id: str
    dependency_type: DependencyType