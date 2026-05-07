import pandas as pd
import numpy as np
import json
from ml_engine.twin.twin_validator import run_twin_validation

def generate_mock_data():
    """Generates reference and candidate data for validation testing."""
    np.random.seed(42)
    n = 1000
    
    # Reference Data
    ref_data = {
        'age': np.random.normal(35, 10, n),
        'salary': np.random.lognormal(11, 0.5, n),
        'gender': np.random.choice(['Male', 'Female', 'Other'], n, p=[0.48, 0.48, 0.04]),
        'experience': np.random.randint(0, 40, n),
        'department': np.random.choice(['Engineering', 'Sales', 'HR', 'Product'], n)
    }
    ref_df = pd.DataFrame(ref_data)
    
    # Candidate Data (Slightly modified version of reference)
    cand_data = {
        'age': np.random.normal(36, 11, n), # Shifted mean/std
        'salary': np.random.lognormal(11.1, 0.55, n), # Shifted lognormal
        'gender': np.random.choice(['Male', 'Female', 'Other'], n, p=[0.45, 0.50, 0.05]), # Changed proportions
        'experience': np.random.randint(0, 42, n),
        'department': np.random.choice(['Engineering', 'Sales', 'HR', 'Product'], n),
        'extra_col': np.random.random(n) # Extra column
    }
    cand_df = pd.DataFrame(cand_data)
    
    # Introduce some nulls
    ref_df.loc[np.random.choice(n, 50), 'age'] = np.nan
    cand_df.loc[np.random.choice(n, 60), 'age'] = np.nan
    
    return ref_df, cand_df

def test_full_engine():
    print("🚀 Initializing Twin Validation Engine Test...")
    ref_df, cand_df = generate_mock_data()
    
    print(f"Reference shape: {ref_df.shape}")
    print(f"Candidate shape: {cand_df.shape}")
    
    # Run validation
    result = run_twin_validation(ref_df, cand_df)
    
    # Clean up component scores for clean printing
    summary = {
        "twin_similarity_score": result["twin_similarity_score"],
        "behavior_match": result["behavior_match"],
        "risk_level": result["risk_level"]
    }
    
    print("\n🎯 FINAL VALIDATION SUMMARY:")
    print(json.dumps(summary, indent=2))
    
    print("\n📊 COMPONENT SCORES:")
    for comp, res in result["component_scores"].items():
        # Get the primary score key from each result dict
        score_key = [k for k in res.keys() if "score" in k or "similarity" in k and isinstance(res[k], (int, float))][0]
        print(f" - {comp:25}: {res[score_key]}%")

if __name__ == "__main__":
    test_full_engine()
