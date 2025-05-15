from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    full_name: str | None = None
    bio: str | None = None
    phone: str | None = None
    profile_picture: str | None = None

class ProfilePictureUpload(BaseModel):
    profile_picture: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class ChangePassword(BaseModel):
    old_password: str
    new_password: str

class ResumeCreate(BaseModel):
    name: str
    summary: str
    skills: str
    experience: str
    education: str
    projects: str
    achievements: str  # New field
    strengths: str     # New field
    references: str    # New field
    contact: str
    title: str  # Optional: for backward compatibility
    content: str  # Optional: for backward compatibility
    profileImage: str | None = None  # base64 image
class ResumeOut(BaseModel):
    resume_id: int
    name: str
    summary: str
    skills: str
    experience: str
    education: str
    projects: str
    achievements: str  # New field
    strengths: str     # New field
    references: str    # New field
    contact: str
    title: str  # Optional: for backward compatibility
    content: str  # Optional: for backward compatibility
    user_id: int
    profileImage: str | None = None  # base64 image

    class Config:
        orm_mode = True

class UserOut(BaseModel):
    id: int
    email: str
    full_name: str | None = None
    bio: str | None = None
    phone: str | None = None
    profile_picture: str | None = None

    model_config = {
        "from_attributes": True
    }
