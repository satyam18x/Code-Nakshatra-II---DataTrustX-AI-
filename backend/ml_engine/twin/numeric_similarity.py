"""
numeric_similarity.py — Phase 2: Numeric Behavior Matching

Compares statistical behavior of numerical columns between a reference
and candidate DataFrame. Does NOT compare exact row values — only
aggregate statistical properties (mean, std, quantiles, etc.).

Part of the Twin Validation Engine.
"""

import pandas as pd
import numpy as np
from typing import Dict, List, Tuple


def _get_numeric_columns(ref_df: pd.DataFrame, cand_df: pd.DataFrame) -> List[str]:
    """
    Identifies numeric columns that exist in BOTH DataFrames.
    Only shared numeric columns can be meaningfully compared.
    """
    ref_numeric = set(ref_df.select_dtypes(include=[np.number]).columns)
    cand_numeric = set(cand_df.select_dtypes(include=[np.number]).columns)
    return sorted(ref_numeric.intersection(cand_numeric))


def _safe_stat(series: pd.Series, func_name: str) -> float:
    """
    Safely computes a statistical function on a series, returning NaN
    if the series is empty or fully null.
    """
    clean = series.dropna()
    if len(clean) == 0:
        return np.nan

    stat_map = {
        "mean": clean.mean,
        "std": clean.std,
        "min": clean.min,
        "max": clean.max,
        "median": clean.median,
        "var": clean.var,
        "q25": lambda: clean.quantile(0.25),
        "q75": lambda: clean.quantile(0.75),
    }

    try:
        return float(stat_map[func_name]())
    except Exception:
        return np.nan


def _normalized_difference(val_ref: float, val_cand: float) -> float:
    """
    Computes a normalized similarity between two scalar statistics.
    Returns a value in [0.0, 1.0] where 1.0 means identical.

    Uses the formula:  1 - |a - b| / max(|a|, |b|, 1e-9)
    The epsilon (1e-9) prevents division by zero when both values are near 0.
    """
    if np.isnan(val_ref) or np.isnan(val_cand):
        return 0.0

    diff = abs(val_ref - val_cand)
    scale = max(abs(val_ref), abs(val_cand), 1e-9)
    similarity = 1.0 - (diff / scale)
    return max(0.0, similarity)


def _compute_column_similarity(ref_series: pd.Series, cand_series: pd.Series) -> float:
    """
    Computes a composite similarity score for a single numeric column
    by averaging normalized differences across multiple statistics.

    Statistics compared:
        mean, std, min, max, median, variance, Q25, Q75

    Returns:
        float: Similarity score in [0.0, 1.0].
    """
    stats = ["mean", "std", "min", "max", "median", "var", "q25", "q75"]
    scores = []

    for stat_name in stats:
        ref_val = _safe_stat(ref_series, stat_name)
        cand_val = _safe_stat(cand_series, stat_name)
        scores.append(_normalized_difference(ref_val, cand_val))

    if not scores:
        return 0.0

    return float(np.mean(scores))


def calculate_numeric_similarity(ref_df: pd.DataFrame, cand_df: pd.DataFrame) -> dict:
    """
    Compares numerical behavior between a reference and candidate DataFrame.

    For each shared numeric column, computes per-stat similarity scores and
    fuses them into a per-column score. All per-column scores are then averaged
    into an overall numeric_similarity_score.

    Args:
        ref_df (pd.DataFrame): The ground truth/reference dataset.
        cand_df (pd.DataFrame): The dataset to be validated.

    Returns:
        dict: A JSON-safe dictionary with overall and per-column similarity scores.
              {
                  "numeric_similarity_score": float (0-100),
                  "column_scores": { "col_name": float (0-100), ... }
              }
    """
    shared_numeric = _get_numeric_columns(ref_df, cand_df)

    # Edge case: no shared numeric columns
    if not shared_numeric:
        return {
            "numeric_similarity_score": 0.0,
            "column_scores": {},
            "skipped_reason": "No shared numeric columns found."
        }

    column_scores = {}

    for col in shared_numeric:
        score = _compute_column_similarity(ref_df[col], cand_df[col])
        column_scores[col] = round(score * 100, 2)

    # Overall score is the average across all column scores
    overall = float(np.mean(list(column_scores.values())))

    return {
        "numeric_similarity_score": round(overall, 2),
        "column_scores": column_scores
    }
