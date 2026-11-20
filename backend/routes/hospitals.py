from fastapi import APIRouter, HTTPException
from models.hospital import Hospital
from database import hospitals_collection

router = APIRouter(
    prefix="/hospitals",
    tags=["Hospitals"]
)


@router.post("/register")
def register_hospital(hospital: Hospital):

    try:
        hospital_data = hospital.model_dump()

        result = hospitals_collection.insert_one(hospital_data)

        return {
            "message": "Hospital Registered Successfully",
            "hospital_id": str(result.inserted_id),
            "status": "Pending Verification"
        }

    except Exception:
        raise HTTPException(
            status_code=503,
            detail="Database unavailable"
        )


@router.get("/")
def get_hospitals():

    try:
        hospitals = list(hospitals_collection.find())

        for hospital in hospitals:
            hospital["_id"] = str(hospital["_id"])

        return hospitals

    except Exception:
        raise HTTPException(
            status_code=503,
            detail="Unable to retrieve hospitals"
        )