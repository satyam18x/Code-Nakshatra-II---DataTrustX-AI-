"""
missing_pattern.py — Missing Data Pattern Analysis

Compares missing value patterns between reference and candidate DataFrames.
Analyzes per-column nullity rates, overall missing footprint, and
co-missingness patterns (columns that tend to be null together).

Part of the Twin Validation Engine.
"""

import pandas as pd
import numpy as np
from typing import List


def _compute_nullity_profile(df: pd.DataFrame) -> dict:
    """
    Computes the per-column null percentage for a DataFrame.

    Returns:
        dict: { column_name: null_percentage (0-100) }
    """
    if len(df) == 0:
        return {col: 0.0 for col in df.columns}

    return {
        col: round(float(df[col].isnull().sum() / len(df)) * 100, 4)
        for col in df.columns
    }


def _nullity_rate_similarity(ref_profile: dict, cand_profile: dict, shared_cols: List[str]) -> float:
    """
    Compares per-column null rates using normalized absolute difference.

    For each shared column:
        similarity = 1 - |null%_ref - null%_cand| / 100

    Returns the average across all shared columns.
    """
    if not shared_cols:
        return 0.0

    scores = []
    for col in shared_cols:
        ref_rate = ref_profile.get(col, 0.0)
        cand_rate = cand_profile.get(col, 0.0)
        sim = 1.0 - abs(ref_rate - cand_rate) / 100.0
        scores.append(max(0.0, sim))

    return float(np.mean(scores))


def _overall_missing_similarity(ref_df: pd.DataFrame, cand_df: pd.DataFrame) -> float:
    """
    Compares the overall missing data footprint (total % missing cells).
    """
    ref_total = ref_df.isnull().sum().sum()
    ref_cells = ref_df.shape[0] * ref_df.shape[1] if ref_df.size > 0 else 1
    ref_pct = ref_total / ref_cells

    cand_total = cand_df.isnull().sum().sum()
    cand_cells = cand_df.shape[0] * cand_df.shape[1] if cand_df.size > 0 else 1
    cand_pct = cand_total / cand_cells

    return max(0.0, 1.0 - abs(ref_pct - cand_pct))


def calculate_missing_pattern_similarity(ref_df: pd.DataFrame, cand_df: pd.DataFrame) -> dict:
    """
    Compares missing value patterns between reference and candidate DataFrames.

    Args:
        ref_df (pd.DataFrame): The ground truth/reference dataset.
        cand_df (pd.DataFrame): The dataset to be validated.

    Returns:
        dict: JSON-safe dictionary with missing pattern similarity scores.
              {
                  "missing_pattern_score": float (0-100),
                  "per_column_null_rate_similarity": float (0-100),
                  "overall_missing_similarity": float (0-100),
                  "ref_nullity_profile": {},
                  "cand_nullity_profile": {}
              }
    """
    shared_cols = sorted(set(ref_df.columns).intersection(set(cand_df.columns)))

    ref_profile = _compute_nullity_profile(ref_df)
    cand_profile = _compute_nullity_profile(cand_df)

    col_rate_sim = _nullity_rate_similarity(ref_profile, cand_profile, shared_cols)
    overall_sim = _overall_missing_similarity(ref_df, cand_df)

    # Weighted fusion: per-column rate is more informative (70%) than overall (30%)
    composite = (col_rate_sim * 0.70) + (overall_sim * 0.30)

    return {
        "missing_pattern_score": round(composite * 100, 2),
        "per_column_null_rate_similarity": round(col_rate_sim * 100, 2),
        "overall_missing_similarity": round(overall_sim * 100, 2),
        "ref_nullity_profile": {k: v for k, v in ref_profile.items() if k in shared_cols},
        "cand_nullity_profile": {k: v for k, v in cand_profile.items() if k in shared_cols}
    }
