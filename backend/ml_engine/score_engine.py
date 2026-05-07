def calculate_trust_score(report):

    total_score = 0

    total_possible = 0

    executed_checks = 0

    skipped_checks = 0

    details = {}

    # ======================================
    # LOOP THROUGH ALL CHECKS
    # ======================================

    for check_name, result in report.items():

        status = result.get("status")

        # ==================================
        # SKIPPED CHECKS
        # ==================================

        if status == "SKIPPED":

            skipped_checks += 1

            details[check_name] = {
                "status": "SKIPPED"
            }

            continue

        # ==================================
        # GET SCORE
        # ==================================

        score = result.get(
            "score",
            0
        )

        max_score = result.get(
            "max_score",
            10
        )

        total_score += score

        total_possible += max_score

        executed_checks += 1

        # ==================================
        # STORE DETAILS
        # ==================================

        details[check_name] = {
            "status": status,
            "score": score,
            "max_score": max_score,
            "valid_percentage": (
                result.get(
                    "valid_percentage"
                )
            )
        }

    # ======================================
    # FINAL TRUST SCORE
    # ======================================

    if total_possible == 0:

        trust_score = 0

    else:

        trust_score = round(
            (
                total_score /
                total_possible
            ) * 100,
            2
        )

    # ======================================
    # FINAL STATUS
    # ======================================

    if trust_score >= 70:

        final_status = "PASSED"

    else:

        final_status = "FAILED"

    # ======================================
    # FINAL RESPONSE
    # ======================================

    return {
        "final_status": final_status,
        "trust_score": trust_score,
        "total_score": round(
            total_score,
            2
        ),
        "total_possible": total_possible,
        "executed_checks": (
            executed_checks
        ),
        "skipped_checks": (
            skipped_checks
        ),
        "details": details
    }