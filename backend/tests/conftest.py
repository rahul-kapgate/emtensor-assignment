import pytest
from fastapi.testclient import TestClient

from app.core.config import DATA_DIR
from app.main import app
from app.services.repository import DataRepository


@pytest.fixture(scope="session")
def repo():
    repository = DataRepository(DATA_DIR)
    repository.load_all()

    return repository


@pytest.fixture()
def client():
    with TestClient(app) as test_client:
        yield test_client