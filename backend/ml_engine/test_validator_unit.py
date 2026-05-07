import pytest
import pandas as pd
import numpy as np
from ml_engine.twin.twin_validator import TwinValidator

def test_identical_dataframes():
    """Test that two identical dataframes yield a 100% similarity score."""
    df = pd.DataFrame({
        "A": [1, 2, 3, 4, 5],
        "B": [10.5, 20.5, 30.5, 40.5, 50.5],
        "C": ["cat", "dog", "cat", "dog", "bird"]
    })
    
    validator = TwinValidator()
    results = validator.validate(df, df)
    
    assert results["twin_similarity_score"] >= 99.0
    assert results["risk_level"] == "LOW"
    assert results["behavior_match"] is True

def test_completely_different_dataframes():
    """Test that completely different dataframes yield a low similarity score."""
    df_ref = pd.DataFrame({
        "A": [1, 2, 3, 4, 5],
        "B": ["a", "b", "c", "d", "e"]
    })
    
    df_cand = pd.DataFrame({
        "X": [100, 200, 300],
        "Y": [True, False, True]
    })
    
    validator = TwinValidator()
    results = validator.validate(df_ref, df_cand)
    
    # Since there are no shared columns, similarity should be very low (0 or near 0)
    assert results["twin_similarity_score"] < 50.0
    assert results["risk_level"] == "HIGH"
    assert results["behavior_match"] is False

def test_shifted_distributions():
    """Test that shifted numerical distributions reduce the score."""
    df_ref = pd.DataFrame({"val": np.random.normal(0, 1, 1000)})
    df_cand = pd.DataFrame({"val": np.random.normal(10, 1, 1000)})
    
    validator = TwinValidator()
    results = validator.validate(df_ref, df_cand)
    
    # Distribution and Numeric similarity should be low
    assert results["component_scores"]["distribution_intelligence"]["distribution_similarity_score"] < 50.0
    assert results["twin_similarity_score"] < 90.0

if __name__ == "__main__":
    # If run directly, execute the tests
    import sys
    pytest.main([__file__])
