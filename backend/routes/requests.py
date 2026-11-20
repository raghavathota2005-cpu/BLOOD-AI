from fastapi import APIRouter, HTTPException
from models.blood_request import BloodRequest
from database import requests_collection
from datetime import datetime, timezone

router = APIRouter(
    prefix="/requests",
    tags=["Blood Requests"]
)


# Create Blood Request
@router.post("/create")
def create_request(request: BloodRequest):

    try:
        request_data = request.model_dump()

        request_data["created_at"] = datetime.now(timezone.utc)

        result = requests_collection.insert_one(request_data)

        return {
            "message": "Blood Request Created Successfully",
            "request_id": str(result.inserted_id),
            "status": request.status,
            "created_at": request_data["created_at"].isoformat()
        }

    except Exception as e:
        raise HTTPException(
            status_code=503,
            detail="Database unavailable"
        )


# Get All Blood Requests
@router.get("/")
def get_requests():

    try:
        requests = list(requests_collection.find())

        for request in requests:
            request["_id"] = str(request["_id"])

            if "created_at" in request:
                request["created_at"] = request["created_at"].isoformat()

        return requests

    except Exception:
        raise HTTPException(
            status_code=503,
            detail="Unable to retrieve requests"
        )