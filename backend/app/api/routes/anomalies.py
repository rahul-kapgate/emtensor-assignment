from fastapi import APIRouter, Depends, Query

from app.core.dependencies import get_repository
from app.schemas.anomaly import Anomaly
from app.services.anomaly_service import AnomalyService
from app.services.repository import DataRepository


router = APIRouter()


@router.get(
    "/anomalies",
    response_model=list[Anomaly],
)
def get_anomalies(
    severity: str | None = Query(default=None),
    category: str | None = Query(default=None),
    repo: DataRepository = Depends(get_repository),
):
    service = AnomalyService(repo)

    anomalies = service.detect_all()

    if severity:
        anomalies = [
            anomaly
            for anomaly in anomalies
            if anomaly.severity == severity
        ]

    if category:
        anomalies = [
            anomaly
            for anomaly in anomalies
            if anomaly.category == category
        ]

    return anomalies


@router.get("/anomalies/summary")
def anomaly_summary(
    repo: DataRepository = Depends(get_repository),
):
    service = AnomalyService(repo)

    anomalies = service.detect_all()

    return {
        "total": len(anomalies),
        "critical": sum(
            1 for item in anomalies
            if item.severity == "critical"
        ),
        "warning": sum(
            1 for item in anomalies
            if item.severity == "warning"
        ),
        "by_category": {
            category: sum(
                1 for item in anomalies
                if item.category == category
            )
            for category in {
                item.category
                for item in anomalies
            }
        },
    }
