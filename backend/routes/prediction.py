from fastapi import APIRouter, HTTPException
from services.demand_prediction import predict_demand

router = APIRouter(
    prefix="/prediction",
    tags=["AI Demand Prediction"]
)

@router.get("/demand")
def demand_prediction(blood_group: str, day: int):

    supported_groups = [
        "A+", "A-",
        "B+", "B-",
        "AB+", "AB-",
        "O+", "O-"
    ]

    blood_group = blood_group.strip().upper()

    if blood_group not in supported_groups:
        raise HTTPException(
            status_code=400,
            detail="Supported blood groups: A+, A-, B+, B-, AB+, AB-, O+, O-"
        )

    if day < 1 or day > 365:
        raise HTTPException(
            status_code=400,
            detail="Day must be between 1 and 365"
        )

    try:
        result = predict_demand(blood_group, day)

        if not isinstance(result, dict) or "error" in result:
            raise HTTPException(
                status_code=404,
                detail=result.get("error", "Prediction unavailable")
                if isinstance(result, dict)
                else "Prediction unavailable"
            )

        return {
            "message": "Blood Demand Prediction Successful",
            "prediction": result
        }

    except HTTPException:
        raise

    except Exception:
        raise HTTPException(
            status_code=503,
            detail="Prediction service temporarily unavailable"
        )