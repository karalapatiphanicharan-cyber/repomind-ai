import json
import logging
from typing import Dict, Any
from ..services.gemini_client import gemini_client
from ..prompts.agent_prompts import CODE_ANALYSIS_PROMPT

logger = logging.getLogger(__name__)

class CodeAgent:
    async def analyze(self, repo_content: str) -> Dict[str, Any]:
        prompt = CODE_ANALYSIS_PROMPT.format(repo_content=repo_content)

        try:
            response_text = await gemini_client.generate_content(
                prompt,
                config={"response_mime_type": "application/json"}
            )
            # Remove potential markdown formatting if Gemini includes it despite config
            if response_text.startswith("```json"):
                response_text = response_text.replace("```json", "").replace("```", "").strip()
            elif "```" in response_text:
                 # Robust check for any code block
                 import re
                 match = re.search(r'```json\s*(.*?)\s*```', response_text, re.DOTALL)
                 if match:
                     response_text = match.group(1)

            return json.loads(response_text)
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"CodeAgent error: {str(e)}")
            return {
                "score": 0,
                "maintainability_score": 0,
                "overview": f"Analysis failed: {str(e)}",
                "architecture": "Information unavailable due to analysis failure.",
                "strengths": [],
                "weaknesses": [],
                "recommendations": ["Ensure your Gemini API key is valid and has access to the requested model."]
            }
