from database import donors_collection
import re


def find_matching_donors(blood_group, location):

    blood_group = blood_group.strip()
    location = location.strip()

    donors = list(donors_collection.find({
        "blood_group": {
            "$regex": f"^{re.escape(blood_group)}$",
            "$options": "i"
        },
        "location": {
            "$regex": f"^{re.escape(location)}$",
            "$options": "i"
        },
        "availability_status": "available",
        "consent_to_contact": True
    }))

    matching_donors = []

    for donor in donors:
        matching_donors.append({
            "donor_id": str(donor["_id"]),
            "name": donor["full_name"],
            "blood_group": donor["blood_group"],
            "location": donor["location"],
            "status": "Requires Blood Bank Verification"
        })

    return matching_donors