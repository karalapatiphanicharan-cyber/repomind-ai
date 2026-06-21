import os
from typing import List, Dict, Set

# Directories to ignore
IGNORE_DIRS = {
    'node_modules', '.git', 'dist', 'build', 'out', 'coverage', '.next',
    'target', 'venv', '__pycache__', '.pytest_cache', '.vscode', '.idea'
}

# Supported file extensions and their corresponding languages
EXTENSION_MAP = {
    '.py': 'Python',
    '.js': 'JavaScript',
    '.jsx': 'JavaScript React',
    '.ts': 'TypeScript',
    '.tsx': 'TypeScript React',
    '.java': 'Java',
    '.cpp': 'C++',
    '.c': 'C',
    '.cs': 'C#',
    '.go': 'Go',
    '.rs': 'Rust',
    '.php': 'PHP',
    '.rb': 'Ruby',
    '.json': 'JSON',
    '.yaml': 'YAML',
    '.yml': 'YAML',
    '.toml': 'TOML',
    '.xml': 'XML',
    '.html': 'HTML',
    '.css': 'CSS',
    '.scss': 'SCSS',
    '.md': 'Markdown',
    '.txt': 'Text'
}

# Special files to detect
SPECIAL_FILES = {
    'README.md': 'readme',
    'package.json': 'package_json',
    'requirements.txt': 'requirements_txt',
    'pom.xml': 'pom_xml',
    'Dockerfile': 'dockerfile'
}

class FileScanner:
    def __init__(self, root_dir: str):
        self.root_dir = root_dir
        self.files_scanned = 0
        self.supported_files_count = 0
        self.languages: Set[str] = set()
        self.detected_special_files: Dict[str, bool] = {
            'readme': False,
            'package_json': False,
            'requirements_txt': False,
            'pom_xml': False,
            'dockerfile': False
        }
        self.top_level_directories: List[str] = []

    def scan(self) -> Dict:
        if not os.path.exists(self.root_dir):
            return {"error": "Root directory does not exist"}

        # Get top level directories
        self.top_level_directories = [
            d for d in os.listdir(self.root_dir)
            if os.path.isdir(os.path.join(self.root_dir, d)) and d not in IGNORE_DIRS
        ]

        for root, dirs, files in os.walk(self.root_dir):
            # Prune ignored directories
            dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]

            for file in files:
                self.files_scanned += 1
                file_path = os.path.join(root, file)

                # Check for special files
                if file in SPECIAL_FILES:
                    self.detected_special_files[SPECIAL_FILES[file]] = True
                elif file.lower() == 'readme.md': # Handle case sensitivity for readme
                     self.detected_special_files['readme'] = True

                # Check file extension
                _, ext = os.path.splitext(file)
                if ext.lower() in EXTENSION_MAP:
                    self.supported_files_count += 1
                    self.languages.add(EXTENSION_MAP[ext.lower()])

        return {
            "project_name": os.path.basename(self.root_dir),
            "files_scanned": self.files_scanned,
            "total_supported_files": self.supported_files_count,
            "languages": sorted(list(self.languages)),
            "detected_files": self.detected_special_files,
            "top_level_directories": self.top_level_directories
        }
