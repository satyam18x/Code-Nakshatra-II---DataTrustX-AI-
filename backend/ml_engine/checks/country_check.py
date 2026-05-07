from ..config.countries import (
    VALID_COUNTRIES
)


def check_countries(
    df,
    detected_columns
):

    country_column = detected_columns.get(
        "country"
    )

    if not country_column:

        return {
            "status": "SKIPPED"
        }

    invalid_countries = []

    total_rows = len(df)

    for idx, country in enumerate(
        df[country_column]
        .astype(str)
    ):

        cleaned_country = (
            country.strip()
        )

        if (
            cleaned_country
            not in VALID_COUNTRIES
        ):

            invalid_countries.append({
                "row": idx,
                "value": country
            })

    invalid_count = len(
        invalid_countries
    )

    valid_count = (
        total_rows - invalid_count
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
        "invalid_country_count": (
            invalid_count
        ),
        "invalid_countries": (
            invalid_countries
        )
    }