from fastapi import FastAPI
from app.api import validate
from app.api import auth
from app.core.database import engine
from app.models import user, validation
from app.api import history
from app.models import request
from app.api import requests
from app.models import offer
from app.api import marketplace, offers
from app.models import deal
from app.api import deals
from app.models import escrow
from app.api import payments
from app.api import delivery, confirmation
from app.models import dispute, dataset
from app.api import disputes, admin








app = FastAPI(
    title="DataTrustX",
    version="1.0.0"
)

from fastapi.middleware.cors import CORSMiddleware

# Configure CORS allow all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow ALL origins for debugging
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "DataTrustX backend is running"}

@app.get("/health")
def health():
    return {"status": "OK"}

app.include_router(validate.router, prefix="/data", tags=["Validation"])

app.include_router(auth.router, prefix="/auth", tags=["Auth"])

user.Base.metadata.create_all(bind=engine)
validation.Base.metadata.create_all(bind=engine)

app.include_router(history.router, prefix="/history", tags=["History"])


request.Base.metadata.create_all(bind=engine)

app.include_router(requests.router, prefix="/market", tags=["Marketplace"])

#create tables
offer.Base.metadata.create_all(bind=engine)

deal.Base.metadata.create_all(bind=engine)

escrow.Base.metadata.create_all(bind=engine)

dispute.Base.metadata.create_all(bind=engine)
dataset.Base.metadata.create_all(bind=engine)


#register 
app.include_router(marketplace.router, prefix="/market", tags=["Marketplace"])
app.include_router(offers.router, prefix="/market", tags=["Offers"])

app.include_router(deals.router, prefix="/market", tags=["Deals"])

app.include_router(payments.router, prefix="/market", tags=["Payments"])

app.include_router(delivery.router, prefix="/market", tags=["Delivery"])
app.include_router(confirmation.router, prefix="/market", tags=["Confirmation"])

app.include_router(disputes.router, prefix="/market", tags=["Disputes"])
app.include_router(admin.router, prefix="/admin", tags=["Admin"])





# uvicorn app.main:app --host 127.0.0.1 --port 8000
# uvicorn app.main:app --reload
