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
            try:
                # Initialize the new google-genai client
                self.client = genai.Client(api_key=api_key)
                self.model_name = settings.GEMINI_MODEL
                self._initialized = True
                self.quota_exhausted = False # Circuit breaker
                logger.info(f"GeminiClient initialized successfully with model: {self.model_name}")
            except Exception as e:
                logger.error(f"Failed to initialize GeminiClient: {str(e)}")
                self._initialized = False
        else:
            logger.error("Gemini API key missing.")
            self._initialized = False

    def _map_error(self, error_str: str) -> str:
        """Maps technical Gemini errors to user-friendly messages."""
        if "invalid api key" in error_str or "unauthenticated" in error_str:
            return "The configured AI API key appears to be invalid."
        if "not found" in error_str and "model" in error_str:
            return f"The AI model '{self.model_name}' is currently unavailable."
        if "limit" in error_str or "429" in error_str:
            self.quota_exhausted = True
            return "AI analysis quota has been temporarily exhausted. Please try again later."
        if "503" in error_str or "unavailable" in error_str or "overloaded" in error_str:
            return "The AI service is currently experiencing high demand. Please retry shortly."
        if "timeout" in error_str or "408" in error_str:
            return "AI analysis timed out. The repository might be too large or the service is slow."
        if "network" in error_str or "connection" in error_str:
            return "Unable to reach the AI service. Please check your connection and try again."

        return "An unexpected AI service error occurred during analysis."

    async def generate_content(
        self,
        prompt: str,
        config: Optional[Union[Dict[str, Any], types.GenerateContentConfig]] = None,
        retries: int = 1 # Max 1 retry for transient failures
    ) -> str:
        if not self._initialized:
            raise HTTPException(
                status_code=500,
                detail="The configured AI API key appears to be invalid or missing."
            )

        if self.quota_exhausted:
            raise HTTPException(
                status_code=429,
                detail="AI analysis quota has been exhausted. Please retry later."
            )

        # Convert dict to types.GenerateContentConfig if needed
        if isinstance(config, dict):
            config = types.GenerateContentConfig(**config)

        last_error = None
        for attempt in range(retries + 1):
            try:
                response = await asyncio.to_thread(
                    self.client.models.generate_content,
                    model=self.model_name,
                    contents=prompt,
                    config=config
                )

                if not response or not response.text:
                    raise ValueError("Empty response from Gemini")

                # Reset circuit breaker on success
                self.quota_exhausted = False
                return response.text

            except Exception as e:
                last_error = e
                error_str = str(e).lower()

                # Quota errors: NO RETRIES, set circuit breaker
                if "limit" in error_str or "429" in error_str:
                    self.quota_exhausted = True
                    friendly_msg = self._map_error(error_str)
                    raise HTTPException(status_code=429, detail=friendly_msg)

                # Transient failures: Retry if attempts remain
                if any(err in error_str for err in ["500", "503", "unavailable", "timeout"]):
                    if attempt < retries:
                        logger.warning(f"Gemini API attempt {attempt + 1} failed: {str(e)}. Retrying...")
                        await asyncio.sleep(2 ** attempt)
                        continue

                # Non-retryable or exhausted retries
                friendly_msg = self._map_error(error_str)
                logger.error(f"Gemini API Error: {str(e)}")
                raise HTTPException(status_code=500, detail=friendly_msg)

        friendly_msg = self._map_error(str(last_error))
        raise HTTPException(status_code=500, detail=friendly_msg)

# Singleton instance
gemini_client = GeminiClient()
