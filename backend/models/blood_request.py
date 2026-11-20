from pydantic import BaseModel, Field
from typing import Literal


class BloodRequest(BaseModel):

    patient_name: str = Field(min_length=2, max_length=100)

    blood_group: Literal[
        "A+", "A-", "B+", "B-",
        "AB+", "AB-", "O+", "O-"
    ]

    units_required: int = Field(ge=1, le=20)

    hospital_name: str

    location: str

    contact_number: str = Field(min_length=10, max_length=15)

    priority: Literal[
        "normal", "urgent", "emergency"
    ] = "normal"

    status: Literal[
        "pending", "processing", "fulfilled", "cancelled"
    ] = "pending"