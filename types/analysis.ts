export interface SecurityFinding {
  issue: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  fix: string;
}

export interface AIReport {
  project_name: string;
  overall_score: number;
  summary: {
    files_scanned: number;
    languages: string[];
    overview: string;
  };
  code_analysis: {
    score: number;
    architecture: string;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
  security_review: {
    score: number;
    findings: SecurityFinding[];
    risk_summary: string;
  };
  documentation_review: {
    score: number;
    assessment: string;
    missing_sections: string[];
    improvements: string[];
  };
  action_plan: {
    critical: string[];
    high: string[];
    medium: string[];
    low: string[];
  };
  overall_recommendation: string;
}

export interface AnalysisSummary {
  success: boolean;
  project_name: string;
  files_scanned: number;
  total_supported_files: number;
  languages: string[];
  detected_files: {
    readme: boolean;
    package_json: boolean;
    requirements_txt: boolean;
    pom_xml: boolean;
    dockerfile: boolean;
  };
  top_level_directories: string[];
  ai_report?: AIReport;
  ai_error?: string;
}
