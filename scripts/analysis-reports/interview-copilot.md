# interview-copilot — Architecture Analysis

_Analyzed: 2026-03-01T02:23:42.343317_
_Files: 19 | Tokens: ~30,793_

## Interview Copilot: Codebase Analysis Report

---

## 1. Architecture Overview

This project provides a real-time AI-powered interview assistant with two primary modes: an audio-based assistant that transcribes system audio and provides LLM responses, and a screenshot-based assistant for analyzing coding problems visually. The current default entry point (via `make run`) is the screenshot-based "Code Interview Assistant".

**Main Tech Stack:**
*   **Language:** Python 3.8+
*   **Audio Processing:** `sounddevice`, `faster-whisper` (for Automatic Speech Recognition)
*   **LLM Integration:** `openai` (GPT-4, GPT-4V, etc.), `requests` (for local Ollama)
*   **System Interaction:** `pynput` (global hotkeys), `pyperclip` (clipboard), `Pillow` (image manipulation)
*   **OCR & Vision:** `easyocr`, `pytesseract` (for OCR), `openai` (for GPT-4 Vision API)
*   **UI:** `tkinter` (always-on-top overlay)
*   **Configuration:** `python-dotenv`
*   **System Dependencies:** FFmpeg, BlackHole 2ch (macOS audio driver), Tesseract (optional, for `pytesseract`)
*   **Build/Automation:** `Makefile`

**Architecture Pattern:**
The project follows a **monolithic client-side application** pattern. All components (audio capture, ASR, LLM clients, OCR, vision, UI, hotkeys) run within a single Python process on the user's local machine. It heavily relies on external cloud services (OpenAI) and local services (Ollama) as LLM backends, but the orchestration and UI are self-contained. The codebase indicates an evolution from an audio-first approach (`copilot/main.py`) to a code-analysis-first approach (`copilot/code_analyzer_main.py`), with the latter being the new default.

**Key Entry Points:**
*   **`make run`**: Executes `copilot.code_analyzer_main` (the screenshot-based assistant). This is the primary entry point for the new functionality.
*   **`make dev`**: Also executes `copilot.code_analyzer_main` with debug logging.
*   **`make audio`**: Executes `copilot.main` (the original audio-based assistant, now a legacy/alternative path).
*   **`copilot/code_analyzer_main.py`**: Contains the `CodeInterviewAssistant` class, orchestrating screenshot capture, OCR, vision analysis, and GUI updates.
*   **`copilot/main.py`**: Contains the `InterviewCopilot` class, orchestrating audio capture, ASR, LLM calls, and GUI updates (used by the `make audio` target).
*   **`copilot_simple.py`**: A simplified version of the audio-based copilot, not used by `Makefile` targets but present in the codebase.
*   **`run_stable.py`**: A wrapper script designed for crash recovery, running `copilot.main`. It is not directly invoked by the main `Makefile` `run` target, which points to `code_analyzer_main`. This implies `copilot.main` might have stability issues.

## 2. Code Quality Assessment (1-10 scale)

*   **Code Organization (8/10):**
    *   The project structure (`copilot/` directory with dedicated modules like `audio.py`, `asr.py`, `llm.py`, `overlay.py`, `ocr.py`, `vision_analysis.py`) is clear and follows a good separation of concerns.
    *   The `scripts/` directory is also well-defined for utility scripts.
    *   Confusion arises from the presence of `copilot/main.py` (legacy audio) and `copilot/code_analyzer_main.py` (new default code analysis), and how `copilot/__init__.py` points to the latter, while the `Makefile` still retains an `audio` target for the former. This duality could be simplified or more clearly documented. `copilot_simple.py` and `run_stable.py` further add to this slight redundancy.
*   **Error Handling (7/10):**
    *   Extensive `try-except` blocks are used, especially around API calls (`llm.py`, `vision_analysis.py`), audio capture (`audio.py`), and hotkey registration (`main.py`, `code_analyzer_main.py`).
    *   Detailed logging (`logging` module) is implemented across most modules, which is excellent for debugging.
    *   `run_stable.py` demonstrates an effort towards robust crash recovery with progressive backoff, although it wraps the older `copilot.main` (audio) and not the new default `code_analyzer_main`.
    *   User-facing error messages are provided via the `overlay.py` to the GUI, enhancing user experience.
*   **Testing Coverage (1/10):**
    *   There are **no dedicated test files or directories** (e.g., `tests/` or `test_*.py`) provided in the source code.
    *   The `verify_audio.py` script serves as a basic system check/diagnostic tool, but not as an automated unit or integration test suite.
    *   This is a significant gap, impacting reliability and maintainability.
*   **Documentation Quality (7/10):**
    *   `README.md` is comprehensive, covering features, quick start, audio setup, configuration, usage, hotkeys, troubleshooting, project structure, and ethical usage. It primarily focuses on the audio-based copilot.
    *   `CLAUDE.md` provides a good overview for an AI assistant, including common commands and architecture. It acknowledges both modes.
    *   Inline comments are present in many complex logic sections (e.g., `asr.py`, `main.py`'s `should_call_llm` and `is_question_complete`).
    *   Function docstrings are used, but not consistently across all functions/methods.
    *   The `README.md`'s project structure diagram should be updated to reflect `code_analyzer_main.py` and the other new components fully.
*   **Security Practices (6/10):**
    *   Sensitive information (OpenAI API key) is correctly handled via environment variables (`.env` and `python-dotenv`), preventing hardcoding.
    *   The "privacy mode" feature in `overlay.py` attempts to hide the overlay from screen sharing on macOS using AppleScript/ctypes, which is a good effort for a privacy-sensitive tool, but platform-specific and potentially fragile.
    *   The application relies on external LLM services (OpenAI, Ollama), which implies trust in those providers for data handling.
    *   As a client-side application, standard client-side security concerns (e.g., OS permissions for microphone, accessibility, screenshots, clipboard) are acknowledged in documentation. No obvious vulnerabilities in terms of server-side communication (as there is no server-side component beyond LLMs).

## 3. Key Components

1.  **`copilot/code_analyzer_main.py`**: (Main entry point for code analysis) Orchestrates the entire code interview assistant workflow, managing screenshot capture, OCR, vision analysis, and interaction with the `CodeAnalysisOverlay`. It handles hotkey triggers and processing of multiple screenshots.
2.  **`copilot/overlay.py`**: (User Interface) Implements the always-on-top Tkinter GUI for both code analysis and (in its base class form) audio-based interaction. It displays questions/solutions, status, and provides interactive buttons and processing indicators. It also includes macOS-specific logic for privacy mode (hiding the window from screen sharing).
3.  **`copilot/asr.py`**: (Automatic Speech Recognition) Utilizes `faster-whisper` to transcribe audio from a rolling buffer. It includes optimizations for performance (e.g., `compute_type="int8"`, `num_workers=1`) and handles dynamic language changes.
4.  **`copilot/llm.py`**: (LLM Client) Provides a unified interface to interact with OpenAI's API and local Ollama instances. It includes fallback logic (online OpenAI vs. offline Ollama) and handles API key configuration.
5.  **`copilot/ocr.py`**: (Code Text Extraction) Employs `easyocr` and `pytesseract` to extract text from image screenshots. It includes logic for cleaning and formatting extracted code-like text and a heuristic to determine if the text content appears to be code.
6.  **`copilot/screenshot.py`**: (Screenshot Capture) Handles full-screen screenshot capture using `PIL.ImageGrab`, saving them to a temporary directory. It also includes cleanup functionality for old screenshots.
7.  **`copilot/vision_analysis.py`**: (AI Vision Analysis) Integrates with OpenAI's Vision API (GPT-4V) to analyze code screenshots. It sends both the image and (optionally) OCR-extracted text to the LLM, with a fallback to text-only analysis if the vision API fails.
8.  **`copilot/config.py`**: (Configuration Management) Loads environment variables from `.env` and provides application-wide configuration settings, including LLM parameters, audio device names, and language-aware system prompts.

## 4. Technical Debt & Issues

*   **Diverging Codebases/Confusing Entry Points:** The project has two "main" files (`copilot/main.py` for audio, `copilot/code_analyzer_main.py` for code analysis) and `copilot/__init__.py` points `main` to the code analyzer. The `Makefile` has targets for both (`run`/`dev` for code analyzer, `audio` for the older audio copilot). `copilot_simple.py` and `run_stable.py` exist but are not consistently integrated or referenced. This creates ambiguity and maintenance overhead. The `README.md` mostly describes the audio features, not the new code analysis features it points to.
*   **Lack of Automated Testing:** The absence of unit, integration, or end-to-end tests makes it difficult to ensure the reliability of new features or refactorings. This is the most critical technical debt.
*   **Platform-Specific Dependencies & Setup:**
    *   Heavy reliance on macOS-specific components (BlackHole for audio, AppleScript/ctypes for privacy mode in `overlay.py`).
    *   Requires manual installation of system dependencies like FFmpeg, BlackHole, and Tesseract. This increases setup friction and limits cross-platform usability.
*   **Heuristic-Based Logic:**
    *   The `should_call_llm` and `is_question_complete` logic in `copilot/main.py` relies on simple heuristics (e.g., ending with `?`, specific keywords, character count, silence duration). While pragmatic, these can be brittle and lead to missed triggers or erroneous LLM calls.
    *   `ocr.py` also uses heuristics (`is_code_like`) to determine if extracted text resembles code, which can be inaccurate.
*   **Error Recovery (Partial):** While `run_stable.py` aims for crash recovery, it wraps the older audio copilot. The newer code analysis copilot (the default `make run` target) does not have this external wrapper for process restarts.
*   **Hardcoded Delays:** Several `time.sleep()` calls (e.g., in `_capture_screenshot_async` in `code_analyzer_main.py`, or `audio_processing_loop` in `main.py`) are present, which can affect responsiveness and adaptability to different system performance or network latencies.
*   **Potential Hotkey Conflicts:** `pynput` for global hotkeys can sometimes conflict with other system hotkeys or require specific accessibility permissions, which is noted in the documentation but remains a user setup challenge.

## 5. Revenue/Monetization Potential

**Can this project generate income? How?**
Yes, this project has strong potential for generating income by addressing a real need for interview preparation and in-interview assistance.
1.  **Subscription Model (Freemium/Premium):**
    *   **Premium LLM Access:** Offer access to higher-tier OpenAI models (e.g., GPT-4o, GPT-4V) or specialized models with better performance/accuracy for a subscription fee.
    *   **Advanced Features:** Include features like multi-language support, deeper code analysis (e.g., syntax highlighting, bug detection, performance optimization suggestions), or historical question/solution tracking behind a paywall.
    *   **Local Ollama as Free Tier:** Keep local Ollama support as a free, privacy-focused option to attract users, then upsell to cloud models for better quality/speed.
2.  **Enterprise/Educational Licensing:**
    *   **Bootcamps & Universities:** License to coding bootcamps, universities, or corporate training programs for their students/employees to use during practice or mock interviews.
    *   **Interview Prep Platforms:** Partner with existing interview preparation platforms (e.g., LeetCode, HackerRank, Interviewing.io) to integrate as a premium tool.
3.  **Customization/Consulting:** Offer tailored versions for specific company interview styles or tech stacks, potentially including private LLM deployments.

**What's missing to make it production-ready for revenue?**

1.  **Robustness and Stability:** Extensive testing (unit, integration, E2E) is critical. The current lack of tests is a major blocker for reliable commercial deployment. Better error recovery for the `code_analyzer_main` and cross-platform stability.
2.  **Cross-Platform Desktop Application:** Currently heavily macOS-focused. Packaging into a single, easy-to-install executable (e.g., using PyInstaller, or even an Electron wrapper for a more consistent UI) for Windows, Linux, and macOS is essential for a wider user base.
3.  **User Authentication and Account Management:** To support subscriptions and track usage, a backend system with user authentication, payment processing (Stripe, etc.), and subscription management is required.
4.  **Enhanced UI/UX:** A more polished, consistent, and user-friendly interface. Features like clear onboarding, settings management (without editing `.env` directly), and richer display of code/solutions (e.g., syntax highlighting, markdown rendering within Tkinter or a webview).
5.  **Ethical & Legal Framework:** Clear End User License Agreement (EULA), Terms of Service, and a robust Privacy Policy, especially considering system audio transcription and screenshot capture.
6.  **Scalability of LLM Usage:** Implement rate limiting, usage tracking, and cost optimization for OpenAI API calls. For Ollama, provide clearer guidance on hardware requirements for local models.

## 6. Integration Opportunities

**How could this project connect with other projects in the portfolio?**

*   **Interview Prep Platforms:** Integrate with platforms like LeetCode, HackerRank, CodeSignal, or Pramp. The current screenshot-based analysis could be enhanced by directly ingesting problem statements from browser pages (e.g., via browser extensions or specific platform APIs).
*   **Learning Management Systems (LMS):** For educational institutions, it could integrate with an LMS to provide guided practice, automatically generating solutions or explanations for coding assignments.
*   **IDEs/Code Editors:** Develop a VS Code or JetBrains plugin to offer integrated code analysis, allowing developers to highlight code snippets directly in their IDE for analysis, rather than taking screenshots.
*   **Virtual Interview Platforms:** Enhance integration with video conferencing tools (Zoom, Google Meet, Microsoft Teams) for better "privacy mode" detection and control, ensuring the overlay is genuinely hidden from screen shares.

**What APIs or services does it expose/consume?**

*   **Consumes:**
    *   **OpenAI API:** For `gpt-4-vision-preview` (visual code analysis) and `gpt-5.0-instant` (or configured) for text-based responses (`llm.py`, `vision_analysis.py`).
    *   **Ollama API:** Local HTTP API at `http://localhost:11434/api/generate` for offline LLM processing (`llm.py`).
    *   **System Audio Input:** Via `sounddevice` to interact with physical/virtual audio devices like "BlackHole 2ch" (`audio.py`).
    *   **Global Hotkeys:** Through `pynput` for system-wide commands (`main.py`, `code_analyzer_main.py`).
    *   **Clipboard:** Via `pyperclip` for copy/paste functionality (`main.py`, `code_analyzer_main.py`, `overlay.py`).
    *   **File System:** For saving screenshots (`screenshot.py`).
    *   **macOS System APIs:** Potentially via `osascript` (AppleScript) or `ctypes` for window manipulation/privacy features (`overlay.py`).
*   **Exposes:**
    *   **GUI Overlay:** The primary user-facing interface, providing visual feedback and interactive controls.
    *   **Internal Callbacks:** Various modules (e.g., `overlay.py`) expose callbacks (`on_screenshot_capture`, `on_analyze_all`, `on_language_change`) for inter-module communication within the single application process.
    *   The project is fundamentally a client-side tool and does not expose any external network-accessible APIs for other services to consume directly.

## 7. Recommended Next Steps (top 3)

1.  **Consolidate & Streamline Project Architecture:**
    *   **Action:** Decide on the primary focus (audio, code analysis, or a truly unified experience). Refactor the entry points and `main` files (`copilot/main.py`, `copilot/code_analyzer_main.py`, `copilot_simple.py`) into a single, cohesive application structure. This might involve creating a `CoreCopilot` class that can switch between "modes" (audio, visual) or clearly deprecating one.
    *   **Impact:** Reduces technical debt, simplifies maintenance, clarifies project direction for users and developers, and lays the groundwork for future feature development.
2.  **Implement Comprehensive Automated Testing:**
    *   **Action:** Introduce a dedicated `tests/` directory with unit tests for core modules (`asr.py`, `llm.py`, `ocr.py`, `vision_analysis.py`, `config.py`), and integration tests for workflows (e.g., `screenshot -> ocr -> vision -> overlay`). Utilize a framework like `pytest`.
    *   **Impact:** Significantly improves code quality, reduces bug count, enables safer refactoring, and builds confidence in the application's reliability, which is crucial for any production-ready or monetized product.
3.  **Enhance Cross-Platform Compatibility and Distribution:**
    *   **Action:** Investigate and implement solutions for Windows and Linux compatibility. This includes finding alternatives to macOS-specific audio drivers (BlackHole) and privacy mode hacks, ensuring `pynput` and `ImageGrab` work consistently, and packaging the application using tools like PyInstaller or even explore cross-platform GUI frameworks if Tkinter becomes a bottleneck (e.g., PyQt/PySide). Provide easily downloadable installers/executables.
    *   **Impact:** Broadens the potential user base beyond macOS, significantly improves the user experience by simplifying installation, and reduces support burden related to system-specific issues.
