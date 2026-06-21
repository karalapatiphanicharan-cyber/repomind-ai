import json
import logging
from typing import Dict, Any
from ..services.gemini_client import gemini_client
from ..prompts.agent_prompts import DOCUMENTATION_PROMPT

logger = logging.getLogger(__name__)

class DocumentationAgent:
    async def analyze(self, repo_content: str) -> Dict[str, Any]:
        prompt = DOCUMENTATION_PROMPT.format(repo_content=repo_content)

        try:
            response_text = await gemini_client.generate_content(
                prompt,
                config={"response_mime_type": "application/json"}
            )
            if response_text.startswith("```json"):
                response_text = response_text.replace("```json", "").replace("```", "").strip()
            elif "```" in response_text:
                 import re
                 match = re.search(r'```json\s*(.*?)\s*```', response_text, re.DOTALL)
                 if match:
                     response_text = match.group(1)

            return json.loads(response_text)
        except Exception as e:
            logger.error(f"DocumentationAgent error: {str(e)}")
            return {
                "score": 0,
                "assessment": f"Documentation review failed: {str(e)}",
                "missing_sections": ["Information unavailable"],
                "improvements": ["Check Gemini API key permissions."]
            }
