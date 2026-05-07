def check_age_range(
    df,
    detected_columns
):

    age_column = detected_columns.get(
        "age"
    )

    if not age_column:

        return {
            "status": "SKIPPED"
        }

    invalid_ages = []

    total_rows = len(df)

    for idx, age in enumerate(
        df[age_column]
    ):

        try:

            age = int(age)

            if (
                age < 0
                or age > 120
            ):

                invalid_ages.append(idx)

        except:

            invalid_ages.append(idx)

    invalid_count = len(
        invalid_ages
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
        "invalid_age_rows": (
            invalid_ages
        )
    }