import os
from typing import List, Dict, Set

# Directories to ignore
IGNORE_DIRS = {
    'node_modules', '.git', 'dist', 'build', 'out', 'coverage', '.next',
    'target', 'venv', '__pycache__', '.pytest_cache', '.vscode', '.idea'
}

# Supported file extensions and their corresponding languages
# Organized as (Language Name, Is Primary Programming Language)
EXTENSION_MAP = {
    '.py': ('Python', True),
    '.js': ('JavaScript', True),
    '.jsx': ('JavaScript React', True),
    '.ts': ('TypeScript', True),
    '.tsx': ('TypeScript React', True),
    '.java': ('Java', True),
    '.cpp': ('C++', True),
    '.c': ('C', True),
    '.cs': ('C#', True),
    '.go': ('Go', True),
    '.rs': ('Rust', True),
    '.php': ('PHP', True),
    '.rb': ('Ruby', True),
    '.json': ('JSON', False),
    '.yaml': ('YAML', False),
    '.yml': ('YAML', False),
    '.toml': ('TOML', False),
    '.xml': ('XML', False),
    '.html': ('HTML', False),
    '.css': ('CSS', False),
    '.scss': ('SCSS', False),
    '.md': ('Markdown', False),
    '.txt': ('Text', False)
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
    def __init__(self, root_dir: str, project_name: str = None):
        self.root_dir = root_dir
        self._project_name = project_name
        self.files_scanned = 0
        self.supported_files_count = 0
        self.primary_languages: Set[str] = set()
        self.supporting_languages: Set[str] = set()
        self.detected_special_files: Dict[str, bool] = {
            'readme': False,
            'package_json': False,
            'requirements_txt': False,
            'pom_xml': False,
            'dockerfile': False
        }
        self.top_level_directories: List[str] = []

    def scan(self, project_name: str = None) -> Dict:
        if not os.path.exists(self.root_dir):
            return {"error": "Root directory does not exist"}

        # Priority: explicit param > constructor param > directory basename
        p_name = project_name or self._project_name or os.path.basename(self.root_dir)

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
                ext_lower = ext.lower()
                if ext_lower in EXTENSION_MAP:
                    self.supported_files_count += 1
                    lang_name, is_primary = EXTENSION_MAP[ext_lower]
                    if is_primary:
                        self.primary_languages.add(lang_name)
                    else:
                        self.supporting_languages.add(lang_name)

        # Logical presentation: Primary languages first, then supporting, each group sorted alphabetically
        ordered_languages = sorted(list(self.primary_languages)) + sorted(list(self.supporting_languages))

        return {
            "project_name": p_name,
            "files_scanned": self.files_scanned,
            "total_supported_files": self.supported_files_count,
            "languages": ordered_languages,
            "detected_files": self.detected_special_files,
            "top_level_directories": self.top_level_directories
        }
