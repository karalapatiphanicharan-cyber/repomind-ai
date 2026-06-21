import os
import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException
from ..config import settings
from ..services.zip_processor import ZipProcessor
from ..services.file_scanner import FileScanner
from ..utils.cleanup import cleanup_directory
from ..models.requests import ProjectSummary

router = APIRouter()

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

        # Scan files
        scanner = FileScanner(final_project_dir)
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
