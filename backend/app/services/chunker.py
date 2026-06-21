import os
import logging
from typing import List, Dict
import asyncio
from .gemini_client import gemini_client
from google.genai import types

logger = logging.getLogger(__name__)

class Chunker:
    """
    Handles reading repository files and chunking/summarizing them for LLM processing.
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
        Reads the repo, chunks it, summarizes each chunk, and returns a merged summary.
        """
        full_text = self.get_repo_content(root_dir)
        if len(full_text) <= self.max_chars:
            return full_text

        chunks = self.chunk_text(full_text)
        logger.info(f"Repository exceeds context limit. Splitting into {len(chunks)} chunks for summarization.")

        summaries = []
        for i, chunk in enumerate(chunks):
            prompt = f"Summarize the following code files from a repository. Focus on architecture, key functions, and security patterns. This is part {i+1} of {len(chunks)}.\n\n{chunk}"
            try:
                summary = await gemini_client.generate_content(prompt)
                summaries.append(summary)
            except Exception as e:
                logger.error(f"Failed to summarize chunk {i}: {str(e)}")
                summaries.append(f"[Error summarizing chunk {i}]")

        merged_summary_prompt = "The following are summaries of different parts of a code repository. Merge them into a single, cohesive technical summary that captures the overall architecture, purpose, and key implementation details.\n\n" + "\n\n".join(summaries)

        try:
            final_summary = await gemini_client.generate_content(merged_summary_prompt)
            return final_summary
        except Exception as e:
            logger.error(f"Failed to merge summaries: {str(e)}")
            return "\n\n".join(summaries)
