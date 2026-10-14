def test_k01_data_loads_successfully(repo):
    assert len(repo.departments) == 8
    assert len(repo.researchers) == 61

    assert len(repo.tasks) == 58
    assert len(repo.task_dependencies) == 69
    assert len(repo.progress_updates) == 220

    assert len(repo.components) == 315
    assert len(repo.component_dependencies) == 43

    assert len(repo.tranches) == 4
    assert len(repo.allocations) == 128
    assert len(repo.purchase_orders) == 15

    expense_issues = [
        issue
        for issue in repo.validation_issues
        if issue.file == "expenditures.csv"
    ]

    assert len(repo.expenditures) == 230
    assert len(expense_issues) == 3

    # 230 valid + 3 rejected = all 233 source rows accounted for.
    assert (
        len(repo.expenditures)
        + len(expense_issues)
        == 233
    )

    assert len(repo.timesheets) == 2797
    assert len(repo.milestones) == 6



def test_malformed_expenditures_are_reported(repo):
    expense_issues = [
        issue
        for issue in repo.validation_issues
        if issue.file == "expenditures.csv"
    ]

    assert len(expense_issues) == 3

    invalid_ids = {
        issue.raw_data.get("expense_id")
        for issue in expense_issues
    }

    assert invalid_ids == {
        "EX00180",
        "EX00055",
        "EX00232",
    }    