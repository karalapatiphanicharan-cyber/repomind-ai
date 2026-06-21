import logging
from typing import Optional, Dict, Any, Union
from ..config import settings
from fastapi import HTTPException
from google import genai
from google.genai import types
import asyncio

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

        api_key = settings.get_api_key()
        if api_key:
            logger.info("Gemini API key detected successfully.")
            try:
                # Initialize the new google-genai client
                self.client = genai.Client(api_key=api_key)
                self.model_name = settings.GEMINI_MODEL
                self._initialized = True
                logger.info(f"GeminiClient initialized successfully with model: {self.model_name}")
            except Exception as e:
                logger.error(f"Failed to initialize GeminiClient: {str(e)}")
                self._initialized = False
        else:
            logger.error("Gemini API key missing.")
            self._initialized = False

    async def generate_content(
        self,
        prompt: str,
        config: Optional[Union[Dict[str, Any], types.GenerateContentConfig]] = None,
        retries: int = 3
    ) -> str:
        if not self._initialized:
            raise HTTPException(
                status_code=500,
                detail="Gemini API is not configured. Please provide a valid GEMINI_API_KEY or GOOGLE_API_KEY."
            )

        # Convert dict to types.GenerateContentConfig if needed
        if isinstance(config, dict):
            config = types.GenerateContentConfig(**config)

        last_error = None
        for attempt in range(retries):
            try:
                response = await asyncio.to_thread(
                    self.client.models.generate_content,
                    model=self.model_name,
                    contents=prompt,
                    config=config
                )

                if not response or not response.text:
                    raise ValueError("Empty response from Gemini")

                return response.text

            except Exception as e:
                last_error = e
                error_str = str(e).lower()

                # Immediate failures (no retry)
                if "invalid api key" in error_str or "unauthenticated" in error_str:
                    raise HTTPException(status_code=401, detail="Invalid Gemini API Key.")
                if "not found" in error_str or ("model" in error_str and "not found" in error_str):
                     raise HTTPException(status_code=400, detail=f"Invalid Gemini model: {self.model_name}. Please ensure you have access to this model.")

                # Retryable failures
                if "limit" in error_str or "429" in error_str or "500" in error_str or "503" in error_str:
                    logger.warning(f"Gemini API attempt {attempt + 1} failed: {str(e)}. Retrying...")
                    await asyncio.sleep(2 ** attempt) # Exponential backoff
                    continue

                # Other errors
                logger.error(f"Gemini API Error: {str(e)}")
                raise HTTPException(status_code=500, detail=f"AI Analysis failed: {str(e)}")

        raise HTTPException(status_code=500, detail=f"AI Analysis failed after {retries} attempts: {str(last_error)}")

# Singleton instance
gemini_client = GeminiClient()
