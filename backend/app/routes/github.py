import os
import uuid
from fastapi import APIRouter, HTTPException
from ..config import settings
from ..services.github_processor import GitHubProcessor
from ..services.file_scanner import FileScanner
from ..utils.cleanup import cleanup_directory
from ..models.requests import GitHubRequest, ProjectSummary

router = APIRouter()

@router.post("/github", response_model=ProjectSummary)
async def analyze_github(request: GitHubRequest):
    # Generate unique working directory
    job_id = str(uuid.uuid4())
    job_dir = os.path.join(settings.BASE_TEMP_DIR, job_id)
    os.makedirs(job_dir, exist_ok=True)

    clone_dir = os.path.join(job_dir, "repo")
    os.makedirs(clone_dir, exist_ok=True)

    try:
        # Clone repository
        GitHubProcessor.clone_repository(request.url, clone_dir)

        # Scan files
        scanner = FileScanner(clone_dir)
        scan_results = scanner.scan()

        return {
            "success": True,
            **scan_results
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
    finally:
        # Cleanup
        cleanup_directory(job_dir)
