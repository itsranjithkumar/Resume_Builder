from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from sqlalchemy.orm import Session
from app import schemas, crud, database, auth
import shutil
import os

router = APIRouter()

from fastapi import Request
from app.auth import get_current_user

@router.get("/validate-token")
def validate_token(current_user=Depends(get_current_user)):
    return {"valid": True}

@router.post("/register")
def register(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    db_user = crud.create_user(db, user)
    return {"message": "User registered", "user": db_user.email}

@router.get("/{user_id}/profile", response_model=schemas.UserOut)
def get_profile(user_id: int, db: Session = Depends(database.get_db)):
    user = crud.get_user_profile(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

from app.auth import get_current_user

import traceback
from app import models

@router.get("/{user_id}/profile")
def get_profile(user_id: int, db: Session = Depends(database.get_db)):
    user = crud.get_user_profile(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "id": user.id,
        "email": user.email,
        "full_name": getattr(user, "full_name", None),
        "bio": getattr(user, "bio", None),
        "phone": getattr(user, "phone", None),
        "profile_picture": getattr(user, "profile_picture", None)
    }

@router.get("/email/{email}")
def get_user_by_email(email: str, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "id": user.id,
        "email": user.email,
        "full_name": getattr(user, "full_name", None),
        "bio": getattr(user, "bio", None),
        "phone": getattr(user, "phone", None),
        "profile_picture": getattr(user, "profile_picture", None)
    }

@router.patch("/{user_id}/profile", response_model=schemas.UserOut)
def update_profile(user_id: int, profile: schemas.UserUpdate, db: Session = Depends(database.get_db), current_user=Depends(get_current_user)):
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to update this profile")
    user = crud.update_user_profile(db, user_id, profile.dict(exclude_unset=True))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/{user_id}/change-password")
def change_password(user_id: int, passwords: schemas.ChangePassword, db: Session = Depends(database.get_db), current_user=Depends(get_current_user)):
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to change this password")
    success = crud.change_user_password(db, user_id, passwords.old_password, passwords.new_password)
    if not success:
        raise HTTPException(status_code=400, detail="Old password is incorrect")
    return {"message": "Password changed successfully"}

@router.post("/{user_id}/upload-profile-picture", response_model=schemas.ProfilePictureUpload)
def upload_profile_picture(user_id: int, file: UploadFile = File(...), db: Session = Depends(database.get_db), current_user=Depends(get_current_user)):
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to upload for this profile")
    upload_dir = "media/profile_pics"
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, f"user_{user_id}_{file.filename}")
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    user = crud.upload_profile_picture(db, user_id, file_path)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"profile_picture": file_path}

@router.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(database.get_db)):
    db_user = crud.authenticate_user(db, user.email, user.password)
    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    token = auth.create_access_token({"sub": db_user.email})
    return {"access_token": token, "token_type": "bearer"}
