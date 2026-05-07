from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_
import json

from app.core.database import SessionLocal
from app.core.dependencies import get_current_user
from app.models.validation import ValidationResult
from app.models.deal import Deal
from app.models.request import DatasetRequest

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

 
@router.get("/")
def get_validation_history(
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Get records where user is either the creator (seller) OR the buyer of the associated deal
    records = (
        db.query(ValidationResult)
        .outerjoin(Deal, ValidationResult.deal_id == Deal.id)
        .filter(
            or_(
                ValidationResult.username == user.username,
                Deal.buyer_username == user.username
            )
        )
        .order_by(ValidationResult.created_at.desc())
        .all()
    )

    # Enrich records with project title
    results = []
    for r in records:
        title = "Manual Upload"
        if r.deal_id:
            deal = db.query(Deal).filter(Deal.id == r.deal_id).first()
            if deal:
                req = db.query(DatasetRequest).filter(DatasetRequest.id == deal.request_id).first()
                if req:
                    title = req.title
        
        results.append({
            "id": r.id,
            "deal_id": r.deal_id,
            "project_title": title,
            "final_score": r.final_score,
            "status": r.status,
            "created_at": r.created_at.isoformat() if r.created_at else None
        })

    return results

@router.get("/report/id/{report_id}")
def get_report_by_id(
    report_id: int,
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    record = db.query(ValidationResult).filter(ValidationResult.id == report_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Report not found")
    
    # Authorization check: Seller (creator), Buyer (of associated deal), or Admin
    is_authorized = (record.username == user.username or user.role == "admin")
    if not is_authorized and record.deal_id:
        deal = db.query(Deal).filter(Deal.id == record.deal_id).first()
        if deal and deal.buyer_username == user.username:
            is_authorized = True

    if not is_authorized:
        raise HTTPException(status_code=403, detail="Not authorized to view this cryptographic trace")

    return {
        "id": record.id,
        "username": record.username,
        "deal_id": record.deal_id,
        "final_score": record.final_score,
        "status": record.status,
        "report": json.loads(record.report_json) if record.report_json else {},
        "created_at": record.created_at
    }

@router.get("/report/deal/{deal_id}")
def get_report_by_deal(
    deal_id: int,
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    record = db.query(ValidationResult).filter(ValidationResult.deal_id == deal_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Report not found for this deal")

    # Authorization check
    deal = db.query(Deal).filter(Deal.id == deal_id).first()
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")

    if deal.buyer_username != user.username and deal.seller_username != user.username and user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to view this report")

    return {
        "id": record.id,
        "username": record.username,
        "deal_id": record.deal_id,
        "final_score": record.final_score,
        "status": record.status,
        "report": json.loads(record.report_json) if record.report_json else {},
        "created_at": record.created_at
    }
