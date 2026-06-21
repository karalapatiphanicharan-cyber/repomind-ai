import os
import zipfile
import shutil
from pathlib import Path
from fastapi import HTTPException

class ZipProcessor:
    @staticmethod
    def extract_safely(zip_path: str, extract_to: str) -> str:
        """
        Extracts a zip file safely to a destination directory,
        preventing Zip Slip (path traversal) vulnerabilities.
        """
        try:
            with zipfile.ZipFile(zip_path, 'r') as zip_ref:
                # Check for Zip Slip
                for member in zip_ref.namelist():
                    member_path = os.path.join(extract_to, member)
                    # Use os.path.abspath and os.path.commonpath to ensure safety
                    abs_extract_to = os.path.abspath(extract_to)
                    abs_member_path = os.path.abspath(member_path)

                    if os.path.commonpath([abs_extract_to, abs_member_path]) != abs_extract_to:
                        raise HTTPException(status_code=400, detail="Security risk: Zip Slip detected")

                zip_ref.extractall(extract_to)

            # If the zip contains a single top-level directory, return that instead
            items = os.listdir(extract_to)
            if len(items) == 1 and os.path.isdir(os.path.join(extract_to, items[0])):
                return os.path.join(extract_to, items[0])

            return extract_to
        except zipfile.BadZipFile:
            raise HTTPException(status_code=400, detail="Invalid or corrupted ZIP file")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to extract ZIP: {str(e)}")
