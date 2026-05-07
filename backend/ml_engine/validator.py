import pandas as pd
import json
import os
import sys

# Internal imports
from .utils.column_detector import detect_columns
from .checks.duplicate_check import check_duplicate_ids
from .checks.missing_value_check import check_missing_values
from .checks.datatype_check import check_datatypes
from .checks.email_check import check_emails
from .checks.age_range_check import check_age_range
from .checks.website_check import check_websites
from .checks.salary_check import check_salary
from .checks.variance_check import check_variance
from .checks.country_check import check_countries
from .checks.phone_check import check_phone_numbers

from .score_engine import calculate_trust_score
from .twin.twin_validator import run_twin_validation

def run_validation_df(df: pd.DataFrame):
    """Standard quality check for a single dataset DataFrame."""
    detected_columns = detect_columns(df)

    report = {}
    report["duplicate_check"] = check_duplicate_ids(df, detected_columns)
    report["missing_value_check"] = check_missing_values(df)
    report["datatype_check"] = check_datatypes(df)
    report["email_check"] = check_emails(df, detected_columns)
    report["age_range_check"] = check_age_range(df, detected_columns)
    report["website_check"] = check_websites(df, detected_columns)
    report["salary_check"] = check_salary(df, detected_columns)
    report["variance_check"] = check_variance(df)
    report["country_check"] = check_countries(df, detected_columns)
    report["phone_check"] = check_phone_numbers(df, detected_columns)

    score_summary = calculate_trust_score(report)
    
    return {
        "status": "PASS" if score_summary["final_status"] == "PASSED" else "FAIL",
        "final_trust_score": score_summary["trust_score"],
        "reason": "Score below threshold" if score_summary["final_status"] == "FAILED" else "Success",
        "all_reports": report,
        "score_summary": score_summary
    }

def run_validation(file_path: str):
    """Standard quality check for a single dataset file."""
    df = pd.read_csv(file_path)
    return run_validation_df(df)

def run_twin_validation_wrapper(ref_path: str, cand_path: str):
    """Twin validation comparing a candidate dataset to a reference dataset."""
    ref_df = pd.read_csv(ref_path)
    cand_df = pd.read_csv(cand_path)
    
    results = run_twin_validation(ref_df, cand_df)
    
    # Map Twin Results to the expected report format
    score = results["twin_similarity_score"]
    status = "PASS" if results["behavior_match"] else "FAIL"
    
    # Inject 'score' and 'summary' into each component for frontend compatibility
    component_scores = results["component_scores"]
    for key, data in component_scores.items():
        # Map specific similarity scores to a generic 'score' key
        score_key = next((k for k in data.keys() if "similarity_score" in k), None)
        if score_key:
            data["score"] = data[score_key]
        
        # Add a summary if not present
        if "summary" not in data:
            data["summary"] = f"Similarity match in {key.replace('_', ' ')}: {data.get('score', 0)}%"

    return {
        "status": status,
        "final_trust_score": score,
        "reason": f"Similarity score: {score}% - Risk Level: {results['risk_level']}",
        "all_reports": component_scores,
        "score_summary": {
            "final_status": "PASSED" if status == "PASS" else "FAILED",
            "trust_score": score,
            "risk_level": results["risk_level"]
        }
    }
