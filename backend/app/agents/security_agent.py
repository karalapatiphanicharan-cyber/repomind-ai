import json
import logging
from typing import Dict, Any
from ..services.gemini_client import gemini_client
from ..prompts.agent_prompts import SECURITY_REVIEW_PROMPT

logger = logging.getLogger(__name__)

class SecurityAgent:
    async def analyze(self, repo_content: str) -> Dict[str, Any]:
        prompt = SECURITY_REVIEW_PROMPT.format(repo_content=repo_content)

        try:
            response_text = await gemini_client.generate_content(
                prompt,
                generation_config={"response_mime_type": "application/json"}
            )
            if response_text.startswith("```json"):
                response_text = response_text.replace("```json", "").replace("```", "").strip()

            return json.loads(response_text)
        except Exception as e:
            logger.error(f"SecurityAgent error: {str(e)}")
            return {
                "score": 100,
                "risk_summary": "Failed to perform security review.",
                "findings": []
            }
