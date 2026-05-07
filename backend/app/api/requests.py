from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from typing import Optional
import os
import uuid
import shutil
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.core.dependencies import get_current_user, get_db
from app.models.request import DatasetRequest
from app.models.offer import DatasetOffer
from app.models.deal import Deal

router = APIRouter()

UPLOADS_DIR = "uploads/reference_datasets"
os.makedirs(UPLOADS_DIR, exist_ok=True)

@router.post("/request")
async def create_request(
    title: str = Form(...),
    description: str = Form(...),
    domain: str = Form(...),
    budget: str = Form(...),
    request_type: str = Form("text"), # "text" or "similar"
    file: Optional[UploadFile] = File(None),
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    print(f"DEBUG: Received request: title={title}, type={request_type}, file={file.filename if file else 'None'}")
    if user.role != "buyer":
        raise HTTPException(
            status_code=403,
            detail="Only buyers can create dataset requests"
        )

    reference_path = None
    if request_type == "similar" and file:
        file_ext = os.path.splitext(file.filename)[1]
        filename = f"{uuid.uuid4()}{file_ext}"
        reference_path = os.path.join(UPLOADS_DIR, filename)
        
        with open(reference_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

    req = DatasetRequest(
        buyer_username=user.username,
        title=title,
        description=description,
        domain=domain,
        budget=budget,
        request_type=request_type,
        reference_dataset_path=reference_path
    )

    db.add(req)
    db.commit()

    return {
        "message": "Dataset request posted successfully",
        "request_id": req.id,
        "type": request_type
    }


@router.get("/my_requests")
def get_my_requests(
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if user.role != "buyer":
        raise HTTPException(
            status_code=403,
            detail="Only buyers can view their requests"
        )

    requests = (
        db.query(DatasetRequest)
        .filter(DatasetRequest.buyer_username == user.username)
        .order_by(DatasetRequest.created_at.desc())
        .all()
    )

    return [
        {
            "id": r.id,
            "title": r.title,
            "description": r.description,
            "domain": r.domain,
            "created_at": r.created_at
        }
        for r in requests
    ]


@router.get("/buyer_stats")
def get_buyer_stats(
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if user.role != "buyer":
        raise HTTPException(status_code=403, detail="Only buyers can view their stats")

    # All request IDs belonging to this buyer
    my_request_ids = [
        r.id for r in db.query(DatasetRequest.id)
        .filter(DatasetRequest.buyer_username == user.username)
        .all()
    ]

    pending_requirements = len(my_request_ids)

    # Capital deployed: sum of prices of deals that are escrowed or released
    capital_result = (
        db.query(func.sum(Deal.price))
        .filter(
            Deal.buyer_username == user.username,
            Deal.payment_status.in_(["escrowed", "released"])
        )
        .scalar()
    )
    capital_deployed = capital_result or 0

    # Verified offers: total offers received on this buyer's requests
    verified_offers = 0
    if my_request_ids:
        verified_offers = (
            db.query(func.count(DatasetOffer.id))
            .filter(DatasetOffer.request_id.in_(my_request_ids))
            .scalar()
        ) or 0

    # Completed assets: deals where delivery is confirmed
    completed_assets = (
        db.query(func.count(Deal.id))
        .filter(
            Deal.buyer_username == user.username,
            Deal.delivery_status == "confirmed"
        )
        .scalar()
    ) or 0

    return {
        "pending_requirements": pending_requirements,
        "capital_deployed": capital_deployed,
        "verified_offers": verified_offers,
        "completed_assets": completed_assets
    }
