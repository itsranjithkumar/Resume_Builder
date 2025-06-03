from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import user_routes, resume_routes
from app.routes import google_auth
import uvicorn

app = FastAPI()

from fastapi.staticfiles import StaticFiles
app.mount("/media", StaticFiles(directory="media"), name="media")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://resume-builder-kappa-jet.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_routes.router, prefix="/api/users", tags=["Users"])
app.include_router(resume_routes.router, prefix="/api/resumes", tags=["Resumes"])
app.include_router(google_auth.router, prefix="/api/users", tags=["Users"])

from fastapi import Request, Response

@app.options("/{rest_of_path:path}")
async def global_options_handler(rest_of_path: str, request: Request):
    return Response(status_code=200)

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
