import pandas as pd
import numpy as np
from ml_engine.twin.twin_validator import run_twin_validation
import json
import sys

def make_json_safe(obj):
    """Recursively converts NumPy types to native Python types for JSON serialization."""
    if isinstance(obj, dict):
        return {k: make_json_safe(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [make_json_safe(v) for v in obj]
    elif isinstance(obj, np.bool_):
        return bool(obj)
    elif isinstance(obj, np.integer):
        return int(obj)
    elif isinstance(obj, np.floating):
        return float(obj)
    return obj

def test_csv_validation():
    print(f"--- Loading Data ---")
    print(f"Reference: {'reference_small.csv'}")
    print(f"Candidate: {'candidate_right.csv'}")
    
    try:
        ref_df = pd.read_csv("reference_small.csv")
        cand_df = pd.read_csv("candidate_right.csv")
    except Exception as e:
        print(f"Error loading CSV files: {e}")
        return

    print("--- Running Twin Validation ---")
    results = run_twin_validation(ref_df, cand_df)
    
    print("\n--- Validation Results ---")
    print(f"Twin Similarity Score: {results['twin_similarity_score']}%")
    print(f"Behavior Match: {results['behavior_match']}")
    print(f"Risk Level: {results['risk_level']}")
    
    print("\n--- Component Scores ---")
    for component, res in results['component_scores'].items():
        # The key for score might vary, let's find it
        score_key = next((k for k in res.keys() if "score" in k), None)
        if score_key:
            print(f"- {component}: {res[score_key]}")
        else:
            print(f"- {component}: No score key found in {res.keys()}")

    # Save results (convert NumPy types to native Python for JSON serialization)
    output_file = "csv_validation_results.json"
    with open(output_file, "w") as f:
        safe_results = make_json_safe(results)
        json.dump(safe_results, f, indent=4)
    print(f"\nFull results saved to {output_file}")

if __name__ == "__main__":
    test_csv_validation()
