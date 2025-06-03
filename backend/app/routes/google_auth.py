from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from google.oauth2 import id_token
from google.auth.transport import requests
from app import models, database
from sqlalchemy.orm import Session
from app.auth import create_access_token

router = APIRouter()

class GoogleToken(BaseModel):
    token: str

@router.post("/google-login")
async def google_login(data: GoogleToken):
    try:
        print("Received token:", data.token)
        idinfo = id_token.verify_oauth2_token(
            data.token, requests.Request(), "853434167999-0aj5opdatd6i58n6uifanipcchfkunqd.apps.googleusercontent.com"
        )
        print("Decoded idinfo:", idinfo)
        email = idinfo.get("email")
        name = idinfo.get("name")
        if not email:
            print("No email in Google token!")
            raise HTTPException(status_code=400, detail="Google token missing email")
        db = database.get_db()()
        user = db.query(models.User).filter_by(email=email).first()
        if not user:
            user = models.User(email=email, name=name, hashed_password="", role="user")
            db.add(user)
            db.commit()
            db.refresh(user)
        token = create_access_token({"sub": user.email})
        db.close()
        print("Returning access token for:", email)
        return {"access_token": token, "token_type": "bearer"}
    except ValueError as e:
        print("ValueError in google_login:", str(e))
        raise HTTPException(status_code=400, detail="Invalid Google token")
    except Exception as e:
        print("Exception in google_login:", str(e))
        raise HTTPException(status_code=500, detail="Internal server error")
