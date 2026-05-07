from sqlalchemy import Column, Integer, String, DateTime, Text
from datetime import datetime
from app.core.database import Base

class DatasetRequest(Base):
    __tablename__ = "dataset_requests"

    id = Column(Integer, primary_key=True, index=True)
    buyer_username = Column(String, index=True)
    title = Column(String)
    description = Column(Text)
    domain = Column(String)
    budget = Column(String)
    request_type = Column(String, default="text") # "text" or "similar"
    reference_dataset_path = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
