def check_duplicate_ids(
    df,
    detected_columns
):

    id_column = detected_columns.get(
        "id"
    )

    if not id_column:

        return {
            "status": "SKIPPED"
        }

    total_rows = len(df)

    duplicate_rows = df[
        df[id_column].duplicated()
    ]

    duplicate_count = len(
        duplicate_rows
    )

    valid_count = (
        total_rows - duplicate_count
    )

    valid_percentage = round(
        (valid_count / total_rows) * 100,
        2
    )

    score = round(
        (valid_count / total_rows) * 10,
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
        "duplicate_count": (
            duplicate_count
        ),
        "duplicate_ids": (
            duplicate_rows[
                id_column
            ].tolist()
        )
    }