from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
import shutil
import os 
import uuid
import json

from app.core.dependencies import get_current_user, get_db
from app.models.deal import Deal
from app.models.validation import ValidationResult
from app.models.request import DatasetRequest
from ml_engine import validator

router = APIRouter()

TEMP_DIR = "temp_uploads"
UPLOADS_DIR = "uploads"
os.makedirs(TEMP_DIR, exist_ok=True)
os.makedirs(UPLOADS_DIR, exist_ok=True)

@router.post("/deliver/{deal_id}")
def mark_delivered(
    deal_id: int,
    file: UploadFile = File(...),
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    deal = db.query(Deal).filter(Deal.id == deal_id).first()
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")

    if deal.seller_username != user.username:
        raise HTTPException(status_code=403, detail="Only seller can mark delivery")

    # Fetch associated request to check type
    request = db.query(DatasetRequest).filter(DatasetRequest.id == deal.request_id).first()
    if not request:
        raise HTTPException(status_code=404, detail="Associated request not found")

    # 1. Save File Temporarily
    temp_filename = f"{uuid.uuid4()}_{file.filename}"
    file_path = os.path.join(TEMP_DIR, temp_filename)
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
         raise HTTPException(status_code=500, detail=f"File upload failed: {e}")

    # 2. Run ML Validation
    try:
        if request.request_type == "similar" and request.reference_dataset_path:
            # RUN TWIN VALIDATION
            report = validator.run_twin_validation_wrapper(
                request.reference_dataset_path, 
                file_path
            )
        else:
            # RUN STANDARD VALIDATION
            report = validator.run_validation(file_path)
    except Exception as e:
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"Validation error: {e}")

    # 3. Check Result
    status = report.get("status")
    score = report.get("final_trust_score", 0.0)
    reason = report.get("reason", "Unknown")

    if status == "PASS":
        # MOVE file to permanent storage
        final_path = os.path.join(UPLOADS_DIR, f"{deal_id}.csv")
        shutil.move(file_path, final_path)
        
        # Save validation result to history
        validation_record = ValidationResult(
            username=user.username,
            deal_id=deal_id,
            final_score=score,
            status="passed",
            report_json=json.dumps(report)
        )
        db.add(validation_record)
        
        deal.delivery_status = "delivered"
        deal.validation_status = "pass"
        deal.quality_score = score
        db.commit()
        return {
            "message": "Dataset validated and delivered successfully!",
            "score": score,
            "status": "PASS",
             "report": report
        }
    else:
         # DELETE temp file
         if os.path.exists(file_path):
            os.remove(file_path)
         
         # Save validation result to history (even for failures)
         validation_record = ValidationResult(
             username=user.username,
             deal_id=deal_id,
             final_score=score,
             status="failed",
             report_json=json.dumps(report)
         )
         db.add(validation_record)
         
         deal.validation_status = "fail"
         deal.quality_score = score
         db.commit()
         raise HTTPException(
             status_code=400, 
             detail=f"Validation FAILED (Score: {score}). Reason: {reason}"
         )

@router.get("/download/{deal_id}")
def download_dataset(
    deal_id: int,
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    deal = db.query(Deal).filter(Deal.id == deal_id).first()
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")

    # Only buyer (and ideally seller/admin) can download
    if deal.buyer_username != user.username and deal.seller_username != user.username:
        raise HTTPException(status_code=403, detail="Not authorized to download this dataset")

    # Buyer must have paid before downloading
    if deal.buyer_username == user.username and deal.payment_status != "escrowed":
        raise HTTPException(
            status_code=403,
            detail="Payment required. Please complete payment to unlock download access."
        )

    if deal.delivery_status != "delivered":
        raise HTTPException(status_code=400, detail="Dataset not yet delivered")

    file_path = os.path.join(UPLOADS_DIR, f"{deal_id}.csv")
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File file not found on server")

    return FileResponse(file_path, media_type='text/csv', filename=f"dataset_{deal_id}.csv")
