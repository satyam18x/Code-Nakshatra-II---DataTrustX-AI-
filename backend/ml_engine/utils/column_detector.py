import re

# ==========================================
# REGEX PATTERNS
# ==========================================

EMAIL_REGEX = r'@'

PHONE_REGEX = r'^(\+?\d[\d\s-]{7,})$'

WEBSITE_REGEX = r'(http|https|www\.)'

# ==========================================
# KEYWORDS
# ==========================================

EMAIL_KEYWORDS = {
    "email",
    "mail",
    "email_address",
    "contact_email"
}

PHONE_KEYWORDS = {
    "phone",
    "mobile",
    "mobile_number",
    "contact_number",
    "phone_number",
    "telephone",
    "tel"
}

WEBSITE_KEYWORDS = {
    "website",
    "url",
    "web",
    "company_url",
    "site",
    "homepage"
}

COUNTRY_KEYWORDS = {
    "country",
    "nation",
    "location"
}

AGE_KEYWORDS = {
    "age",
    "years"
}

SALARY_KEYWORDS = {
    "salary",
    "income",
    "pay",
    "wage",
    "annual_income"
}

ID_KEYWORDS = {
    "id",
    "user_id",
    "unique_id",
    "employee_id",
    "customer_id"
}

# ==========================================
# COLUMN DETECTOR
# ==========================================

def detect_columns(df):

    detected = {}

    for column in df.columns:

        col_lower = column.lower()

        sample_values = (
            df[column]
            .dropna()
            .astype(str)
            .head(20)
        )

        # ======================================
        # EMAIL DETECTION
        # ======================================

        if (
            col_lower in EMAIL_KEYWORDS
            or any(
                keyword in col_lower
                for keyword in EMAIL_KEYWORDS
            )
            or sample_values.str.contains(
                EMAIL_REGEX,
                regex=True
            ).mean() > 0.6
        ):

            detected["email"] = column

        # ======================================
        # PHONE DETECTION
        # ======================================

        elif (
            col_lower in PHONE_KEYWORDS
            or any(
                keyword in col_lower
                for keyword in PHONE_KEYWORDS
            )
            or sample_values.str.match(
                PHONE_REGEX
            ).mean() > 0.6
        ):

            detected["phone"] = column

        # ======================================
        # WEBSITE DETECTION
        # ======================================

        elif (
            col_lower in WEBSITE_KEYWORDS
            or any(
                keyword in col_lower
                for keyword in WEBSITE_KEYWORDS
            )
            or sample_values.str.contains(
                WEBSITE_REGEX,
                regex=True
            ).mean() > 0.6
        ):

            detected["website"] = column

        # ======================================
        # COUNTRY DETECTION
        # ======================================

        elif (
            col_lower in COUNTRY_KEYWORDS
            or any(
                keyword in col_lower
                for keyword in COUNTRY_KEYWORDS
            )
        ):

            detected["country"] = column

        # ======================================
        # AGE DETECTION
        # ======================================

        elif (
            col_lower in AGE_KEYWORDS
            or any(
                keyword in col_lower
                for keyword in AGE_KEYWORDS
            )
        ):

            detected["age"] = column

        # ======================================
        # SALARY DETECTION
        # ======================================

        elif (
            col_lower in SALARY_KEYWORDS
            or any(
                keyword in col_lower
                for keyword in SALARY_KEYWORDS
            )
        ):

            detected["salary"] = column

        # ======================================
        # ID DETECTION
        # ======================================

        elif (
            col_lower in ID_KEYWORDS
            or any(
                keyword in col_lower
                for keyword in ID_KEYWORDS
            )
        ):

            detected["id"] = column

    return detected