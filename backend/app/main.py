from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.core.config import DATA_DIR
from app.services.repository import DataRepository


@asynccontextmanager
async def lifespan(app: FastAPI):
    repository = DataRepository(DATA_DIR)
    repository.load_all()

    app.state.repository = repository

    yield


app = FastAPI(
    title="SHAKTI-1 Project Intelligence API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


@app.get("/")
def root():
    return {
        "name": "SHAKTI-1 Project Intelligence API",
        "status": "running",
    }