from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app import schemas, crud, database
from app.auth import get_current_user

router = APIRouter()

@router.post("/")
def create_resume(resume: schemas.ResumeCreate, user_id: int = None, db: Session = Depends(database.get_db), current_user=Depends(get_current_user)):
    if user_id is None:
        user_id = current_user.id
    return crud.create_resume(db, resume, user_id)

from fastapi import Query

@router.get("/user/me")
def get_my_resumes(db: Session = Depends(database.get_db), current_user=Depends(get_current_user), offset: int = Query(0, ge=0), limit: int = Query(10, gt=0, le=100)):
    return crud.get_user_resumes(db, current_user.id, offset=offset, limit=limit)

@router.get("/user/{user_id}")
def get_resumes(user_id: int, db: Session = Depends(database.get_db), offset: int = Query(0, ge=0), limit: int = Query(10, gt=0, le=100)):
    return crud.get_user_resumes(db, user_id, offset=offset, limit=limit)

@router.patch("/{resume_id}")
def update_resume(resume_id: int, resume: schemas.ResumeCreate, db: Session = Depends(database.get_db)):
    return crud.update_resume(db, resume_id, resume)

@router.delete("/{resume_id}")
def delete_resume(resume_id: int, db: Session = Depends(database.get_db)):
    return crud.delete_resume(db, resume_id)

from fastapi.responses import FileResponse
import os

@router.get("/{resume_id}/download")
def download_resume_pdf(resume_id: int, db: Session = Depends(database.get_db)):
    pdf_path = crud.generate_resume_pdf(db, resume_id)
    return FileResponse(pdf_path, media_type='application/pdf', filename=os.path.basename(pdf_path))
