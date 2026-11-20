from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from jose import jwt
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv
import os
import hashlib
import hmac

load_dotenv()

router = APIRouter(prefix="/admin", tags=["Admin Authentication"])

SECRET_KEY = os.getenv("SECRET_KEY")
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME")
ADMIN_PASSWORD_HASH = os.getenv("ADMIN_PASSWORD_HASH")

ALGORITHM = "HS256"


class AdminLogin(BaseModel):
    username: str
    password: str


def verify_password(password, stored_hash):
    generated_hash = hashlib.sha256(password.encode()).hexdigest()
    return hmac.compare_digest(generated_hash, stored_hash)


@router.post("/login")
def admin_login(data: AdminLogin):

    if not SECRET_KEY or not ADMIN_USERNAME or not ADMIN_PASSWORD_HASH:
        raise HTTPException(
            status_code=503,
            detail="Admin authentication is not configured"
        )

    if data.username != ADMIN_USERNAME:
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

    if not verify_password(data.password, ADMIN_PASSWORD_HASH):
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

    expire = datetime.now(timezone.utc) + timedelta(minutes=30)

    token = jwt.encode(
        {
            "sub": ADMIN_USERNAME,
            "role": "admin",
            "exp": expire
        },
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return {
        "message": "Admin login successful",
        "access_token": token,
        "token_type": "bearer"
    }