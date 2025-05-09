from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)

alter_statements = [
    "ALTER TABLE resumes ADD COLUMN IF NOT EXISTS achievements TEXT;",
    "ALTER TABLE resumes ADD COLUMN IF NOT EXISTS strengths TEXT;",
    "ALTER TABLE resumes ADD COLUMN IF NOT EXISTS \"references\" TEXT;"
]

with engine.connect() as conn:
    for stmt in alter_statements:
        try:
            conn.execute(text(stmt))
            print(f"Executed: {stmt.strip()}")
        except Exception as e:
            print(f"Error executing '{stmt.strip()}': {e}")
