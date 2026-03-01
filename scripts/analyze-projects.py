#!/usr/bin/env python3
"""
Analyze all projects in ~/development/ using Gemini Flash (free tier).
Generates architecture reports, code quality findings, and cross-project patterns.

Usage:
    pip install google-genai
    python scripts/analyze-projects.py

Output: scripts/analysis-reports/ directory with per-project reports
"""

import os
import json
import time
import pathlib
from datetime import datetime

try:
    from google import genai
except ImportError:
    print("Install: pip install google-genai")
    exit(1)

# --- Config ---
DEV_DIR = pathlib.Path.home() / "development"
OUTPUT_DIR = pathlib.Path(__file__).parent / "analysis-reports"
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

SKIP_DIRS = {
    "node_modules", ".next", "build", "dist", "__pycache__",
    ".venv", "venv", ".eggs", "site-packages", ".dart_tool",
    ".pub-cache", ".git", ".gradle", ".idea", "ios/Pods",
    "android/.gradle", "coverage", ".turbo", ".cache",
    ".claude",
}

SOURCE_EXTENSIONS = {
    ".py", ".ts", ".tsx", ".js", ".jsx", ".dart",
    ".yaml", ".yml", ".toml", ".json", ".md",
}

# Priority files to always include
PRIORITY_FILES = {
    "CLAUDE.md", "README.md", "README.rst",
    "docker-compose.yml", "docker-compose.yaml",
    "Dockerfile", "package.json", "pyproject.toml",
    "requirements.txt", "Makefile", ".env.example",
    "Caddyfile", "Procfile",
}

MAX_FILE_SIZE = 50_000  # chars per file
MAX_PROJECT_TOKENS = 900_000  # ~900k chars ≈ stay under Gemini 1M context

ANALYSIS_PROMPT = """You are a senior software architect analyzing a codebase.

PROJECT: {project_name}

Analyze the following source code and produce a structured report:

## 1. Architecture Overview
- What does this project do? (1-2 sentences)
- Main tech stack
- Architecture pattern (monolith, microservices, pipeline, etc.)
- Key entry points

## 2. Code Quality Assessment (1-10 scale)
- Code organization
- Error handling
- Testing coverage (based on test files found)
- Documentation quality
- Security practices

## 3. Key Components
- List the 5-8 most important modules/files and what they do

## 4. Technical Debt & Issues
- Any obvious bugs, anti-patterns, or risks
- Missing tests or documentation
- Hardcoded values or secrets

## 5. Revenue/Monetization Potential
- Can this project generate income? How?
- What's missing to make it production-ready for revenue?

## 6. Integration Opportunities
- How could this project connect with other projects in the portfolio?
- What APIs or services does it expose/consume?

## 7. Recommended Next Steps (top 3)
- Most impactful improvements

Be specific. Reference actual file names and code patterns you see.

--- SOURCE CODE ---

{source_code}
"""


def should_skip(path: pathlib.Path) -> bool:
    """Check if path should be skipped."""
    return any(skip in path.parts for skip in SKIP_DIRS)


def collect_files(project_dir: pathlib.Path) -> tuple[list[dict], int]:
    """Collect source files from a project, prioritizing important files."""
    files = []
    total_chars = 0

    # First pass: priority files
    for root, dirs, filenames in os.walk(project_dir):
        root_path = pathlib.Path(root)
        if should_skip(root_path):
            dirs.clear()
            continue
        for fname in filenames:
            if fname in PRIORITY_FILES:
                fpath = root_path / fname
                try:
                    content = fpath.read_text(errors="ignore")[:MAX_FILE_SIZE]
                    rel = fpath.relative_to(project_dir)
                    files.append({"path": str(rel), "content": content, "priority": True})
                    total_chars += len(content)
                except (PermissionError, OSError):
                    pass

    # Second pass: source code files
    for root, dirs, filenames in os.walk(project_dir):
        root_path = pathlib.Path(root)
        if should_skip(root_path):
            dirs.clear()
            continue
        for fname in sorted(filenames):
            fpath = root_path / fname
            if fpath.suffix not in SOURCE_EXTENSIONS:
                continue
            if fname in PRIORITY_FILES:
                continue  # already added
            if total_chars >= MAX_PROJECT_TOKENS:
                break
            try:
                content = fpath.read_text(errors="ignore")[:MAX_FILE_SIZE]
                rel = fpath.relative_to(project_dir)
                files.append({"path": str(rel), "content": content, "priority": False})
                total_chars += len(content)
            except (PermissionError, OSError):
                pass

    return files, total_chars


def build_source_block(files: list[dict]) -> str:
    """Build a single text block from collected files."""
    parts = []
    for f in files:
        marker = " [PRIORITY]" if f["priority"] else ""
        parts.append(f"=== {f['path']}{marker} ===\n{f['content']}\n")
    return "\n".join(parts)


def analyze_project(client, project_name: str, project_dir: pathlib.Path) -> dict:
    """Analyze a single project with Gemini Flash."""
    print(f"\n{'='*60}")
    print(f"Analyzing: {project_name}")
    print(f"{'='*60}")

    files, total_chars = collect_files(project_dir)
    if not files:
        print("  No source files found, skipping.")
        return None

    source_files_count = len([f for f in files if not f["priority"]])
    priority_count = len([f for f in files if f["priority"]])
    print(f"  Files: {source_files_count} source + {priority_count} config")
    print(f"  Total chars: {total_chars:,} (~{total_chars // 4:,} tokens)")

    source_block = build_source_block(files)
    prompt = ANALYSIS_PROMPT.format(
        project_name=project_name,
        source_code=source_block,
    )

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )
        report = response.text
        print(f"  Analysis complete ({len(report):,} chars)")

        # Rate limit: free tier = 15 RPM for Flash
        time.sleep(5)

        return {
            "project": project_name,
            "path": str(project_dir),
            "files_analyzed": len(files),
            "total_chars": total_chars,
            "estimated_tokens": total_chars // 4,
            "report": report,
            "analyzed_at": datetime.now().isoformat(),
        }
    except Exception as e:
        print(f"  ERROR: {e}")
        time.sleep(10)  # longer pause on error
        return {
            "project": project_name,
            "error": str(e),
            "files_analyzed": len(files),
            "total_chars": total_chars,
        }


def main():
    if not GEMINI_API_KEY:
        print("Set GEMINI_API_KEY environment variable")
        exit(1)

    client = genai.Client(api_key=GEMINI_API_KEY)

    # Create output directory
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # Discover projects (~/development/ + ~/ascend/)
    projects = sorted([
        d for d in DEV_DIR.iterdir()
        if d.is_dir() and not d.name.startswith(".")
    ])
    # Add ~/ascend/ if it exists
    ascend_dir = pathlib.Path.home() / "ascend"
    if ascend_dir.is_dir():
        projects.append(ascend_dir)

    print(f"Found {len(projects)} projects in {DEV_DIR}")
    print(f"Output: {OUTPUT_DIR}\n")

    results = []
    for project_dir in projects:
        result = analyze_project(client, project_dir.name, project_dir)
        if result:
            results.append(result)

            # Save individual report
            report_file = OUTPUT_DIR / f"{project_dir.name}.md"
            if "report" in result:
                report_file.write_text(
                    f"# {project_dir.name} — Architecture Analysis\n\n"
                    f"_Analyzed: {result['analyzed_at']}_\n"
                    f"_Files: {result['files_analyzed']} | "
                    f"Tokens: ~{result['estimated_tokens']:,}_\n\n"
                    f"{result['report']}\n"
                )
                print(f"  Saved: {report_file}")

    # Save summary
    summary_file = OUTPUT_DIR / "_summary.json"
    summary = {
        "analyzed_at": datetime.now().isoformat(),
        "total_projects": len(results),
        "total_tokens": sum(r.get("estimated_tokens", 0) for r in results),
        "projects": [
            {
                "name": r["project"],
                "files": r.get("files_analyzed", 0),
                "tokens": r.get("estimated_tokens", 0),
                "status": "ok" if "report" in r else "error",
            }
            for r in results
        ],
    }
    summary_file.write_text(json.dumps(summary, indent=2))

    print(f"\n{'='*60}")
    print(f"DONE: {len(results)} projects analyzed")
    print(f"Total tokens: ~{summary['total_tokens']:,}")
    print(f"Reports: {OUTPUT_DIR}")
    print(f"Summary: {summary_file}")


if __name__ == "__main__":
    main()
