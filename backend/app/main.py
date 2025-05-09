from fastapi import FastAPI
from app.routes import user_routes, resume_routes
import uvicorn

app = FastAPI()

app.include_router(user_routes.router, prefix="/api/users", tags=["Users"])
app.include_router(resume_routes.router, prefix="/api/resumes", tags=["Resumes"])

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
