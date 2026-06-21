import os
import uuid
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, HTTPException
from ..config import settings
from ..services.zip_processor import ZipProcessor
from ..services.file_scanner import FileScanner
from ..agents.orchestrator import Orchestrator
from ..utils.cleanup import cleanup_directory
from ..models.requests import ProjectSummary

router = APIRouter()
orchestrator = Orchestrator()

@router.post("/upload", response_model=ProjectSummary)
async def upload_zip(file: UploadFile = File(...)):
    # Validate file type
    if not file.filename.endswith(".zip"):
        raise HTTPException(status_code=400, detail="Only .zip files are allowed.")

    # Generate unique working directory
    job_id = str(uuid.uuid4())
    job_dir = os.path.join(settings.BASE_TEMP_DIR, job_id)
    os.makedirs(job_dir, exist_ok=True)

    zip_path = os.path.join(job_dir, "upload.zip")
    extract_dir = os.path.join(job_dir, "extracted")
    os.makedirs(extract_dir, exist_ok=True)

    try:
        # Save upload with size limit check
        contents = await file.read()
        if len(contents) > settings.MAX_UPLOAD_SIZE:
            raise HTTPException(status_code=400, detail="File size exceeds the 50MB limit.")

        with open(zip_path, "wb") as f:
            f.write(contents)

        # Process ZIP
        final_project_dir = ZipProcessor.extract_safely(zip_path, extract_dir)

        # Extract project name from filename
        project_name = Path(file.filename).stem

        # 1. Scan files (Phase 2)
        scanner = FileScanner(final_project_dir)
        scan_results = scanner.scan(project_name=project_name)

        # 2. Run AI Analysis (Phase 3)
        ai_report = None
        ai_error = None
        try:
            ai_report = await orchestrator.analyze_project(scan_results, final_project_dir)
        except HTTPException as e:
            ai_error = e.detail
        except Exception:
            ai_error = "An unexpected error occurred during AI analysis."

        return {
            "success": True,
            **scan_results,
            "ai_report": ai_report,
            "ai_error": ai_error
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
    finally:
        # Cleanup
        cleanup_directory(job_dir)
