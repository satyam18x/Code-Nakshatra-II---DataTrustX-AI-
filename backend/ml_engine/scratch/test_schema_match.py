import pandas as pd
from ml_engine.twin.schema_match import calculate_schema_match

def test_schema_match():
    # Create reference data
    ref_data = {
        'id': [1, 2, 3],
        'name': ['A', 'B', 'C'],
        'age': [25, 30, 35],
        'salary': [50000.0, 60000.0, 70000.0]
    }
    ref_df = pd.DataFrame(ref_data)
    
    # Create candidate data (missing 'salary', extra 'temp_col', 'age' is float)
    cand_data = {
        'id': [1, 2],
        'name': ['A', 'B'],
        'age': [25.0, 30.0], # Changed dtype
        'temp_col': ['x', 'y'] # Extra column
    }
    cand_df = pd.DataFrame(cand_data)
    
    result = calculate_schema_match(ref_df, cand_df)
    
    print("Reference Columns:", list(ref_df.columns))
    print("Candidate Columns:", list(cand_df.columns))
    print("\nResult:")
    import json
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    test_schema_match()
