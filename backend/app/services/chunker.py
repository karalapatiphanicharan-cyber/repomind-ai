import os
import logging
from typing import List, Dict, Any
import asyncio
from .gemini_client import gemini_client
from google.genai import types

logger = logging.getLogger(__name__)

class Chunker:
    """
    Handles reading repository files and chunking/summarizing them for LLM processing.
    """
    def __init__(self, max_chars: int = 40000):
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

    async def summarize_repo(self, root_dir: str) -> str:
        """
        Reads the repo and returns a technical engineering context.
        Optimized to use fewer tokens and avoid redundant summarization calls.
        """
        full_text = self.get_repo_content(root_dir)

        # If the project is reasonably small, return full text directly to save a Gemini call
        if len(full_text) <= self.max_chars:
            return full_text

        # For larger repositories, summarize chunks locally where possible
        # (e.g., skip large binary-looking files or huge log files already filtered)
        # Here we perform ONE summarization for the whole repo if possible, or simple truncation
        # to ensure we stay under token limits without multiple expensive calls.
        logger.info(f"Repository size: {len(full_text)} chars. Providing optimized context.")

        # Strategy: Take the first 30k and last 10k to capture structure and main logic
        # without making an intermediate 'summarization' API call unless absolutely necessary.
        optimized_context = full_text[:30000] + "\n... [TRUNCATED FOR CONTEXT LIMITS] ...\n" + full_text[-10000:]
        return optimized_context
