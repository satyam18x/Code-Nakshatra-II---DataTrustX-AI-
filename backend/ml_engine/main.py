import pandas as pd
import json

from utils.column_detector import detect_columns

from checks.duplicate_check import check_duplicate_ids
from checks.missing_value_check import check_missing_values
from checks.datatype_check import check_datatypes
from checks.email_check import check_emails
from checks.age_range_check import check_age_range
from checks.website_check import check_websites
from checks.salary_check import check_salary
from checks.variance_check import check_variance
from checks.country_check import check_countries
from checks.phone_check import check_phone_numbers

from score_engine import calculate_trust_score

# ==========================================
# LOAD DATASET
# ==========================================

df = pd.read_csv("dataset.csv")

# ==========================================
# DETECT COLUMNS
# ==========================================

detected_columns = detect_columns(df)

print("\n========== DETECTED COLUMNS ==========\n")

print(
    json.dumps(
        detected_columns,
        indent=4
    )
)

# ==========================================
# RUN CHECKS
# ==========================================

report = {}

report["duplicate_check"] = (
    check_duplicate_ids(
        df,
        detected_columns
    )
)

report["missing_value_check"] = (
    check_missing_values(df)
)

report["datatype_check"] = (
    check_datatypes(df)
)

report["email_check"] = (
    check_emails(
        df,
        detected_columns
    )
)

report["age_range_check"] = (
    check_age_range(
        df,
        detected_columns
    )
)

report["website_check"] = (
    check_websites(
        df,
        detected_columns
    )
)

report["salary_check"] = (
    check_salary(
        df,
        detected_columns
    )
)

report["variance_check"] = (
    check_variance(df)
)

report["country_check"] = (
    check_countries(
        df,
        detected_columns
    )
)

report["phone_check"] = (
    check_phone_numbers(
        df,
        detected_columns
    )
)

# ==========================================
# TRUST SCORE
# ==========================================

score_summary = calculate_trust_score(
    report
)

report["score_summary"] = (
    score_summary
)

# ==========================================
# FINAL REPORT
# ==========================================

print(
    "\n========== DATATRUSTX REPORT ==========\n"
)

print(
    json.dumps(
        report,
        indent=4
    )
)

print(
    "\n=======================================\n"
)