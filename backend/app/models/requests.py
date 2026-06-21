from pydantic import BaseModel, HttpUrl
from typing import List, Dict, Optional

class GitHubRequest(BaseModel):
    url: str

class ProjectSummary(BaseModel):
    success: bool
    project_name: str
    files_scanned: int
    total_supported_files: int
    languages: List[str]
    detected_files: Dict[str, bool]
    top_level_directories: List[str]
    error: Optional[str] = None
