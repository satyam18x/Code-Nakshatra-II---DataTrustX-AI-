import pandas as pd


def check_salary(
    df,
    detected_columns
):

    salary_column = detected_columns.get(
        "salary"
    )

    if not salary_column:

        return {
            "status": "SKIPPED"
        }

    salary_numeric = pd.to_numeric(
        df[salary_column],
        errors="coerce"
    )

    invalid_rows = []

    total_rows = len(df)

    for idx, value in enumerate(
        salary_numeric
    ):

        if pd.isnull(value):

            invalid_rows.append(idx)

        elif value < 0:

            invalid_rows.append(idx)

    invalid_count = len(
        invalid_rows
    )

    valid_count = (
        total_rows - invalid_count
    )

    valid_percentage = round(
        (
            valid_count /
            total_rows
        ) * 100,
        2
    )

    score = round(
        (
            valid_count /
            total_rows
        ) * 10,
        2
    )

    status = (
        "PASSED"
        if valid_percentage >= 70
        else "FAILED"
    )

    return {
        "status": status,
        "score": score,
        "max_score": 10,
        "valid_percentage": (
            valid_percentage
        ),
        "invalid_salary_rows": (
            invalid_rows
        )
    }