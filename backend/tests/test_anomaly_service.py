from app.services.anomaly_service import AnomalyService


def test_anomaly_detection_runs(repo):
    service = AnomalyService(repo)

    anomalies = service.detect_all()

    assert isinstance(anomalies, list)


def test_anomaly_ids_are_unique(repo):
    service = AnomalyService(repo)

    anomalies = service.detect_all()

    ids = [
        anomaly.id
        for anomaly in anomalies
    ]

    assert len(ids) == len(set(ids))


def test_anomalies_have_plain_language_messages(repo):
    service = AnomalyService(repo)

    anomalies = service.detect_all()

    for anomaly in anomalies:
        assert anomaly.title
        assert anomaly.message
        assert len(anomaly.message.strip()) > 10


def test_anomaly_severity_is_valid(repo):
    service = AnomalyService(repo)

    anomalies = service.detect_all()

    allowed = {
        "critical",
        "warning",
        "info",
    }

    for anomaly in anomalies:
        assert anomaly.severity in allowed


def test_anomaly_categories_are_valid(repo):
    service = AnomalyService(repo)

    anomalies = service.detect_all()

    allowed = {
        "finance",
        "people",
        "task",
        "component",
        "timesheet",
        "milestone",
    }

    for anomaly in anomalies:
        assert anomaly.category in allowed