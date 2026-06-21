import os
import git
from fastapi import HTTPException

class GitHubProcessor:
    @staticmethod
    def clone_repository(repo_url: str, clone_to: str) -> str:
        """
        Clones a public GitHub repository to a temporary directory.
        """
        # Validate GitHub URL format
        if not repo_url.startswith("https://github.com/"):
            raise HTTPException(status_code=400, detail="Invalid GitHub URL. Only https://github.com/ URLs are supported.")

        try:
            # Attempt to clone the repository
            # env={"GIT_TERMINAL_PROMPT": "0"} prevents hanging on auth prompts
            git.Repo.clone_from(repo_url, clone_to, depth=1, env={"GIT_TERMINAL_PROMPT": "0"})
            return clone_to
        except git.exc.GitCommandError as e:
            # Handle common errors (private repo, 404, etc.)
            if "not found" in str(e).lower() or "authentication failed" in str(e).lower():
                raise HTTPException(status_code=400, detail="Repository not found or is private. Only public repositories are supported.")
            raise HTTPException(status_code=500, detail=f"Failed to clone repository: {str(e)}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Unexpected error while cloning: {str(e)}")
