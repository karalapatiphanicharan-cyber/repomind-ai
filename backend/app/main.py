from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings, log_startup_status
from .routes import upload, github
import logging

app = FastAPI(title=settings.PROJECT_NAME)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the actual origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(upload.router, prefix=settings.API_V1_STR)
app.include_router(github.router, prefix=settings.API_V1_STR)

@app.on_event("startup")
async def startup_event():
    log_startup_status()

@app.get("/")
async def root():
    return {"message": "RepoMind AI API is running"}
