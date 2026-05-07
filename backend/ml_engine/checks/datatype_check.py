import pandas as pd


def check_datatypes(df):

    invalid_count = 0

    total_columns = len(df.columns)

    datatype_report = {}

    for column in df.columns:

        try:

            pd.to_numeric(
                df[column]
            )

            detected_type = (
                "numeric"
            )

        except:

            detected_type = (
                "string"
            )

        datatype_report[column] = (
            detected_type
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
        "datatype_report": (
            datatype_report
        )
    }