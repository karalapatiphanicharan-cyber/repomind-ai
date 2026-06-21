import shutil
import os
import logging
import time
import stat

logger = logging.getLogger(__name__)

def handle_remove_readonly(func, path, excinfo):
    """
    Error handler for shutil.rmtree to handle read-only files.
    It changes the file permission to writable and retries the removal.
    """
    try:
        os.chmod(path, stat.S_IWRITE)
        func(path)
    except Exception as e:
        logger.debug(f"Could not change permissions for {path}: {str(e)}")

def cleanup_directory(path: str, retries: int = 3, delay: float = 0.5):
    """
    Safely deletes a directory and its contents with retries and
    read-only file handling, primarily for Windows stability.
    """
    if not os.path.exists(path):
        return

    for attempt in range(retries):
        try:
            if os.path.isdir(path):
                # Using onerror for compatibility with older Python 3 versions
                # while supporting read-only file removal
                shutil.rmtree(path, onerror=handle_remove_readonly)
            else:
                try:
                    os.remove(path)
                except PermissionError:
                    os.chmod(path, stat.S_IWRITE)
                    os.remove(path)

            # If we reach here and path is gone, we're done
            if not os.path.exists(path):
                return

        except Exception as e:
            if attempt < retries - 1:
                logger.warning(f"Cleanup attempt {attempt + 1} for {path} failed: {str(e)}. Retrying...")
                time.sleep(delay)
            else:
                logger.error(f"Final cleanup attempt for {path} failed: {str(e)}")
