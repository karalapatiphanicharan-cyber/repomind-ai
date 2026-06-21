import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "RepoMind AI API"
    API_V1_STR: str = "/api"

    # Temporary directory for processing
    BASE_TEMP_DIR: str = os.path.join(os.getcwd(), "backend", "app", "temp")

    # Upload limits
    MAX_UPLOAD_SIZE: int = 50 * 1024 * 1024  # 50 MB

    class Config:
        case_sensitive = True

settings = Settings()
