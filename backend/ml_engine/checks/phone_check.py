import re


def check_phone_numbers(
    df,
    detected_columns
):

    phone_column = detected_columns.get(
        "phone"
    )

    if not phone_column:

        return {
            "status": "SKIPPED"
        }

    invalid_numbers = []

    total_rows = len(df)

    for idx, phone in enumerate(
        df[phone_column]
        .astype(str)
    ):

        original_phone = phone

        cleaned = (
            phone.strip()
            .replace(" ", "")
            .replace("-", "")
            .replace("(", "")
            .replace(")", "")
        )

        if cleaned.endswith(".0"):

            cleaned = cleaned[:-2]

        valid = False

        if re.fullmatch(
            r"\+91[6-9]\d{9}",
            cleaned
        ):

            valid = True

        elif re.fullmatch(
            r"91[6-9]\d{9}",
            cleaned
        ):

            valid = True

        elif re.fullmatch(
            r"[6-9]\d{9}",
            cleaned
        ):

            valid = True

        if not valid:

            invalid_numbers.append({
                "row": idx,
                "value": original_phone
            })

    invalid_count = len(
        invalid_numbers
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
        "invalid_phone_count": (
            invalid_count
        ),
        "invalid_phone_numbers": (
            invalid_numbers
        )
    }