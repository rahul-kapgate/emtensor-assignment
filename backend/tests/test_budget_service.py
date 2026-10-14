from app.services.budget_service import BudgetService


def test_budget_summary(repo):
    service = BudgetService(repo)

    summary = service.get_summary()

    assert summary["total_grant_inr"] > 0
    assert summary["received_inr"] >= 0
    assert summary["allocated_inr"] >= 0
    assert summary["spent_inr"] >= 0


def test_total_grant_equals_tranches(repo):
    service = BudgetService(repo)

    summary = service.get_summary()

    expected = sum(
        tranche.amount_inr
        for tranche in repo.tranches
    )

    assert summary["total_grant_inr"] == expected


def test_received_only_counts_released_tranches(repo):
    service = BudgetService(repo)

    summary = service.get_summary()

    expected = sum(
        tranche.amount_inr
        for tranche in repo.tranches
        if tranche.status == "released"
    )

    assert summary["received_inr"] == expected


def test_spent_matches_expenditures(repo):
    service = BudgetService(repo)

    summary = service.get_summary()

    expected = sum(
        expense.amount_inr
        for expense in repo.expenditures
    )

    assert summary["spent_inr"] == expected


def test_department_budget_breakdown(repo):
    service = BudgetService(repo)

    departments = service.get_department_breakdown()

    assert len(departments) == 8

    civ = next(
        item
        for item in departments
        if item["dept_id"] == "CIV"
    )

    assert civ["allocated_inr"] >= 0
    assert civ["spent_inr"] >= 0