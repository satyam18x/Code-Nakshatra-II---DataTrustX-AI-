import pandas as pd
import numpy as np
from ml_engine.twin.twin_validator import run_twin_validation
import json

def generate_sample_data():
    """Generates a reference and a candidate dataset for testing."""
    np.random.seed(42)
    
    # Reference Data
    n_rows = 1000
    ref_df = pd.DataFrame({
        "age": np.random.normal(35, 10, n_rows),
        "income": np.random.lognormal(10, 1, n_rows),
        "score": np.random.uniform(0, 100, n_rows),
        "category": np.random.choice(["A", "B", "C"], n_rows),
        "missing_col": np.random.choice([1, np.nan], n_rows, p=[0.8, 0.2])
    })
    
    # Candidate Data (Slightly perturbed)
    cand_df = pd.DataFrame({
        "age": np.random.normal(36, 11, n_rows), # Slightly different mean/std
        "income": np.random.lognormal(10.1, 1.1, n_rows),
        "score": np.random.uniform(5, 95, n_rows),
        "category": np.random.choice(["A", "B", "C", "D"], n_rows), # Added a category
        "missing_col": np.random.choice([1, np.nan], n_rows, p=[0.75, 0.25])
    })
    
    return ref_df, cand_df

def test_validator():
    print("--- Generating Sample Data ---")
    ref_df, cand_df = generate_sample_data()
    
    print("--- Running Twin Validation ---")
    results = run_twin_validation(ref_df, cand_df)
    
    print("\n--- Validation Results ---")
    print(f"Twin Similarity Score: {results['twin_similarity_score']}%")
    print(f"Behavior Match: {results['behavior_match']}")
    print(f"Risk Level: {results['risk_level']}")
    
    print("\n--- Component Scores ---")
    for component, res in results['component_scores'].items():
        # Handle cases where score might be in different keys depending on the module
        score_key = next((k for k in res.keys() if "score" in k), "N/A")
        score = res.get(score_key, "N/A")
        print(f"- {component}: {score}")

    # Optional: Save full results to a JSON file
    with open("validation_results.json", "w") as f:
        json.dump(results, f, indent=4)
    print("\nFull results saved to validation_results.json")

if __name__ == "__main__":
    try:
        test_validator()
    except Exception as e:
        print(f"An error occurred: {e}")
        import traceback
        traceback.print_exc()
