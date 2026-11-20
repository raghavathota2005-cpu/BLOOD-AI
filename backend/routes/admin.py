from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from dotenv import load_dotenv
from datetime import datetime, timezone
import os

from database import (
    donors_collection,
    requests_collection,
    hospitals_collection
)

load_dotenv()

router = APIRouter(prefix="/admin", tags=["Admin"])

security = HTTPBearer()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"


# Verify Admin Token
def verify_admin(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    if not SECRET_KEY:
        raise HTTPException(
            status_code=503,
            detail="Secret key is not configured"
        )

    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        if payload.get("role") != "admin":
            raise HTTPException(
                status_code=403,
                detail="Admin access required"
            )

        return payload

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )


# Admin Dashboard
@router.get("/dashboard")
def admin_dashboard(admin=Depends(verify_admin)):
    try:
        hospitals = list(
            hospitals_collection.find().sort("_id", -1)
        )

        for hospital in hospitals:
            hospital["_id"] = str(hospital["_id"])
            hospital.pop("phone", None)

        return {
            "message": "Admin Dashboard Loaded Successfully",
            "total_donors": donors_collection.count_documents({}),
            "total_requests": requests_collection.count_documents({}),
            "total_hospitals": hospitals_collection.count_documents({}),
            "hospitals": hospitals
        }

    except Exception:
        raise HTTPException(
            status_code=503,
            detail="Admin dashboard unavailable"
        )


# View Pending Hospitals
@router.get("/hospitals/pending")
def pending_hospitals(admin=Depends(verify_admin)):
    hospitals = list(
        hospitals_collection.find({
            "verification_status": "pending"
        })
    )

    for hospital in hospitals:
        hospital["_id"] = str(hospital["_id"])
        hospital.pop("phone", None)

    return hospitals


# Verify Hospital
@router.put("/hospitals/{hospital_id}/verify")
def verify_hospital(
    hospital_id: str,
    admin=Depends(verify_admin)
):
    from bson import ObjectId
    from bson.errors import InvalidId

    try:
        object_id = ObjectId(hospital_id)

    except InvalidId:
        raise HTTPException(
            status_code=400,
            detail="Invalid hospital ID"
        )

    result = hospitals_collection.update_one(
        {
            "_id": object_id,
            "verification_status": "pending"
        },
        {
            "$set": {
                "verification_status": "verified"
            }
        }
    )

    if result.modified_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Pending hospital not found"
        )

    return {
        "message": "Hospital verified successfully"
    }


# Reject Hospital
@router.put("/hospitals/{hospital_id}/reject")
def reject_hospital(
    hospital_id: str,
    admin=Depends(verify_admin)
):
    from bson import ObjectId
    from bson.errors import InvalidId

    try:
        object_id = ObjectId(hospital_id)

    except InvalidId:
        raise HTTPException(
            status_code=400,
            detail="Invalid hospital ID"
        )

    result = hospitals_collection.update_one(
        {
            "_id": object_id,
            "verification_status": "pending"
        },
        {
            "$set": {
                "verification_status": "rejected"
            }
        }
    )

    if result.modified_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Pending hospital not found"
        )

    return {
        "message": "Hospital rejected successfully"
    }