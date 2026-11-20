import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(
    MONGO_URI,
    serverSelectionTimeoutMS=5000
)

db = client["BloodAI"]

users_collection = db["users"]
donors_collection = db["donors"]
hospitals_collection = db["hospitals"]
requests_collection = db["blood_requests"]


def check_connection():
    try:
        client.admin.command("ping")
        print("MongoDB Connected Successfully!")
        return True

    except Exception as e:
        print("MongoDB Error:", e)
        return False