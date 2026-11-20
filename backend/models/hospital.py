from pydantic import BaseModel, Field


class Hospital(BaseModel):

    hospital_name: str = Field(min_length=2)
    address: str
    city: str
    phone: str = Field(min_length=10, max_length=15)
    email: str
    available_blood_groups: list[str] = []
    verification_status: str = "pending"