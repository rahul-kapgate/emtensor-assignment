import os
from datetime import date
from pathlib import Path


BACKEND_DIR = Path(__file__).resolve().parents[2]
PROJECT_ROOT = BACKEND_DIR.parent

DATA_DIR = Path(
    os.getenv(
        "DATA_DIR",
        PROJECT_ROOT / "data",
    )
)

PROJECT_AS_OF_DATE = date(2026, 9, 15)