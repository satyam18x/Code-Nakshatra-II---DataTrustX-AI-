from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional

from app.core.dependencies import get_current_user, get_db
from app.models.request import DatasetRequest
from app.models.dataset import Dataset
from app.models.deal import Deal
from app.models.offer import DatasetOffer
from sqlalchemy import func

router = APIRouter()

class DatasetCreate(BaseModel):
    title: str
    description: str
    price: float
    file_url: Optional[str] = "mock_url_placeholder"

@router.get("/broadcasts")
def list_broadcasts(
    db: Session = Depends(get_db)
):
    requests = db.query(DatasetRequest).order_by(DatasetRequest.created_at.desc()).all()
    print(f"DEBUG: list_broadcasts found {len(requests)} requests")
    
    return [
        {
            "id": r.id,
            "title": r.title,
            "description": r.description,
            "domain": r.domain,
            "budget": r.budget,
            "request_type": r.request_type,
            "created_at": r.created_at
        }
        for r in requests
    ]

@router.get("/datasets")
def list_datasets(
    db: Session = Depends(get_db)
):
    datasets = db.query(Dataset).order_by(Dataset.created_at.desc()).all()
    return datasets

@router.post("/datasets")
def create_dataset(
    data: DatasetCreate,
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if user.role != "seller":
        raise HTTPException(status_code=403, detail="Only sellers can initialize assets")
    
    dataset = Dataset(
        seller_username=user.username,
        title=data.title,
        description=data.description,
        price=data.price,
        file_url=data.file_url
    )
    db.add(dataset)
    db.commit()
    db.refresh(dataset)
    return dataset

@router.post("/request_dataset/{dataset_id}")
def request_dataset(
    dataset_id: int,
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if user.role != "buyer":
        raise HTTPException(status_code=403, detail="Only buyers can acquire datasets")
    
    dataset = db.query(Dataset).filter(Dataset.id == dataset_id).first()
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
    
    # Create a deal (Escrow initialization)
    deal = Deal(
        buyer_username=user.username,
        seller_username=dataset.seller_username,
        price=dataset.price,
        payment_status="pending",
        delivery_status="pending"
    )
    db.add(deal)
    db.commit()
    db.refresh(deal)
    return deal

@router.get("/seller_stats")
def get_seller_stats(
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if user.role != "seller":
        raise HTTPException(status_code=403, detail="Only sellers can view stats")
    
    my_datasets_count = db.query(Dataset).filter(Dataset.seller_username == user.username).count()
    active_deals = db.query(Deal).filter(Deal.seller_username == user.username, Deal.payment_status != "released").count()
    
    return {
        "total_revenue": 12480, # Mocked for now
        "neural_audits": 8,
        "node_veracity": "98.5%",
        "active_deals": active_deals,
        "my_datasets_count": my_datasets_count
    }

@router.get("/buyer_stats")
def get_buyer_stats(
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if user.role != "buyer":
        raise HTTPException(status_code=403, detail="Only buyers can view stats")
    
    completed_assets = db.query(Deal).filter(Deal.buyer_username == user.username, Deal.delivery_status == "delivered").count()
    pending_requirements = db.query(DatasetRequest).filter(DatasetRequest.buyer_username == user.username).count()
    
    # Sum of prices of deals where payment_status is 'escrowed' or 'released'
    capital_deployed = db.query(func.sum(Deal.price)).filter(
        Deal.buyer_username == user.username,
        Deal.payment_status.in_(["escrowed", "released"])
    ).scalar() or 0
    
    # Verified offers: count of DatasetOffer for requests made by this buyer
    buyer_request_ids = db.query(DatasetRequest.id).filter(DatasetRequest.buyer_username == user.username).all()
    request_ids = [r.id for r in buyer_request_ids]
    verified_offers = db.query(DatasetOffer).filter(DatasetOffer.request_id.in_(request_ids)).count() if request_ids else 0
    
    return {
        "completed_assets": completed_assets,
        "verified_offers": verified_offers,
        "capital_deployed": float(capital_deployed),
        "pending_requirements": pending_requirements
    }
