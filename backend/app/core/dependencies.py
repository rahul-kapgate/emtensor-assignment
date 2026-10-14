from fastapi import Request

from app.services.repository import DataRepository


def get_repository(
    request: Request,
) -> DataRepository:
    return request.app.state.repository