import os
from typing import List, Dict

class Chunker:
    """
    Handles reading repository files and chunking them for LLM processing.
    """
    def __init__(self, max_chars: int = 30000):
        self.max_chars = max_chars

    def get_repo_content(self, root_dir: str, ignore_dirs: List[str] = None) -> str:
        """
        Reads all text files in the repository and combines them into a single string.
        """
        if ignore_dirs is None:
            from .file_scanner import IGNORE_DIRS
            ignore_dirs = list(IGNORE_DIRS)

        content = []
        for root, dirs, files in os.walk(root_dir):
            dirs[:] = [d for d in dirs if d not in ignore_dirs]

            for file in files:
                file_path = os.path.join(root, file)
                rel_path = os.path.relpath(file_path, root_dir)

                # Basic text file check based on extension
                from .file_scanner import EXTENSION_MAP
                _, ext = os.path.splitext(file)
                if ext.lower() in EXTENSION_MAP:
                    try:
                        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                            file_text = f.read()
                            content.append(f"--- File: {rel_path} ---\n{file_text}\n")
                    except Exception:
                        continue

        return "\n".join(content)

    def chunk_text(self, text: str) -> List[str]:
        """
        Splits text into chunks of roughly max_chars size.
        """
        chunks = []
        for i in range(0, len(text), self.max_chars):
            chunks.append(text[i:i + self.max_chars])
        return chunks
