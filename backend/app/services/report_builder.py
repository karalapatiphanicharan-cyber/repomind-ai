from typing import Dict, Any, List

class ReportBuilder:
    """
    Aggregates results from multiple agents into a single unified engineering report.
    """
    @staticmethod
    def build_final_report(
        project_data: Dict[str, Any],
        code_results: Dict[str, Any],
        security_results: Dict[str, Any],
        docs_results: Dict[str, Any],
        plan_results: Dict[str, Any]
    ) -> Dict[str, Any]:

        # Calculate overall score based on individual agent scores (weighted)
        # Defaults to 0 if not provided
        code_score = code_results.get("score", 0)
        security_score = security_results.get("score", 100) # Assume 100, deduct for findings
        docs_score = docs_results.get("score", 0)
        maintainability_score = code_results.get("maintainability_score", 0)

        # Weighting: Code Quality 40%, Security 30%, Documentation 20%, Maintainability 10%
        overall_score = round(
            (code_score * 0.4) +
            (security_score * 0.3) +
            (docs_score * 0.2) +
            (maintainability_score * 0.1)
        )

        return {
            "project_name": project_data.get("project_name", "Unknown"),
            "overall_score": overall_score,
            "summary": {
                "files_scanned": project_data.get("files_scanned", 0),
                "languages": project_data.get("languages", []),
                "overview": code_results.get("overview", "Analysis complete.")
            },
            "code_analysis": {
                "score": code_score,
                "architecture": code_results.get("architecture", ""),
                "strengths": code_results.get("strengths", []),
                "weaknesses": code_results.get("weaknesses", []),
                "recommendations": code_results.get("recommendations", [])
            },
            "security_review": {
                "score": security_score,
                "findings": security_results.get("findings", []),
                "risk_summary": security_results.get("risk_summary", "")
            },
            "documentation_review": {
                "score": docs_score,
                "assessment": docs_results.get("assessment", ""),
                "missing_sections": docs_results.get("missing_sections", []),
                "improvements": docs_results.get("improvements", [])
            },
            "action_plan": {
                "critical": plan_results.get("critical", []),
                "high": plan_results.get("high", []),
                "medium": plan_results.get("medium", []),
                "low": plan_results.get("low", [])
            },
            "overall_recommendation": plan_results.get("overall_recommendation", "")
        }
