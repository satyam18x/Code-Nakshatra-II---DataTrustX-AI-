from urllib.parse import urlparse
import re

VALID_TLDS = {
    ".com",
    ".org",
    ".net",
    ".ai",
    ".io",
    ".in",
    ".co",
    ".biz",
    ".info",
    ".gov",
    ".edu"
}


def check_websites(
    df,
    detected_columns
):

    website_column = detected_columns.get(
        "website"
    )

    if not website_column:

        return {
            "status": "SKIPPED"
        }

    website_issues = []

    total_rows = len(df)

    for idx, website in enumerate(
        df[website_column]
        .astype(str)
        .str.strip()
    ):

        errors = []

        try:

            parsed = urlparse(website)

        except:

            website_issues.append({
                "row": idx,
                "website": website,
                "errors": [
                    "url_parse_error"
                ]
            })

            continue

        if parsed.scheme != "https":

            errors.append("not_https")

        domain = parsed.netloc.lower()

        if (
            domain == ""
            or "." not in domain
        ):

            errors.append(
                "invalid_domain"
            )

        valid_tld = False

        try:

            domain_parts = (
                domain.split(".")
            )

            if len(domain_parts) >= 2:

                tld = (
                    "." +
                    domain_parts[-1]
                )

                if tld in VALID_TLDS:

                    valid_tld = True

        except:
            pass

        if not valid_tld:

            errors.append(
                "invalid_tld"
            )

        invalid_pattern = re.search(
            r"[<>\"'{}|\\^`]",
            website
        )

        if invalid_pattern:

            errors.append(
                "invalid_characters"
            )

        if len(errors) > 0:

            website_issues.append({
                "row": idx,
                "website": website,
                "errors": errors
            })

    invalid_count = len(
        website_issues
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
        "invalid_website_count": (
            invalid_count
        ),
        "website_issues": (
            website_issues
        )
    }