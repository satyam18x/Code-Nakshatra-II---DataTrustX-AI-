from sqlalchemy import Column, Integer, String, Float, Text, DateTime
from datetime import datetime
from app.core.database import Base

class Dataset(Base):
    __tablename__ = "datasets"

    id = Column(Integer, primary_key=True, index=True)
    seller_username = Column(String, index=True)
    title = Column(String)
    description = Column(Text)
    price = Column(Float)
    file_url = Column(String)
    veracity_score = Column(Float, default=99.9)
    created_at = Column(DateTime, default=datetime.utcnow)
