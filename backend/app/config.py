import os
import logging
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional
from dotenv import load_dotenv

# Configure root logger once
logging.basicConfig(
    level=logging.INFO,
    format='[%(levelname)s] %(message)s'
)
logger = logging.getLogger(__name__)

# Explicitly load .env from the backend root directory
backend_root = Path(__file__).resolve().parent.parent
env_path = backend_root / ".env"
load_dotenv(dotenv_path=env_path)

class Settings(BaseSettings):
    PROJECT_NAME: str = "RepoMind AI API"
    API_V1_STR: str = "/api"

    # Gemini Configuration
    GOOGLE_API_KEY: Optional[str] = None
    GEMINI_API_KEY: Optional[str] = None # Backward compatibility
    GEMINI_MODEL: str = "gemini-2.5-flash"

    # Temporary directory for processing
    BASE_TEMP_DIR: str = os.path.join(os.getcwd(), "backend", "app", "temp")

    # Upload limits
    MAX_UPLOAD_SIZE: int = 50 * 1024 * 1024  # 50 MB

    model_config = SettingsConfigDict(
        env_file=str(env_path),
        env_file_encoding="utf-8",
        extra="ignore"
    )

    def get_api_key(self) -> Optional[str]:
        """Prioritizes GOOGLE_API_KEY, then GEMINI_API_KEY."""
        if self.GOOGLE_API_KEY:
            return self.GOOGLE_API_KEY
        if self.GEMINI_API_KEY:
            return self.GEMINI_API_KEY
        return None

settings = Settings()

def log_startup_status():
    """Triggered by main.py to avoid duplicates during reload if possible."""
    if settings.GOOGLE_API_KEY:
        logger.info("Primary GOOGLE_API_KEY detected.")
    elif settings.GEMINI_API_KEY:
        logger.info("Using fallback GEMINI_API_KEY.")
    else:
        logger.warning("No AI API key detected.")
