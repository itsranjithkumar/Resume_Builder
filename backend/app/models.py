from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String, nullable=True)
    bio = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    profile_picture = Column(String, nullable=True)  # stores file path or URL

    resumes = relationship("Resume", back_populates="owner")


class Resume(Base):
    __tablename__ = "resumes"

    resume_id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    summary = Column(Text)
    skills = Column(Text)
    experience = Column(Text)
    education = Column(Text)
    projects = Column(Text)
    achievements = Column(Text)  # New field
    strengths = Column(Text)     # New field
    references = Column(Text)    # New field
    contact = Column(String)
    title = Column(String)  # Optional: for backward compatibility
    content = Column(Text)  # Optional: for backward compatibility
    user_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="resumes")
