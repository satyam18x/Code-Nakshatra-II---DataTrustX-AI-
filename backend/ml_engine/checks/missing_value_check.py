def check_missing_values(df):

    total_cells = (
        df.shape[0] * df.shape[1]
    )

    missing_count = (
        df.isnull().sum().sum()
    )

    valid_cells = (
        total_cells - missing_count
    )

    valid_percentage = round(
        (valid_cells / total_cells) * 100,
        2
    )

    score = round(
        (valid_cells / total_cells) * 10,
        2
    )

    status = (
        "PASSED"
        if valid_percentage >= 70
        else "FAILED"
    )

    return {
        "status": status,
        "score": score,
        "max_score": 10,
        "valid_percentage": (
            valid_percentage
        ),
        "missing_values": int(
            missing_count
        )
    }