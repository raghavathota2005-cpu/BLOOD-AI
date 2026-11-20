from pydantic import BaseModel, Field
from typing import Optional, Literal


class Donor(BaseModel):

    full_name: str = Field(min_length=2, max_length=100)
    age: int = Field(ge=1, le=120)

    blood_group: Literal[
        "A+", "A-", "B+", "B-",
        "AB+", "AB-", "O+", "O-"
    ]

    phone: str = Field(min_length=10, max_length=15)

    location: str

    last_donation_date: Optional[str] = None

    availability_status: Literal[
        "available", "unavailable"
    ] = "available"

    consent_to_contact: bool = False