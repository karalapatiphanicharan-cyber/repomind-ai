import shutil
import os
import logging

logger = logging.getLogger(__name__)

def cleanup_directory(path: str):
    """
    Safely deletes a directory and its contents.
    """
    try:
        if os.path.exists(path):
            if os.path.isdir(path):
                shutil.rmtree(path)
            else:
                os.remove(path)
    except Exception as e:
        logger.error(f"Error during cleanup of {path}: {str(e)}")
