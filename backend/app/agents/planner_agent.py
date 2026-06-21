import json
import logging
from typing import Dict, Any
from ..services.gemini_client import gemini_client
from ..prompts.agent_prompts import PLANNER_PROMPT
from fastapi import HTTPException

logger = logging.getLogger(__name__)

class PlannerAgent:
    async def generate_plan(
        self,
        code_results: Dict[str, Any],
        security_results: Dict[str, Any],
        docs_results: Dict[str, Any]
    ) -> Dict[str, Any]:

        prompt = PLANNER_PROMPT.format(
            code_results=json.dumps(code_results),
            security_results=json.dumps(security_results),
            docs_results=json.dumps(docs_results)
        )

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
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"PlannerAgent error: {str(e)}")
            return {
                "critical": [f"Repair AI Analysis Pipeline: {str(e)}"],
                "high": [],
                "medium": [],
                "low": [],
                "overall_recommendation": "The action plan could not be generated because the AI agent encountered an error."
            }
