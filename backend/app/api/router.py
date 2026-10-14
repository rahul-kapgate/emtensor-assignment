from fastapi import APIRouter

from app.api.routes import anomalies, budget, health


api_router = APIRouter(prefix="/api")

api_router.include_router(
    health.router,
    tags=["System"],
)

api_router.include_router(
    anomalies.router,
    tags=["Anomalies"],
)

api_router.include_router(
    budget.router,
    tags=["Budget"],
)