import google.generativeai as genai
import logging
from typing import Optional, Dict, Any
from ..config import settings
from fastapi import HTTPException

logger = logging.getLogger(__name__)

class GeminiClient:
    _instance: Optional['GeminiClient'] = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(GeminiClient, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if self._initialized:
            return

        if not settings.GEMINI_API_KEY:
            logger.warning("GEMINI_API_KEY is not set. AI analysis will fail.")

        try:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            self.model_name = settings.GEMINI_MODEL
            self.model = genai.GenerativeModel(self.model_name)
            self._initialized = True
            logger.info(f"GeminiClient initialized with model: {self.model_name}")
        except Exception as e:
            logger.error(f"Failed to initialize GeminiClient: {str(e)}")
            self._initialized = False

    async def generate_content(self, prompt: str, generation_config: Optional[Dict[str, Any]] = None) -> str:
        if not self._initialized:
            raise HTTPException(
                status_code=500,
                detail="Gemini API is not configured. Please check your GEMINI_API_KEY."
            )

        try:
            # Default config to enforce JSON if needed, but agents will handle their own configs
            response = await self.model.generate_content_async(
                prompt,
                generation_config=generation_config
            )

            if not response or not response.text:
                raise ValueError("Empty response from Gemini")

            return response.text
        except Exception as e:
            error_str = str(e).lower()
            if "api_key_invalid" in error_str or "invalid api key" in error_str:
                raise HTTPException(status_code=401, detail="Invalid Gemini API Key.")
            if "model_not_found" in error_str or "not found" in error_str:
                 raise HTTPException(status_code=400, detail=f"Invalid Gemini model: {self.model_name}")
            if "limit" in error_str:
                raise HTTPException(status_code=429, detail="Gemini API rate limit exceeded.")

            logger.error(f"Gemini API Error: {str(e)}")
            raise HTTPException(status_code=500, detail=f"AI Analysis failed: {str(e)}")

# Singleton instance
gemini_client = GeminiClient()
