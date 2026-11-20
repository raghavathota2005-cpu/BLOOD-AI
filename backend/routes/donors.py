from fastapi import APIRouter, HTTPException
from models.donor import Donor
from database import donors_collection
from services.donor_matching import find_matching_donors

router = APIRouter(
    prefix="/donors",
    tags=["Donors"]
)


@router.post("/register")
def register_donor(donor: Donor):

    try:

        donor_data = donor.model_dump()

        result = donors_collection.insert_one(donor_data)

        return {
            "message": "Donor Registered Successfully",
            "donor_id": str(result.inserted_id),
            "status": "Pending Verification"
        }

    except Exception:
        raise HTTPException(
            status_code=503,
            detail="Database unavailable. Please try again."
        )


@router.get("/")
def get_donors():

    try:

        donors = list(donors_collection.find())

        for donor in donors:
            donor["_id"] = str(donor["_id"])

        return donors

    except Exception:
        raise HTTPException(
            status_code=503,
            detail="Unable to retrieve donors"
        )

@router.get("/match")
def match_donors(blood_group: str, location: str):

    donors = find_matching_donors(blood_group, location)

    return {
        "message": "Donor matching completed",
        "total_matches": len(donors),
        "matching_donors": donors
    }