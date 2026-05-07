import pandas as pd


def check_variance(df):

    numeric_df = df.select_dtypes(
        include=["number"]
    )

    low_variance_columns = []

    total_columns = len(
        numeric_df.columns
    )

    if total_columns == 0:

        return {
            "status": "SKIPPED"
        }

    for column in numeric_df.columns:

        variance = (
            numeric_df[column]
            .var()
        )

        if variance == 0:

            low_variance_columns.append(
                column
            )

    invalid_count = len(
        low_variance_columns
    )

    valid_columns = (
        total_columns - invalid_count
    )

    valid_percentage = round(
        (
            valid_columns /
            total_columns
        ) * 100,
        2
    )

    score = round(
        (
            valid_columns /
            total_columns
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
        "low_variance_columns": (
            low_variance_columns
        )
    }