export interface AnalysisSummary {
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
}
