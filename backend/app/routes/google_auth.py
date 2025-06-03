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
        name = idinfo.get("name") or ""
        if not email:
            print("No email in Google token!")
            raise HTTPException(status_code=400, detail="Google token missing email")
        db_gen = database.get_db()
        db = next(db_gen)
        user = db.query(models.User).filter_by(email=email).first()
        if not user:
            user = models.User(email=email, full_name=name, hashed_password="", role="user")
            db.add(user)
            db.commit()
            db.refresh(user)
            print(f"Created new user: {email}")
        else:
            print(f"User exists: {email}")
        token = create_access_token({"sub": user.email})
        print("Returning access token for:", email)
        db_gen.close()
        return {"access_token": token, "token_type": "bearer"}
    except ValueError as e:
        print("ValueError in google_login:", str(e))
        raise HTTPException(status_code=400, detail=f"Invalid Google token: {str(e)}")
    except Exception as e:
        import traceback
        print("Exception in google_login:", str(e))
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
