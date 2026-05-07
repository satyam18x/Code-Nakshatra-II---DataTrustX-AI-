import re

EMAIL_REGEX = (
    r'^[A-Za-z0-9._%+-]+'
    r'@[A-Za-z0-9.-]+'
    r'\.[A-Za-z]{2,}$'
)


def check_emails(
    df,
    detected_columns
):

    email_column = detected_columns.get(
        "email"
    )

    if not email_column:

        return {
            "status": "SKIPPED"
        }

    invalid_emails = []

    total_rows = len(df)

    for idx, email in enumerate(
        df[email_column].astype(str)
    ):

        if not re.match(
            EMAIL_REGEX,
            email
        ):

            invalid_emails.append({
                "row": idx,
                "value": email
            })

    invalid_count = len(
        invalid_emails
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
        "invalid_email_count": (
            invalid_count
        ),
        "invalid_emails": (
            invalid_emails
        )
    }