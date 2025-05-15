from sqlalchemy.orm import Session
from . import models, schemas
from passlib.hash import bcrypt

def create_user(db: Session, user: schemas.UserCreate):
    hashed = bcrypt.hash(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate_user(db: Session, email: str, password: str):
    user = db.query(models.User).filter(models.User.email == email).first()
    if user and bcrypt.verify(password, user.hashed_password):
        return user
    return None

def get_user_profile(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def update_user_profile(db: Session, user_id: int, update_data: dict):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        return None
    print(f"[DEBUG] update_data: {update_data}")
    for field, value in update_data.items():
        if hasattr(db_user, field) and value is not None:
            setattr(db_user, field, value)
    db.commit()
    db.refresh(db_user)
    print(f"[DEBUG] db_user after update: full_name={db_user.full_name}, bio={db_user.bio}, phone={db_user.phone}, profile_picture={db_user.profile_picture}")
    return db_user

def upload_profile_picture(db: Session, user_id: int, file_path: str):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        return None
    db_user.profile_picture = file_path
    db.commit()
    db.refresh(db_user)
    return db_user

def create_resume(db: Session, resume: schemas.ResumeCreate, user_id: int):
    data = resume.dict()
    data['user_id'] = user_id
    db_resume = models.Resume(**data)
    db.add(db_resume)
    db.commit()
    db.refresh(db_resume)
    return db_resume

def update_resume(db: Session, resume_id: int, resume: schemas.ResumeCreate):
    db_resume = db.query(models.Resume).filter(models.Resume.resume_id == resume_id).first()
    if not db_resume:
        return None
    for field, value in resume.dict().items():
        setattr(db_resume, field, value)
    db.commit()
    db.refresh(db_resume)
    return db_resume

def get_resume(db: Session, resume_id: int):
    return db.query(models.Resume).filter(models.Resume.resume_id == resume_id).first()

def delete_resume(db: Session, resume_id: int):
    db_resume = db.query(models.Resume).filter(models.Resume.resume_id == resume_id).first()
    if not db_resume:
        return None
    db.delete(db_resume)
    db.commit()
    return {"message": "Resume deleted"}

import os
import tempfile
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

def generate_resume_pdf(db: Session, resume_id: int):
    resume = db.query(models.Resume).filter(models.Resume.resume_id == resume_id).first()
    if not resume:
        return None
    fd, path = tempfile.mkstemp(suffix='.pdf')
    os.close(fd)
    c = canvas.Canvas(path, pagesize=letter)
    y = 750
    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, y, resume.name)
    y -= 30
    c.setFont("Helvetica", 12)
    c.drawString(50, y, f"Summary: {resume.summary}")
    y -= 20
    c.drawString(50, y, f"Skills: {resume.skills}")
    y -= 20
    c.drawString(50, y, f"Experience: {resume.experience}")
    y -= 20
    c.drawString(50, y, f"Education: {resume.education}")
    y -= 20
    c.drawString(50, y, f"Projects: {resume.projects}")
    y -= 20
    c.drawString(50, y, f"Contact: {resume.contact}")
    y -= 30
    if resume.title:
        c.setFont("Helvetica-Bold", 14)
        c.drawString(50, y, resume.title)
        y -= 20
    if resume.content:
        c.setFont("Helvetica", 12)
        c.drawString(50, y, resume.content[:1000])
        y -= 20
    c.save()
    return path

def get_user_resumes(db: Session, user_id: int, offset: int = 0, limit: int = 10):
    return db.query(models.Resume).filter(models.Resume.user_id == user_id).offset(offset).limit(limit).all()

def change_user_password(db: Session, user_id: int, old_password: str, new_password: str):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user and bcrypt.verify(old_password, user.hashed_password):
        user.hashed_password = bcrypt.hash(new_password)
        db.commit()
        db.refresh(user)
        return True
    return False

