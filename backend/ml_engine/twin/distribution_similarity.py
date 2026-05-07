"""
distribution_similarity.py — Phase 4: Distribution Intelligence

Uses advanced statistical tests to compare underlying numerical distributions
between reference and candidate DataFrames. This is the power layer —
it catches synthetic data that copies ranges/means but fails true distribution matching.

Algorithms:
    - Kolmogorov-Smirnov (KS) Test
    - Wasserstein Distance (Earth Mover's Distance)
    - Jensen-Shannon Divergence

Part of the Twin Validation Engine.
"""

import pandas as pd
import numpy as np
from typing import List
from scipy import stats
from scipy.spatial.distance import jensenshannon


def _get_shared_numeric_columns(ref_df: pd.DataFrame, cand_df: pd.DataFrame) -> List[str]:
    """
    Returns sorted list of numeric columns present in both DataFrames.
    """
    ref_num = set(ref_df.select_dtypes(include=[np.number]).columns)
    cand_num = set(cand_df.select_dtypes(include=[np.number]).columns)
    return sorted(ref_num.intersection(cand_num))


def _ks_similarity(ref_series: pd.Series, cand_series: pd.Series) -> float:
    """
    Kolmogorov-Smirnov test similarity.

    The KS statistic measures the maximum distance between two empirical CDFs.
    KS statistic is in [0, 1], where 0 = identical distributions.
    Similarity = 1 - KS_statistic.

    Returns:
        float: Similarity in [0.0, 1.0].
    """
    ref_clean = ref_series.dropna().values
    cand_clean = cand_series.dropna().values

    if len(ref_clean) < 2 or len(cand_clean) < 2:
        return 0.0

    try:
        ks_stat, _ = stats.ks_2samp(ref_clean, cand_clean)
        return max(0.0, 1.0 - ks_stat)
    except Exception:
        return 0.0


def _wasserstein_similarity(ref_series: pd.Series, cand_series: pd.Series) -> float:
    """
    Wasserstein (Earth Mover's) Distance similarity.

    The Wasserstein distance measures the "work" needed to transform one
    distribution into another. We normalize it by the combined range
    of both distributions to produce a score in [0, 1].

    Returns:
        float: Similarity in [0.0, 1.0].
    """
    ref_clean = ref_series.dropna().values.astype(float)
    cand_clean = cand_series.dropna().values.astype(float)

    if len(ref_clean) < 2 or len(cand_clean) < 2:
        return 0.0

    try:
        w_dist = stats.wasserstein_distance(ref_clean, cand_clean)
        # Normalize by combined range
        combined = np.concatenate([ref_clean, cand_clean])
        data_range = np.ptp(combined)  # max - min
        if data_range < 1e-9:
            return 1.0  # Both distributions are effectively constant
        normalized = w_dist / data_range
        return max(0.0, 1.0 - normalized)
    except Exception:
        return 0.0


def _jsd_similarity(ref_series: pd.Series, cand_series: pd.Series, n_bins: int = 50) -> float:
    """
    Jensen-Shannon Divergence similarity.

    JSD is a symmetric, bounded divergence measure based on KL-divergence.
    JSD is in [0, 1] (when using log base 2), where 0 = identical.
    Similarity = 1 - JSD.

    We histogram both distributions into shared bins to compute JSD.

    Args:
        n_bins: Number of histogram bins for discretization.

    Returns:
        float: Similarity in [0.0, 1.0].
    """
    ref_clean = ref_series.dropna().values.astype(float)
    cand_clean = cand_series.dropna().values.astype(float)

    if len(ref_clean) < 2 or len(cand_clean) < 2:
        return 0.0

    try:
        # Create shared bin edges from the combined data range
        combined = np.concatenate([ref_clean, cand_clean])
        bin_edges = np.linspace(combined.min(), combined.max(), n_bins + 1)

        # Compute histograms (probability distributions)
        ref_hist, _ = np.histogram(ref_clean, bins=bin_edges, density=False)
        cand_hist, _ = np.histogram(cand_clean, bins=bin_edges, density=False)

        # Convert to probability distributions with Laplace smoothing
        # to avoid zero-probability bins
        ref_prob = (ref_hist + 1e-10) / (ref_hist + 1e-10).sum()
        cand_prob = (cand_hist + 1e-10) / (cand_hist + 1e-10).sum()

        # scipy's jensenshannon returns sqrt(JSD), so square it for true JSD
        jsd_value = jensenshannon(ref_prob, cand_prob, base=2) ** 2
        return max(0.0, 1.0 - jsd_value)
    except Exception:
        return 0.0


def _compute_column_distribution_similarity(ref_series: pd.Series, cand_series: pd.Series) -> dict:
    """
    Computes all three distribution similarity metrics for a single column
    and fuses them into a composite score.

    Weights:
        - KS similarity:          35% (overall CDF shape)
        - Wasserstein similarity:  35% (distribution transport cost)
        - JSD similarity:          30% (information-theoretic divergence)

    Returns:
        dict: Per-metric and composite scores for the column.
    """
    ks = _ks_similarity(ref_series, cand_series)
    ws = _wasserstein_similarity(ref_series, cand_series)
    jsd = _jsd_similarity(ref_series, cand_series)

    composite = (ks * 0.35) + (ws * 0.35) + (jsd * 0.30)

    return {
        "ks_similarity": round(ks * 100, 2),
        "wasserstein_similarity": round(ws * 100, 2),
        "jsd_similarity": round(jsd * 100, 2),
        "composite_score": round(composite * 100, 2)
    }


def calculate_distribution_similarity(ref_df: pd.DataFrame, cand_df: pd.DataFrame) -> dict:
    """
    Compares underlying numerical distributions between reference and candidate
    DataFrames using KS Test, Wasserstein Distance, and Jensen-Shannon Divergence.

    Args:
        ref_df (pd.DataFrame): The ground truth/reference dataset.
        cand_df (pd.DataFrame): The dataset to be validated.

    Returns:
        dict: JSON-safe dictionary with overall and per-column distribution scores.
              {
                  "distribution_similarity_score": float (0-100),
                  "column_scores": {
                      "col_name": {
                          "ks_similarity": float,
                          "wasserstein_similarity": float,
                          "jsd_similarity": float,
                          "composite_score": float
                      }, ...
                  }
              }
    """
    shared_numeric = _get_shared_numeric_columns(ref_df, cand_df)

    if not shared_numeric:
        return {
            "distribution_similarity_score": 0.0,
            "column_scores": {},
            "skipped_reason": "No shared numeric columns found."
        }

    column_scores = {}

    for col in shared_numeric:
        col_result = _compute_column_distribution_similarity(ref_df[col], cand_df[col])
        column_scores[col] = col_result

    # Overall score = average of composite scores
    composites = [v["composite_score"] for v in column_scores.values()]
    overall = float(np.mean(composites))

    return {
        "distribution_similarity_score": round(overall, 2),
        "column_scores": column_scores
    }
