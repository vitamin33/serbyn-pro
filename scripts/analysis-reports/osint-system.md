# osint-system — Architecture Analysis

_Analyzed: 2026-03-01T02:28:07.998770_
_Files: 86 | Tokens: ~202,706_

The `osint-system` project is a sophisticated platform designed for Open Source Intelligence (OSINT) investigations. It features a modern asynchronous Python backend, a reactive React/TypeScript frontend, and a distributed task processing system, all containerized for easy deployment.

## 1. Architecture Overview

- **What does this project do?**
  This project provides a comprehensive platform for conducting OSINT investigations, focusing on analyzing phone numbers, social media profiles (VK, Telegram, Instagram), and performing facial recognition searches across various public sources. It aims to correlate disparate pieces of information into a unified identity profile.

- **Main tech stack**
  - **Backend**: Python 3.11, FastAPI, SQLAlchemy 2.0 (async), Pydantic 2.x, Celery (with Redis as broker/backend), `httpx`, `structlog`, `tenacity`. Key OSINT libraries/tools include `phonenumbers`, `telethon`, `vk_api`, `beautifulsoup4`, `patchright`.
  - **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Zustand, React Query, Cytoscape.js.
  - **Database**: PostgreSQL 15 (primary) / SQLite (development fallback), managed with Alembic.
  - **Containerization**: Docker, Docker Compose.

- **Architecture pattern**
  The project follows a **Modular Monolith** pattern, with a clear separation of concerns between the FastAPI web API, asynchronous Celery workers for background processing, and dedicated data stores (PostgreSQL, Redis). The frontend is a separate Single Page Application (SPA) that communicates with the backend API. This setup allows for component isolation while maintaining a unified deployment and development experience.

- **Key entry points**
  - **Web API**: `app.main:app` exposed via Uvicorn on port 8000 (mapped to 8010 in Docker). All API routes are under `/api/v1/*`.
  - **Celery Worker**: `celery -A app.workers.celery_app worker` executes background tasks.
  - **Celery Beat**: `celery -A app.workers.celery_app beat` for scheduled tasks.
  - **Frontend**: `npm run dev` (Vite development server) or static build served on port 3000 (mapped to 80 for production containers).

## 2. Code Quality Assessment (1-10 scale)

- **Code organization**: **9/10**
  The codebase is exceptionally well-structured, following best practices for both Python (backend) and TypeScript (frontend). The backend cleanly separates core utilities, models, services, API routes, tool integrations, and workers. The frontend follows a standard React application structure. The `CLAUDE.md` file provides an outstanding architectural overview, demonstrating a clear understanding of the project's components.

- **Error handling**: **8/10**
  Backend global error handling for `RequestValidationError` and general `Exception` is implemented in `app/main.py`. Individual OSINT tool wrappers (`app/tools/*`) robustly use `try-except` blocks, returning a standardized `ToolResult` with success status and error messages. Celery tasks (`app/workers/tasks.py`) include `try-except` blocks, update job status (e.g., `fail_job`), and use `BaseTask` with `autoretry_for` exceptions. The frontend effectively uses `react-query` to manage loading, error, and data states.

- **Testing coverage (based on test files found)**: **5/10**
  The project includes a suite of E2E (End-to-End) tests (`tests/test_e2e.py`, `tests/test_e2e_pipeline.py`, `tests/test_e2e_telegram_p1.py`) using Playwright. These tests are quite comprehensive in verifying the full system flow from UI to backend. However, there are no visible unit or integration tests for individual components (e.g., services, models, helper functions, individual tool wrappers) in the provided code. While E2E tests provide confidence in system functionality, robust unit tests are crucial for verifying complex logic and preventing regressions.

- **Documentation quality**: **9/10**
  The documentation is excellent. `README.md` offers a quick start, but `CLAUDE.md` is a standout, providing a detailed architectural overview, development commands, code style guidelines, and key patterns. `docs/PROJECT_STATUS.md` offers an insightful status update, including deployment strategies and future recommendations. Code comments and docstrings are present for critical functions and modules, though could be more comprehensive in some utility functions. The frontend `types/index.ts` is also well-documented.

- **Security practices**: **8/10**
  Good security practices are evident:
  - **Docker hardening**: Uses `python:3.11-slim`, `apt-get install --no-install-recommends`, `rm -rf /var/lib/apt/lists/*`, and switches to a non-root user (`USER osint`).
  - **Configuration**: Uses Pydantic settings (`app/core/config.py`) to manage environment variables, preventing hardcoded secrets in code. `.env.example` provides a clear template for sensitive data.
  - **CORS**: Properly configured in `app/main.py` using `settings.cors_origins`.
  - **Input Validation**: Pydantic schemas are used extensively for API request validation, and `phonenumbers` for phone input cleansing.
  - **Asynchronous HTTP**: `httpx` is used for external calls, which is a good practice.
  - **PimEyes session**: The manual `scripts/pimeyes_auth.py` approach to acquire session cookies is a practical workaround for strong anti-bot measures, but storing cookies on disk requires careful consideration for production security and rotation.

## 3. Key Components

1.  **`app/main.py`**: The central FastAPI application, setting up global configurations, middleware (CORS, error handling), and routing all API endpoints. It defines the application's lifecycle events for DB initialization/closing.
2.  **`app/core/config.py`**: A Pydantic `BaseSettings` class that serves as the single source of truth for all application configuration, loading values from `.env` files and environment variables. This centralizes and validates settings across the entire system.
3.  **`app/models/*` (e.g., `app/models/case.py`, `app/models/source.py`)**: Defines the SQLAlchemy ORM models (`Case`, `Subject`, `Job`, `Source`, `FaceMatch`, `Identity`, `Link`, `TrackingLink`, `TrackingEvent`) that represent the application's data schema and relationships in the PostgreSQL/SQLite database.
4.  **`app/tools/base.py` & `app/tools/*`**: `BaseTool` establishes an abstract interface for all external OSINT tool integrations, enforcing a common structure and handling boilerplate like HTTP clients, retries (`tenacity`), and rate limiting. The individual tool files (`phoneinfoga.py`, `moriarty.py`, `pimeyes.py`, `vk.py`, `telegram.py`, etc.) implement the specific logic for interacting with each OSINT service.
5.  **`app/workers/tasks.py`**: Contains the Celery tasks responsible for executing resource-intensive or long-running OSINT operations. It orchestrates the "synergistic 4-phase investigation pipeline" (`run_unified_investigation`), which combines multiple tool runs, cross-referencing, and follow-up investigations.
6.  **`app/services/correlation/*` (e.g., `engine.py`, `graph.py`, `confidence.py`)**: This sub-package forms the intelligence core, responsible for constructing a holistic `IdentityGraph` from disparate OSINT data, identifying correlations and contradictions, and calculating a `ConfidenceScore` for the overall identity. It utilizes various `matchers.py` for name, phone, and email comparisons.
7.  **`app/api/schemas.py`**: Defines all Pydantic models used for API request bodies and response serialization, ensuring strict data validation and clear API contracts.
8.  **`frontend/src/*`**: The React/TypeScript frontend application. Key sub-components include `src/pages/*` (dashboard, cases, subjects, investigate, jobs), `src/components/IdentityGraph.tsx` (Cytoscape.js visualization), and `src/services/api.ts` (API client for backend interaction).

## 4. Technical Debt & Issues

-   **Obvious bugs, anti-patterns, or risks**
    -   **Incomplete `TelegramTool._build_activity_timeline`**: The `app/tools/telegram.py` file seems to be cut off or incomplete, specifically within the `_build_activity_timeline` function, making `total_message` undefined. This is a bug for this specific feature.
    -   **Fragile PimEyes Session Management**: Relying on manually acquired browser cookies (`scripts/pimeyes_auth.py`) for `PimEyesTool` is a significant operational burden. Sessions expire, requiring manual re-authentication, which is unsuitable for automated, long-running production environments. This is a common workaround for strong anti-bot measures but introduces a high point of failure.
    -   **Synchronous `vk_api` in an async codebase**: The `VkTool._refresh_user_token_async` correctly uses `asyncio.run_in_executor` to move the blocking `vk_api` call to a separate thread. While functionally correct, it indicates a dependency on a synchronous library within an otherwise async architecture, which can add complexity and requires careful management of the thread pool.
    -   **Hardcoded Tool Logic in `tasks.py`**: The `_run_phone_investigation` and `_run_face_investigation` functions in `app/workers/tasks.py` explicitly list and call individual tools. While manageable for a few tools, a more dynamic, registry-based approach could be beneficial as more tools are added.
    -   **`Search4Faces` IP Blocking**: The `frontend/src/pages/InvestigatePage.tsx` and `docs/PROJECT_STATUS.md` indicate that `Search4Faces` is blocked (403 error). This tool is currently non-functional without a proxy or other IP evasion techniques, limiting face search capabilities.
    -   **Incomplete Tool Implementations**: Several tools like `GetContact`, `Moriarty`, `Phomber` are marked as "Framework only" or "5 stub methods" in `docs/PROJECT_STATUS.md`, meaning they require significant development to become fully functional.
    -   **Default `CORS_ORIGINS` in production**: The `app/core/config.py` defaults `cors_origins` to `http://localhost:3000,http://localhost:8000`. For production, this should be explicitly set to the actual frontend domain(s) to avoid overly permissive CORS policies.

-   **Missing tests or documentation**
    -   **Unit/Integration Tests**: The primary gap is the absence of dedicated unit and integration tests for service logic (`app/services/*`), models (`app/models/*`), and individual utility functions, beyond the existing E2E suite. This can make refactoring or adding new features riskier.
    -   **Tool-specific deep documentation**: While `CLAUDE.md` is excellent, detailed documentation for each OSINT tool, including their limitations, exact data extracted, specific setup steps (e.g., API key acquisition, required proxy settings), and troubleshooting, would greatly enhance usability for future developers and maintainers.

-   **Hardcoded values or secrets**
    -   API keys and tokens are correctly handled via Pydantic settings (`app/core/config.py`) loading from `.env`. This is good.
    -   Minor hardcoded values such as `VK_API_VERSION` and `VK_API_BASE` in `app/tools/vk.py` are generally stable and acceptable. User-agent strings in `PimEyesTool` and `BaseTool` could be made configurable, though less critical.

## 5. Revenue/Monetization Potential

-   **Can this project generate income? How?**
    Yes, the `osint-system` has strong revenue potential, particularly for B2B clients in fields like cybersecurity, law enforcement, private investigation, and risk assessment.
    1.  **SaaS Subscription Model**: Offer tiered access based on:
        -   Number of investigations/queries (e.g., per phone, per face search, per full pipeline run).
        -   Access to premium/paid OSINT tools (e.g., PimEyes, commercial data sources).
        -   Advanced features (deep correlation, automated monitoring, custom reports, API access for integration into client systems).
        -   Storage limits for collected data.
    2.  **Enterprise Licensing/On-Premise Deployment**: For organizations with strict data governance or large-scale needs, provide a self-hosted version of the platform with dedicated support and custom feature development.
    3.  **Managed OSINT Services**: Leverage the platform internally to offer OSINT-as-a-service, performing investigations for clients and providing reports.
    4.  **API Access for Developers**: Expose the backend API as a paid service, allowing other applications to integrate specific OSINT capabilities (e.g., phone intelligence, social profile lookups).

-   **What's missing to make it production-ready for revenue?**
    1.  **Full Tool Integration & Reliability**: The core missing piece is the full and robust implementation of all planned OSINT tools (`GetContact`, `Moriarty`, `Search4Faces`, `FindClone`, `VK`, `Telegram`). Many are placeholders, reducing the current value proposition. These integrations often require overcoming complex anti-bot measures, which needs ongoing maintenance.
    2.  **User Authentication & Authorization (RBAC)**: Currently, there's no visible user management system. A production system requires robust user authentication (login, registration), session management, and role-based access control (RBAC) to manage permissions and secure user data/cases.
    3.  **Scalability & Observability for Distributed Systems**: While Docker Compose is good for local dev, a revenue-generating platform needs to scale for many users and concurrent tasks. This implies a transition to Kubernetes or similar orchestration, robust monitoring (logging, metrics, tracing), and efficient resource management for Celery workers.
    4.  **Billing & Subscription Management**: Integration with a payment gateway and a subscription management system is essential to handle different pricing tiers, usage tracking, and automated billing.
    5.  **Robust Proxy Infrastructure**: For tools relying on web scraping or susceptible to IP blocking (e.g., `Search4Faces`, `Moriarty`), a sophisticated, rotating proxy infrastructure is critical for uninterrupted operation and avoiding rate limits.
    6.  **Frontend Polish & UX Enhancements**: To compete, the UI needs further refinement in terms of user experience, real-time feedback, comprehensive reporting dashboards, and intuitive data visualization.
    7.  **Legal & Ethical Compliance**: Operating in OSINT requires strict adherence to privacy laws (e.g., GDPR), terms of service of various platforms, and ethical guidelines. Legal counsel and features to support compliance are paramount.

## 6. Integration Opportunities

-   **How could this project connect with other projects in the portfolio?**
    1.  **Threat Intelligence Platforms (TIPs)**: Automatically feed identified compromised accounts (emails, phones, social profiles), suspicious individuals, or attack patterns discovered through OSINT into a central TIP. This enriches existing threat data and provides real-world context to security analysts.
    2.  **Incident Response (IR) & SOC Tools**: During an incident (e.g., phishing campaign, data breach), automatically query the OSINT system for context on involved entities (e.g., sender's email, associated phone numbers, social media footprint of a suspected attacker).
    3.  **Fraud Detection & Anti-Money Laundering (AML) Systems**: Integrate phone validation, identity verification via social profiles, or reverse image search results into fraud scoring algorithms for financial transactions, customer onboarding, or KYC processes.
    4.  **Customer Relationship Management (CRM) / Sales Intelligence**: For B2B sales, use OSINT to identify key decision-makers, gather public company information, or build enriched contact profiles (with ethical considerations).
    5.  **Security Awareness Training**: Analyze an organization's digital footprint and use the findings to tailor security awareness training, demonstrating real-world risks from publicly available information.

-   **What APIs or services does it expose/consume?**
    -   **Exposes**:
        -   **RESTful API (`/api/v1/*`)**: For CRUD operations on investigations (`/cases`, `/subjects`, `/jobs`), triggering OSINT tasks (`/investigate/*`), and running correlation analysis (`/correlate/*`). This is the primary external interface.
        -   **Health Check (`/health`)**: For readiness and liveness probes in deployment environments.
        -   **Static File Server (`/storage`)**: To serve downloaded images (e.g., Telegram profile photos, face matches) to the frontend.
    -   **Consumes**:
        -   **PostgreSQL**: Primary data store (`app/core/database.py`).
        -   **Redis**: Celery broker and result backend (`app/workers/celery_app.py`).
        -   **Celery**: Internal task queue for asynchronous processing (`app/workers/tasks.py`).
        -   **External OSINT Tools/APIs**:
            -   `PhoneInfoga` (CLI tool)
            -   `GetContact` (External API, placeholder)
            -   `Moriarty Project` (Web scraping/API)
            -   `Phomber` (Web scraping/API)
            -   `PimEyes` (External API, uses managed session cookies)
            -   `Search4Faces` (Web scraping/API)
            -   `FindClone` (Web scraping/API)
            -   `VK API` (via `vk_api` Python library)
            -   `Telegram API` (via `telethon` Python library)
            -   `NumVerify` (Optional, third-party API)
            -   `httpx`: Python asynchronous HTTP client for all external web requests.
            -   `phonenumbers`: Python library for phone number parsing.
            -   `beautifulsoup4`: Python library for web scraping.
            -   `Playwright` (via `patchright`): Python library for browser automation (used for PimEyes auth).

## 7. Recommended Next Steps (top 3)

1.  **Complete & Enhance Core OSINT Tool Integrations for Data Acquisition**:
    *   **Impact**: Directly boosts the platform's utility and "intelligence" by providing more comprehensive data. Many tools are currently incomplete.
    *   **Action**: Prioritize fully implementing `TelegramTool` (resolve the incomplete `_build_activity_timeline` and other deep analysis features), `Search4Faces`, `FindClone`, `Moriarty`, and `Phomber`. Integrate free-tier APIs like `NumVerify` and `Have I Been Pwned` as quick wins. Focus on making these tools robust against common issues like rate limiting, CAPTCHAs, and IP blocking, potentially by implementing a rotating proxy solution (already partially configured in settings).
    *   **Files to focus on**: `app/tools/telegram.py`, `app/tools/search4faces.py`, `app/tools/findclone.py`, `app/tools/moriarty.py`, `app/tools/phomber.py`, `app/core/config.py` (for proxy settings and new API keys).

2.  **Implement Robust User Authentication and Authorization**:
    *   **Impact**: Essential for security, multi-user functionality, and building any revenue-generating model. Without it, the system is fundamentally a single-user tool.
    *   **Action**: Integrate a robust authentication scheme (e.g., OAuth2/JWT) with FastAPI. Add user registration, login, and secure password management. Implement a basic authorization system where users own and can only access their own cases and subjects. Consider adding user roles (e.g., admin, analyst) for future feature gating.
    *   **Files to focus on**: Create new modules like `app/api/auth.py`, modify `app/api/routes/*` to add authentication dependencies, add user models to `app/models/`, and update `app/services/case_service.py` to associate cases with users.

3.  **Develop Comprehensive Unit & Integration Tests**:
    *   **Impact**: Significantly improves code reliability, maintainability, and confidence in future development/refactoring. Catches bugs earlier than E2E tests.
    *   **Action**: Focus on writing unit tests for core services (`app/services/*`), data models (`app/models/*`), utility functions (`app/services/correlation/matchers.py`), and the logic within individual tool wrappers (mocking external API calls). This will ensure correctness of individual components and allow for faster iteration.
    *   **Files to focus on**: Create new test files in `tests/` like `tests/unit/test_services.py`, `tests/unit/test_models.py`, `tests/integration/test_tools.py`.
