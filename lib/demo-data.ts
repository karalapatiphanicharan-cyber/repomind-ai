import { AnalysisSummary } from '@/types/analysis';

export const DEMO_REPORT: AnalysisSummary = {
  success: true,
  project_name: "EcoTrack-Backend-API",
  files_scanned: 42,
  total_supported_files: 42,
  languages: ["TypeScript", "Node.js", "Docker", "PostgreSQL"],
  detected_files: {
    readme: true,
    package_json: true,
    requirements_txt: false,
    pom_xml: false,
    dockerfile: true
  },
  top_level_directories: ["src", "tests", "config", "scripts"],
  ai_report: {
    project_name: "EcoTrack-Backend-API",
    overall_score: 84,
    summary: {
      files_scanned: 42,
      languages: ["TypeScript", "Node.js"],
      overview: "EcoTrack-Backend-API is a robust, well-structured Node.js application built with TypeScript. It serves as the primary backend for environmental monitoring, featuring a clean architecture with clear separation of concerns. The codebase demonstrates high quality standards, though there are opportunities for security hardening and documentation completeness."
    },
    code_analysis: {
      score: 88,
      architecture: "The project follows a modular layered architecture (Controller-Service-Repository pattern). It leverages dependency injection for better testability and uses TypeORM for database interactions. The structure is highly scalable and follows SOLID principles.",
      strengths: [
        "Strong TypeScript typing across the entire codebase",
        "Consistent use of the Repository pattern for data access",
        "Excellent error handling middleware implementation",
        "Comprehensive unit test coverage in the /tests directory"
      ],
      weaknesses: [
        "Some circular dependencies detected in utility modules",
        "Over-reliance on 'any' type in legacy migration scripts",
        "Large controller files that could be further decomposed"
      ],
      recommendations: [
        "Implement a stricter ESLint rule to forbid 'any' types",
        "Refactor the AnalyticsController into smaller, domain-specific controllers",
        "Use absolute path imports to improve code readability"
      ]
    },
    security_review: {
      score: 76,
      findings: [
        {
          issue: "Missing Rate Limiting on Public API Endpoints",
          severity: "High",
          fix: "Implement express-rate-limit or a similar middleware on all public-facing routes."
        },
        {
          issue: "Sensitive Information in Logger",
          severity: "Medium",
          fix: "Implement a redaction layer in the Winston logger configuration to filter out PII and secrets."
        },
        {
          issue: "Outdated JWT Library Version",
          severity: "Low",
          fix: "Update 'jsonwebtoken' to the latest version to patch known minor vulnerabilities."
        }
      ],
      risk_summary: "The application has a solid security foundation but is vulnerable to Denial of Service (DoS) attacks due to lack of rate limiting. Most other issues are minor and related to dependency maintenance and logging hygiene."
    },
    documentation_review: {
      score: 82,
      assessment: "The README is comprehensive, providing clear setup instructions and architecture overviews. Code comments are present in complex logic areas, but API documentation (Swagger/OpenAPI) is partially outdated.",
      missing_sections: [
        "Deployment Guide for Production Environments",
        "Contribution Guidelines (CONTRIBUTING.md)",
        "API Response Schema Examples"
      ],
      improvements: [
        "Automate OpenAPI specification generation from decorators",
        "Add a visual architecture diagram to the README",
        "Include a 'Troubleshooting' section for common local setup issues"
      ]
    },
    action_plan: {
      critical: [
        "Implement Rate Limiting middleware",
        "Fix high-severity security findings in dependencies"
      ],
      high: [
        "Update API documentation to match current implementation",
        "Redact sensitive data from logs"
      ],
      medium: [
        "Refactor AnalyticsController",
        "Implement CONTRIBUTING.md"
      ],
      low: [
        "Update JWT library",
        "Clean up circular dependencies"
      ]
    },
    overall_recommendation: "Focus on immediate security hardening by implementing rate limiting and log redaction. Following this, prioritize technical debt reduction by refactoring large controllers and updating the API documentation to ensure the project remains maintainable as it scales."
  }
};
