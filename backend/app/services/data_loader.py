import csv
from pathlib import Path
from typing import TypeVar

from pydantic import BaseModel, ValidationError


T = TypeVar("T", bound=BaseModel)


class DataValidationIssue(BaseModel):
    file: str
    row_number: int
    message: str
    raw_data: dict


def clean_row(row: dict[str, str]) -> dict:
    cleaned = {}

    for key, value in row.items():
        if isinstance(value, str):
            value = value.strip()

        cleaned[key] = None if value == "" else value

    return cleaned


def load_csv(
    path: Path,
    model: type[T],
) -> tuple[list[T], list[DataValidationIssue]]:
    records: list[T] = []
    issues: list[DataValidationIssue] = []

    with path.open(
        mode="r",
        encoding="utf-8-sig",
        newline="",
    ) as file:
        reader = csv.DictReader(file)

        for row_number, raw_row in enumerate(reader, start=2):
            cleaned_row = clean_row(raw_row)

            try:
                record = model.model_validate(cleaned_row)
                records.append(record)

            except ValidationError as exc:
                issues.append(
                    DataValidationIssue(
                        file=path.name,
                        row_number=row_number,
                        message=str(exc),
                        raw_data=raw_row,
                    )
                )

    return records, issues