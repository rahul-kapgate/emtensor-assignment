def test_health(client):
    response = client.get(
        "/api/health"
    )

    assert response.status_code == 200

    assert response.json()["status"] == "healthy"


def test_data_summary(client):
    response = client.get(
        "/api/data-summary"
    )

    assert response.status_code == 200

    data = response.json()

    assert data["departments"] == 8
    assert data["researchers"] == 61
    assert data["components"] == 315


def test_overview(client):
    response = client.get(
        "/api/overview"
    )

    assert response.status_code == 200

    data = response.json()

    assert "project" in data
    assert "tasks" in data
    assert "budget" in data
    assert "milestones" in data
    assert "departments" in data
    assert "issues" in data


def test_anomalies(client):
    response = client.get(
        "/api/anomalies"
    )

    assert response.status_code == 200
    assert isinstance(
        response.json(),
        list,
    )


def test_anomaly_summary(client):
    response = client.get(
        "/api/anomalies/summary"
    )

    assert response.status_code == 200

    data = response.json()

    assert "total" in data
    assert "critical" in data
    assert "warning" in data


def test_budget_summary(client):
    response = client.get(
        "/api/budget/summary"
    )

    assert response.status_code == 200


def test_departments(client):
    response = client.get(
        "/api/departments"
    )

    assert response.status_code == 200
    assert len(response.json()) == 8


def test_department_detail(client):
    response = client.get(
        "/api/departments/CIV"
    )

    assert response.status_code == 200

    data = response.json()

    assert (
        data["department"]["dept_id"]
        == "CIV"
    )


def test_unknown_department_returns_404(client):
    response = client.get(
        "/api/departments/INVALID"
    )

    assert response.status_code == 404


def test_people(client):
    response = client.get(
        "/api/people"
    )

    assert response.status_code == 200
    assert len(response.json()) == 61


def test_dependency_impact(client):
    response = client.get(
        "/api/dependencies/tasks/CIV-04/impact"
    )

    assert response.status_code == 200

    data = response.json()

    assert (
        data["task"]["task_id"]
        == "CIV-04"
    )


def test_unknown_dependency_task_returns_404(
    client,
):
    response = client.get(
        "/api/dependencies/tasks/UNKNOWN/impact"
    )

    assert response.status_code == 404