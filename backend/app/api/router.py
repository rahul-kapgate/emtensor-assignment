from fastapi import APIRouter

from app.api.routes import (
    anomalies,
    budget,
    dependencies,
    health,
    overview,
)


api_router = APIRouter(
    prefix="/api"
)

api_router.include_router(
    health.router,
    tags=["System"],
)

api_router.include_router(
    overview.router,
    tags=["Project"],
)

api_router.include_router(
    anomalies.router,
    tags=["Anomalies"],
)

api_router.include_router(
    budget.router,
    tags=["Budget"],
)

api_router.include_router(
    dependencies.router,
    tags=["Dependencies"],
)