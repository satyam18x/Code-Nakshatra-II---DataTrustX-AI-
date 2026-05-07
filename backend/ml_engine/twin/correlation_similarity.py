"""
correlation_similarity.py — Phase 5: Relationship Preservation

Compares correlation structures between reference and candidate DataFrames.
Detects broken inter-column relationships — the strongest signal for
synthetic corruption, fake balancing, and unrealistic data.

Part of the Twin Validation Engine.
"""

import pandas as pd
import numpy as np
from typing import List


def _get_shared_numeric_columns(ref_df: pd.DataFrame, cand_df: pd.DataFrame) -> List[str]:
    """
    Returns sorted list of numeric columns present in both DataFrames.
    Excludes constant columns (std == 0) which produce NaN correlations.
    """
    ref_num = set(ref_df.select_dtypes(include=[np.number]).columns)
    cand_num = set(cand_df.select_dtypes(include=[np.number]).columns)
    shared = sorted(ref_num.intersection(cand_num))

    # Filter out constant columns in either DataFrame
    valid = []
    for col in shared:
        ref_std = ref_df[col].dropna().std()
        cand_std = cand_df[col].dropna().std()
        if ref_std is not None and cand_std is not None:
            if ref_std > 1e-9 and cand_std > 1e-9:
                valid.append(col)
    return valid


def _compute_correlation_matrix(df: pd.DataFrame, columns: List[str]) -> pd.DataFrame:
    """
    Computes the Pearson correlation matrix for the given columns.
    NaN values are handled by pairwise complete observations.

    Returns:
        pd.DataFrame: Correlation matrix.
    """
    return df[columns].corr(method="pearson")


def _matrix_similarity(ref_corr: pd.DataFrame, cand_corr: pd.DataFrame) -> float:
    """
    Computes similarity between two correlation matrices using the
    Frobenius norm of the difference, normalized to [0, 1].

    Formula:
        similarity = 1 - frobenius_norm(ref - cand) / frobenius_norm_max

    The maximum possible Frobenius norm for the difference of two
    correlation matrices (with values in [-1, 1]) is 2 * sqrt(n*(n-1)/2)
    for the off-diagonal elements.

    Returns:
        float: Similarity in [0.0, 1.0].
    """
    n = len(ref_corr)
    if n <= 1:
        return 1.0

    # Replace any NaN values with 0 for safe computation
    ref_matrix = ref_corr.fillna(0).values
    cand_matrix = cand_corr.fillna(0).values

    # Compute difference only on upper triangle (excluding diagonal)
    diff_matrix = ref_matrix - cand_matrix
    upper_indices = np.triu_indices(n, k=1)
    diff_values = diff_matrix[upper_indices]

    if len(diff_values) == 0:
        return 1.0

    # Frobenius norm of the upper-triangle difference
    frobenius = np.sqrt(np.sum(diff_values ** 2))

    # Maximum possible difference: each pair can differ by at most 2
    # (from -1 to +1), so max frobenius = 2 * sqrt(num_pairs)
    num_pairs = len(diff_values)
    max_frobenius = 2.0 * np.sqrt(num_pairs)

    if max_frobenius < 1e-9:
        return 1.0

    similarity = 1.0 - (frobenius / max_frobenius)
    return max(0.0, similarity)


def _detect_broken_relationships(
    ref_corr: pd.DataFrame,
    cand_corr: pd.DataFrame,
    threshold: float = 0.3
) -> list:
    """
    Identifies column pairs where the absolute difference in correlation
    exceeds the given threshold. These represent broken relationships.

    Args:
        ref_corr: Reference correlation matrix.
        cand_corr: Candidate correlation matrix.
        threshold: Minimum absolute difference to flag (default 0.3).

    Returns:
        list: List of dicts describing broken relationships.
    """
    broken = []
    columns = ref_corr.columns.tolist()
    n = len(columns)

    for i in range(n):
        for j in range(i + 1, n):
            ref_val = ref_corr.iloc[i, j]
            cand_val = cand_corr.iloc[i, j]

            # Skip NaN correlations
            if np.isnan(ref_val) or np.isnan(cand_val):
                continue

            diff = abs(ref_val - cand_val)
            if diff >= threshold:
                broken.append({
                    "column_pair": [columns[i], columns[j]],
                    "reference_correlation": round(float(ref_val), 4),
                    "candidate_correlation": round(float(cand_val), 4),
                    "absolute_difference": round(float(diff), 4)
                })

    # Sort by severity (largest difference first)
    broken.sort(key=lambda x: x["absolute_difference"], reverse=True)
    return broken


def calculate_correlation_similarity(ref_df: pd.DataFrame, cand_df: pd.DataFrame) -> dict:
    """
    Compares correlation structures between reference and candidate DataFrames.
    Detects broken inter-column relationships that indicate synthetic corruption.

    Args:
        ref_df (pd.DataFrame): The ground truth/reference dataset.
        cand_df (pd.DataFrame): The dataset to be validated.

    Returns:
        dict: JSON-safe dictionary with correlation similarity score and
              broken relationship details.
              {
                  "correlation_similarity_score": float (0-100),
                  "broken_relationships": [...],
                  "num_pairs_compared": int
              }
    """
    shared = _get_shared_numeric_columns(ref_df, cand_df)

    # Need at least 2 columns to compute correlations
    if len(shared) < 2:
        return {
            "correlation_similarity_score": 100.0 if len(shared) <= 1 else 0.0,
            "broken_relationships": [],
            "num_pairs_compared": 0,
            "skipped_reason": "Fewer than 2 shared non-constant numeric columns."
        }

    ref_corr = _compute_correlation_matrix(ref_df, shared)
    cand_corr = _compute_correlation_matrix(cand_df, shared)

    similarity = _matrix_similarity(ref_corr, cand_corr)
    broken = _detect_broken_relationships(ref_corr, cand_corr)

    num_pairs = len(shared) * (len(shared) - 1) // 2

    return {
        "correlation_similarity_score": round(similarity * 100, 2),
        "broken_relationships": broken,
        "num_pairs_compared": num_pairs
    }
