import pandas as pd
import numpy as np

def calculate_schema_match(ref_df: pd.DataFrame, cand_df: pd.DataFrame) -> dict:
    """
    Compares the structural similarity between a reference DataFrame and a candidate DataFrame.
    
    This module analyzes column names and their respective datatypes to determine 
    how closely the candidate dataset matches the expected schema of the reference dataset.

    Args:
        ref_df (pd.DataFrame): The ground truth/reference dataset.
        cand_df (pd.DataFrame): The dataset to be validated.

    Returns:
        dict: A JSON-safe dictionary containing similarity scores and structural differences.
    """
    
    # 1. Column Analysis
    ref_cols = set(ref_df.columns)
    cand_cols = set(cand_df.columns)
    
    matched_columns = list(ref_cols.intersection(cand_cols))
    missing_columns = list(ref_cols - cand_cols)
    extra_columns = list(cand_cols - ref_cols)
    
    # Calculate column similarity score (0.0 to 1.0)
    # Based on how many reference columns are present in the candidate
    if len(ref_cols) == 0:
        column_similarity = 1.0 if len(cand_cols) == 0 else 0.0
    else:
        column_similarity = len(matched_columns) / len(ref_cols)

    # 2. Datatype Analysis
    dtype_matches = 0
    total_matched_cols = len(matched_columns)
    
    if total_matched_cols > 0:
        for col in matched_columns:
            ref_dtype = str(ref_df[col].dtype)
            cand_dtype = str(cand_df[col].dtype)
            
            # Direct match
            if ref_dtype == cand_dtype:
                dtype_matches += 1
            # Handle numeric compatibility (e.g., int64 vs float64) if needed, 
            # but strict schema matching usually expects same dtypes.
            # Here we follow strict matching.
            
        dtype_similarity = dtype_matches / total_matched_cols
    else:
        dtype_similarity = 0.0 if len(ref_cols) > 0 else 1.0

    # 3. Overall Schema Similarity Score
    # We weight column presence higher (60%) than dtype matching (40%) 
    # since missing columns are a more critical structural failure.
    schema_similarity_score = (column_similarity * 0.6) + (dtype_similarity * 0.4)
    
    # Handle the edge case where both are empty
    if len(ref_cols) == 0 and len(cand_cols) == 0:
        schema_similarity_score = 1.0

    return {
        "schema_similarity_score": round(float(schema_similarity_score) * 100, 2),
        "column_similarity": round(float(column_similarity) * 100, 2),
        "dtype_similarity": round(float(dtype_similarity) * 100, 2),
        "missing_columns": sorted(missing_columns),
        "extra_columns": sorted(extra_columns),
        "matched_columns": sorted(matched_columns)
    }
