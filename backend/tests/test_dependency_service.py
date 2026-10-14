from app.services.dependency_service import (
    DependencyService,
)


def test_task_graph(repo):
    service = DependencyService(repo)

    graph = service.get_task_graph()

    assert "nodes" in graph
    assert "edges" in graph

    assert len(graph["nodes"]) > 0
    assert len(graph["edges"]) == 69


def test_component_graph(repo):
    service = DependencyService(repo)

    graph = service.get_component_graph()

    assert "nodes" in graph
    assert "edges" in graph

    assert len(graph["edges"]) == 43


def test_civ_04_has_downstream_impact(repo):
    service = DependencyService(repo)

    impact = service.get_task_impact(
        "CIV-04"
    )

    assert impact is not None

    assert impact["task"]["task_id"] == "CIV-04"

    assert impact[
        "downstream_task_count"
    ] > 0


def test_civ_04_impacts_other_departments(repo):
    service = DependencyService(repo)

    impact = service.get_task_impact(
        "CIV-04"
    )

    assert impact is not None

    departments = set(
        impact["impacted_departments"]
    )

    assert "EEE" in departments