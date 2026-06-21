import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "RepoMind AI API"
    API_V1_STR: str = "/api"

    # Gemini Configuration
    GEMINI_API_KEY: Optional[str] = None
    GOOGLE_API_KEY: Optional[str] = None
    GEMINI_MODEL: str = "gemini-2.5-flash"

    # Temporary directory for processing
    BASE_TEMP_DIR: str = os.path.join(os.getcwd(), "backend", "app", "temp")

    # Upload limits
    MAX_UPLOAD_SIZE: int = 50 * 1024 * 1024  # 50 MB

    model_config = SettingsConfigDict(
        env_file="backend/.env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    def get_api_key(self) -> Optional[str]:
        """Prioritizes GEMINI_API_KEY, then GOOGLE_API_KEY."""
        return self.GEMINI_API_KEY or self.GOOGLE_API_KEY

settings = Settings()
