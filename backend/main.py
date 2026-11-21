from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from database import (
    check_connection,
    donors_collection,
    requests_collection,
    hospitals_collection
)

from routes.donors import router as donors_router
from routes.requests import router as requests_router
from routes.hospitals import router as hospitals_router
from routes.prediction import router as prediction_router
from routes.auth import router as auth_router
from routes.admin import router as admin_router


app = FastAPI(
    title="BLOOD AI",
    description="AI Powered Blood Donation and Emergency Management System",
    version="1.0"
)


# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "https://blood-ai-alpha.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# Register API Routes
app.include_router(donors_router)
app.include_router(requests_router)
app.include_router(hospitals_router)
app.include_router(prediction_router)
app.include_router(auth_router)
app.include_router(admin_router)


# Home API
@app.get("/")
def home():
    return {
        "project": "BLOOD AI",
        "message": "Welcome to BLOOD AI",
        "status": "Running Successfully"
    }


# Database Status
@app.get("/database")
def database_status():
    status = check_connection()

    return {
        "database": "MongoDB",
        "connected": status
    }


# Project Information
@app.get("/project")
def project_info():
    return {
        "project": "BLOOD AI",
        "modules": [
            "Donor Management",
            "Blood Requests",
            "Hospital Management",
            "AI Demand Prediction",
            "Admin Authentication",
            "Hospital Verification",
            "Live Dashboard"
        ],
        "status": "Active"
    }


# Dashboard API
@app.get("/dashboard")
def dashboard():

    try:
        total_donors = donors_collection.count_documents({})
        total_requests = requests_collection.count_documents({})
        total_hospitals = hospitals_collection.count_documents({})

        recent_donors = list(
            donors_collection.find().sort("_id", -1).limit(5)
        )

        recent_requests = list(
            requests_collection.find().sort("_id", -1).limit(5)
        )

        for donor in recent_donors:
            donor["_id"] = str(donor["_id"])
            donor.pop("phone", None)

        for request in recent_requests:
            request["_id"] = str(request["_id"])
            request.pop("contact_number", None)

        return {
            "total_donors": total_donors,
            "total_requests": total_requests,
            "total_hospitals": total_hospitals,
            "recent_donors": recent_donors,
            "recent_requests": recent_requests
        }

    except Exception:
        raise HTTPException(
            status_code=503,
            detail="Dashboard data unavailable"
        )