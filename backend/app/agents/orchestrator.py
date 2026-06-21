import asyncio
import logging
import json
import re
from typing import Dict, Any, Optional
from ..services.report_builder import ReportBuilder
from ..services.chunker import Chunker
from ..services.gemini_client import gemini_client
from fastapi import HTTPException

logger = logging.getLogger(__name__)

# Master Prompt for generating the entire report in ONE call
MASTER_ANALYSIS_PROMPT = """
You are a senior full-stack engineer and security architect. Analyze the provided technical context of a software repository.
Provide a comprehensive, production-grade engineering report including architecture, security, documentation, and a prioritized action plan.

Technical Context:
{context}

Respond strictly with a valid JSON object following this schema:
{{
  "code_analysis": {{
    "score": 0-100,
    "architecture": "string summary",
    "strengths": ["list"],
    "weaknesses": ["list"],
    "recommendations": ["list"]
  }},
  "security_review": {{
    "score": 0-100,
    "risk_summary": "string summary",
    "findings": [
      {{ "issue": "string", "severity": "Critical|High|Medium|Low", "fix": "string" }}
    ]
  }},
  "documentation_review": {{
    "score": 0-100,
    "assessment": "string summary",
    "missing_sections": ["list"],
    "improvements": ["list"]
  }},
  "action_plan": {{
    "critical": ["list"],
    "high": ["list"],
    "medium": ["list"],
    "low": ["list"]
  }},
  "strategic_roadmap": {
    "next_steps": "string",
    "business_impact": "string"
  },
  "overall_recommendation": "string",
  "maintainability_score": 0-100,
  "overview": "string"
}}
"""

class Orchestrator:
    def __init__(self):
        self.chunker = Chunker()
        self.report_builder = ReportBuilder()
        self._session_cache: Dict[str, Any] = {}

    async def analyze_project(self, project_data: Dict[str, Any], root_dir: str) -> Dict[str, Any]:
        """
        Coordinates the entire AI analysis pipeline using ONE single Gemini call.
        """
        project_name = project_data.get('project_name', 'Unknown')
        logger.info(f"Starting optimized AI analysis for project: {project_name}")

        # Check cache if retry is triggered with same session ID
        cache_key = f"{project_name}_{root_dir}"
        if cache_key in self._session_cache:
            logger.info("Returning cached AI analysis results.")
            return self._session_cache[cache_key]

        try:
            # 1. Local Preprocessing & Context Preparation
            context = await self.chunker.summarize_repo(root_dir)

            # 2. Single Gemini Execution for overall report
            logger.info("Invoking Gemini for unified engineering report...")
            prompt = MASTER_ANALYSIS_PROMPT.format(context=context)

            try:
                response_text = await gemini_client.generate_content(
                    prompt,
                    config={"response_mime_type": "application/json"}
                )

                # Robust JSON extraction
                if response_text.startswith("```json"):
                    response_text = response_text.replace("```json", "").replace("```", "").strip()
                elif "```" in response_text:
                     match = re.search(r'```json\s*(.*?)\s*```', response_text, re.DOTALL)
                     if match:
                         response_text = match.group(1)

                full_results = json.loads(response_text)
            except HTTPException as e:
                logger.error(f"AI analysis failed: {e.detail}")
                raise
            except Exception as e:
                logger.error(f"Failed to parse AI response: {str(e)}")
                raise HTTPException(status_code=500, detail="The AI service returned a malformed response.")

            # 3. Aggregate results into final report format
            logger.info("Finalizing report structure...")
            final_report = self.report_builder.build_final_report(
                project_data,
                full_results.get("code_analysis", {}),
                full_results.get("security_review", {}),
                full_results.get("documentation_review", {}),
                full_results.get("action_plan", {}),
                full_results.get("strategic_roadmap", {})
            )

            # Inject master overview if available
            if "overview" in full_results:
                final_report["summary"]["overview"] = full_results["overview"]
            if "overall_recommendation" in full_results:
                final_report["overall_recommendation"] = full_results["overall_recommendation"]

            # Store in session cache
            self._session_cache[cache_key] = final_report
            return final_report

        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Orchestrator unexpected error: {str(e)}")
            raise HTTPException(status_code=500, detail="An unexpected error occurred during project coordination.")
