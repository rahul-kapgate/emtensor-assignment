from fastapi import APIRouter

from app.api.routes import (
    anomalies,
    budget,
    dependencies,
    departments,
    health,
    overview,
    people,
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

api_router.include_router(
    departments.router,
    tags=["Departments"],
)

api_router.include_router(
    people.router,
    tags=["People"],
)