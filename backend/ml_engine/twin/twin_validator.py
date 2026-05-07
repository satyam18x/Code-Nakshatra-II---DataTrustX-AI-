"""
twin_validator.py — Phase 6: Final Twin Fusion Engine

The orchestrator module that executes all validation phases and fuses their
scores into a single Twin Similarity Score. It also classifies the result
into risk levels and determines the final behavior match status.

Part of the Twin Validation Engine.
"""

import pandas as pd
import numpy as np
from typing import Dict, Any

# Internal module imports
from .schema_match import calculate_schema_match
from .numeric_similarity import calculate_numeric_similarity
from .categorical_similarity import calculate_categorical_similarity
from .distribution_similarity import calculate_distribution_similarity
from .correlation_similarity import calculate_correlation_similarity
from .missing_pattern import calculate_missing_pattern_similarity

class TwinValidator:
    """
    Main orchestrator for the Twin Validation Engine.
    Executes structural, statistical, distributional, and relationship analyses.
    """
    
    def __init__(self, weights: Dict[str, float] = None):
        """
        Initialize the validator with custom weights for the fusion engine.
        
        Default weights prioritize behavioral and relationship preservation:
        - schema: 10%
        - numeric: 20%
        - categorical: 20%
        - distribution: 25%
        - correlation: 25%
        """
        self.weights = weights or {
            "schema": 0.10,
            "numeric": 0.20,
            "categorical": 0.20,
            "distribution": 0.25,
            "correlation": 0.25
        }
        
    def _classify_risk(self, score: float) -> str:
        """Classifies the twin similarity score into a risk level."""
        if score >= 90:
            return "LOW"
        elif score >= 75:
            return "MEDIUM"
        else:
            return "HIGH"

    def validate(self, ref_df: pd.DataFrame, cand_df: pd.DataFrame) -> Dict[str, Any]:
        """
        Performs a full twin validation between two DataFrames.
        
        Args:
            ref_df: Reference DataFrame (the 'Twin' or ground truth).
            cand_df: Candidate DataFrame (to be validated).
            
        Returns:
            Dict containing the final score, risk level, and detailed components.
        """
        # Execute all validation modules
        schema_res = calculate_schema_match(ref_df, cand_df)
        numeric_res = calculate_numeric_similarity(ref_df, cand_df)
        categorical_res = calculate_categorical_similarity(ref_df, cand_df)
        distribution_res = calculate_distribution_similarity(ref_df, cand_df)
        correlation_res = calculate_correlation_similarity(ref_df, cand_df)
        missing_res = calculate_missing_pattern_similarity(ref_df, cand_df)
        
        # Extract component scores
        scores = {
            "schema": schema_res["schema_similarity_score"],
            "numeric": numeric_res["numeric_similarity_score"],
            "categorical": categorical_res["categorical_similarity_score"],
            "distribution": distribution_res["distribution_similarity_score"],
            "correlation": correlation_res["correlation_similarity_score"]
        }
        
        # Calculate Final Weighted Twin Similarity Score
        final_score = sum(scores[k] * self.weights[k] for k in self.weights)
        
        # Determine behavior match (True if score is at least 75%)
        behavior_match = final_score >= 75.0
        risk_level = self._classify_risk(final_score)
        
        return {
            "twin_similarity_score": round(float(final_score), 2),
            "behavior_match": behavior_match,
            "risk_level": risk_level,
            "component_scores": {
                "structural_analysis": schema_res,
                "numeric_behavior": numeric_res,
                "categorical_twin": categorical_res,
                "distribution_intelligence": distribution_res,
                "relationship_preservation": correlation_res,
                "missing_pattern_analysis": missing_res
            }
        }

def run_twin_validation(ref_df: pd.DataFrame, cand_df: pd.DataFrame) -> Dict[str, Any]:
    """Helper function for quick FastAPI/CLI integration."""
    validator = TwinValidator()
    return validator.validate(ref_df, cand_df)
