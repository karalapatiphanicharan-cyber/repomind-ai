import asyncio
import logging
from typing import Dict, Any
from .code_agent import CodeAgent
from .security_agent import SecurityAgent
from .documentation_agent import DocumentationAgent
from .planner_agent import PlannerAgent
from ..services.report_builder import ReportBuilder
from ..services.chunker import Chunker

logger = logging.getLogger(__name__)

class Orchestrator:
    def __init__(self):
        self.code_agent = CodeAgent()
        self.security_agent = SecurityAgent()
        self.documentation_agent = DocumentationAgent()
        self.planner_agent = PlannerAgent()
        self.chunker = Chunker()
        self.report_builder = ReportBuilder()

    async def analyze_project(self, project_data: Dict[str, Any], root_dir: str) -> Dict[str, Any]:
        """
        Coordinates the entire AI analysis pipeline.
        """
        logger.info(f"Starting AI analysis for project: {project_data.get('project_name')}")

        try:
            # 1. Read and chunk repository content
            repo_text = self.chunker.get_repo_content(root_dir)
            # For Phase 3, we take the first 30k chars as a simplified 'summary'
            # if the repo is very large, or we could summarize chunks.
            # Here we prioritize the most relevant context.
            context = repo_text[:30000]

            # 2. Run analysis agents in parallel
            logger.info("Invoking analysis agents...")
            code_task = self.code_agent.analyze(context)
            security_task = self.security_agent.analyze(context)
            docs_task = self.documentation_agent.analyze(context)

            code_results, security_results, docs_results = await asyncio.gather(
                code_task, security_task, docs_task
            )

            # 3. Generate prioritized action plan
            logger.info("Invoking planner agent...")
            plan_results = await self.planner_agent.generate_plan(
                code_results, security_results, docs_results
            )

            # 4. Aggregate results into final report
            logger.info("Building final report...")
            final_report = self.report_builder.build_final_report(
                project_data,
                code_results,
                security_results,
                docs_results,
                plan_results
            )

            return final_report

        except Exception as e:
            logger.error(f"Orchestrator error: {str(e)}")
            raise
