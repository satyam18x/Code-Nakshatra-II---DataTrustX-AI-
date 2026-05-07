"""
categorical_similarity.py — Phase 3: Categorical Twin Matching

Compares categorical column distributions between a reference and candidate
DataFrame. Analyzes category frequency similarity, unique value overlap,
and entropy comparison.

Part of the Twin Validation Engine.
"""

import pandas as pd
import numpy as np
from typing import Dict, List
from collections import Counter


def _get_categorical_columns(ref_df: pd.DataFrame, cand_df: pd.DataFrame) -> List[str]:
    """
    Identifies categorical (object/category/bool) columns shared by both DataFrames.
    """
    cat_dtypes = ["object", "category", "bool"]
    ref_cats = set(ref_df.select_dtypes(include=cat_dtypes).columns)
    cand_cats = set(cand_df.select_dtypes(include=cat_dtypes).columns)
    return sorted(ref_cats.intersection(cand_cats))


def _compute_entropy(series: pd.Series) -> float:
    """
    Computes Shannon entropy of a categorical series.
    Higher entropy = more uniform distribution across categories.

    Returns:
        float: Entropy value >= 0. Returns 0.0 for empty/null series.
    """
    clean = series.dropna()
    if len(clean) == 0:
        return 0.0

    freq = clean.value_counts(normalize=True).values
    # Filter out zero-probability entries to avoid log(0)
    freq = freq[freq > 0]
    entropy = -np.sum(freq * np.log2(freq))
    return float(entropy)


def _frequency_similarity(ref_series: pd.Series, cand_series: pd.Series) -> float:
    """
    Compares category frequency distributions between two series.

    Uses the complement of the Total Variation Distance (TVD):
        similarity = 1 - 0.5 * sum(|p_ref - p_cand|)

    The union of all categories from both series is considered,
    so unseen categories in either side get frequency 0.

    Returns:
        float: Similarity in [0.0, 1.0].
    """
    ref_clean = ref_series.dropna()
    cand_clean = cand_series.dropna()

    if len(ref_clean) == 0 and len(cand_clean) == 0:
        return 1.0
    if len(ref_clean) == 0 or len(cand_clean) == 0:
        return 0.0

    ref_freq = ref_clean.value_counts(normalize=True)
    cand_freq = cand_clean.value_counts(normalize=True)

    # Union of all categories
    all_categories = set(ref_freq.index).union(set(cand_freq.index))

    total_diff = 0.0
    for cat in all_categories:
        p_ref = ref_freq.get(cat, 0.0)
        p_cand = cand_freq.get(cat, 0.0)
        total_diff += abs(p_ref - p_cand)

    # TVD is in [0, 2], so similarity = 1 - tvd/2
    similarity = 1.0 - (total_diff / 2.0)
    return max(0.0, similarity)


def _unique_overlap(ref_series: pd.Series, cand_series: pd.Series) -> float:
    """
    Computes Jaccard similarity of unique category sets.

    Jaccard = |intersection| / |union|

    Returns:
        float: Overlap score in [0.0, 1.0].
    """
    ref_unique = set(ref_series.dropna().unique())
    cand_unique = set(cand_series.dropna().unique())

    if len(ref_unique) == 0 and len(cand_unique) == 0:
        return 1.0

    union = ref_unique.union(cand_unique)
    if len(union) == 0:
        return 1.0

    intersection = ref_unique.intersection(cand_unique)
    return len(intersection) / len(union)


def _entropy_similarity(ref_series: pd.Series, cand_series: pd.Series) -> float:
    """
    Compares Shannon entropy between two categorical series.
    Uses normalized difference: 1 - |H_ref - H_cand| / max(H_ref, H_cand, epsilon)

    Returns:
        float: Similarity in [0.0, 1.0].
    """
    h_ref = _compute_entropy(ref_series)
    h_cand = _compute_entropy(cand_series)

    scale = max(h_ref, h_cand, 1e-9)
    similarity = 1.0 - abs(h_ref - h_cand) / scale
    return max(0.0, similarity)


def _compute_column_categorical_similarity(ref_series: pd.Series, cand_series: pd.Series) -> float:
    """
    Fuses frequency, overlap, and entropy similarity for a single column.

    Weights:
        - Frequency similarity: 50% (most important — distribution shape)
        - Unique overlap:       30% (category coverage)
        - Entropy similarity:   20% (distribution uniformity)

    Returns:
        float: Composite similarity in [0.0, 1.0].
    """
    freq_score = _frequency_similarity(ref_series, cand_series)
    overlap_score = _unique_overlap(ref_series, cand_series)
    entropy_score = _entropy_similarity(ref_series, cand_series)

    composite = (freq_score * 0.50) + (overlap_score * 0.30) + (entropy_score * 0.20)
    return composite


def calculate_categorical_similarity(ref_df: pd.DataFrame, cand_df: pd.DataFrame) -> dict:
    """
    Compares categorical column distributions between reference and candidate DataFrames.

    For each shared categorical column, computes frequency similarity, unique value
    overlap, and entropy comparison. Fuses them into per-column and overall scores.

    Args:
        ref_df (pd.DataFrame): The ground truth/reference dataset.
        cand_df (pd.DataFrame): The dataset to be validated.

    Returns:
        dict: JSON-safe dictionary with overall and per-column similarity scores.
              {
                  "categorical_similarity_score": float (0-100),
                  "column_scores": { "col_name": float (0-100), ... }
              }
    """
    shared_cats = _get_categorical_columns(ref_df, cand_df)

    if not shared_cats:
        return {
            "categorical_similarity_score": 0.0,
            "column_scores": {},
            "skipped_reason": "No shared categorical columns found."
        }

    column_scores = {}

    for col in shared_cats:
        score = _compute_column_categorical_similarity(ref_df[col], cand_df[col])
        column_scores[col] = round(score * 100, 2)

    overall = float(np.mean(list(column_scores.values())))

    return {
        "categorical_similarity_score": round(overall, 2),
        "column_scores": column_scores
    }
