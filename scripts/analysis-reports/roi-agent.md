# roi-agent — Architecture Analysis

_Analyzed: 2026-03-01T02:32:07.466720_
_Files: 157 | Tokens: ~225,678_

## 1. Architecture Overview

The `roi-agent` project is a Python-based monorepo that houses several AI-powered services focused on optimizing digital advertising and streamlining project management. It acts as a backend platform to analyze ad creatives, manage ad campaigns on platforms like Facebook, track performance metrics, and automate project tasks in Linear via Slack.

**Main tech stack**:
*   **Web Framework**: FastAPI (1.0) with Uvicorn
*   **Asynchronous Processing**: Celery (5) with Redis (7) as a broker
*   **Database/ORM**: PostgreSQL (16), SQLAlchemy (2), Alembic (migrations)
*   **Vector Search**: Qdrant (1.x)
*   **AI/ML**: OpenAI (GPT-4o-mini fallback), Ollama (Mixtral 8x7B for local LLM), HuggingFace Transformers (BLIP-2 for vision analysis, Sentence Transformers for embeddings), Pydantic (data models)
*   **Integrations**: Facebook Graph API & CAPI, Shopify Webhooks, Google Drive API, Linear (GraphQL API), Slack Bolt, Telegram Bot, AWS S3 (via aioboto3)
*   **DevOps/Monitoring**: Docker, Docker Compose, Grafana Alloy (optional), Sentry SDK, GitHub Actions, pre-commit, Ruff, Black, Mypy, Pytest

**Architecture pattern**:
This project follows a **dual-service monorepo** pattern. It encapsulates multiple, distinct FastAPI services (`mediabuyer`, `pm_agent`, `ugc-agent`) within a single repository, sharing core components like the database and LLM infrastructure. Asynchronous tasks are handled by Celery workers, forming a pipeline architecture for data processing. It leverages external SaaS for specialized functionalities (Linear, Facebook Graph API, OpenAI).

**Key entry points**:
*   **`roi-agent` (Mediabuyer service)**: Exposed on port `8000` (e.g., `mediabuyer/router.py` implicitly handling `/analyze`, `/audiences`, `/webhooks/shopify/order_paid` etc.).
*   **`pm-agent`**: Exposed on port `8100` (`pm_agent/main.py` includes routes for `/epics`, `/tickets`, `/status`).
*   **`ugc-agent`**: Exposed on a separate router (`ugc/main.py` includes routes for `/ugc/script`, `/ugc/hooks`).
*   **`celery-worker`**: Executes background tasks (`celery -A mediabuyer worker`).
*   **`celery-beat`**: Schedules periodic tasks (`celery -A mediabuyer beat`).

## 2. Code Quality Assessment (1-10 scale)

*   **Code organization**: **8/10**. The `README.md` clearly outlines the monorepo structure with distinct top-level directories for `ai_layer`, `apps`, `core`, `mediabuyer`, `pm_agent`, and `ugc`. Services are well-separated, and `core/` contains shared utilities. The use of `pyproject.toml` for `roi-agent` and `mediabuyer` further indicates modularity. The only slight concern is `core/config.py` importing `mediabuyer.config`, which creates a subtle dependency from a supposed "core" module to an application-specific one.
*   **Error handling**: **6/10**. The `CLAUDE.md` and `core/llm/openai_engine.py` highlight explicit strategies for network errors (Celery retries, LLM fallbacks to mock). However, the `/analyze` endpoint in `tests/test_api.py` catches a generic `Exception`, potentially masking more specific issues. Database migration checks at startup are a good practice.
*   **Testing coverage**: **8/10**. A dedicated `tests/` directory is present with numerous specific test files (`test_abtest_guardrail.py`, `test_ai_router.py`, `test_analyze.py`, etc.). The `README.md` explicitly states a "CI fails if global coverage < 85 %" and details `pytest` usage, suggesting a strong commitment to testing. The `conftest.py` sets up robust test isolation (in-memory SQLite, HTTP blocking, Celery eager mode).
*   **Documentation quality**: **9/10**. The `README.md`, `ONBOARDING.md`, and especially `CLAUDE.md` are exceptionally thorough. They cover the project's purpose, tech stack, repository layout, Docker usage, daily workflow, CI rules, environment variables, testing, quality tools, and a comprehensive glossary. This is outstanding documentation for developers. In-code documentation (docstrings) is also present in key modules.
*   **Security practices**: **5/10**. Good practices include `python:3.11-slim` base image, pinned dependencies, `sentry-sdk`, environment variable for `QDRANT_API_KEY`, and `require_bm_token` for API authentication. **However, a significant critical issue is the presence of `secrets/drive.json` directly in the codebase.** While `docker-compose.yml` mounts it as read-only, committing actual service account credentials to a repository (even if private) is a major security anti-pattern and a high risk for credential exposure.

## 3. Key Components

1.  **`mediabuyer/db/models.py` (and related migration files)**: Defines the core data schema for creative assets, performance metrics, audience profiles, A/B tests, Shopify orders, and case studies. It forms the backbone of the `mediabuyer` service's data persistence.
2.  **`core/llm/openai_engine.py`**: A central component for interacting with Large Language Models. It provides an abstraction for LLM calls, supporting local Ollama (Mixtral), OpenAI's GPT-4o-mini as a fallback, and a mock mode for testing, ensuring flexibility and resilience.
3.  **`core/vector/qdrant_store.py`**: Manages the interaction with the Qdrant vector database. It's responsible for embedding text (using Sentence Transformers) and performing semantic searches, crucial for features like "semantic code search" mentioned in the `README.md` and `pm_agent/services/planner.py`.
4.  **`ai_layer/router.py`**: The intelligent core for project management automation. It takes a Product Requirement Document (PRD) and uses an LLM (Mixtral or GPT-4o-mini) to break it down into actionable tasks, complete with estimates and implementation hints.
5.  **`pm_agent/services/linear.py`**: Handles all interactions with the Linear GraphQL API, including creating projects (epics), issues (tasks), managing labels, and fetching current progress. It bridges the LLM-generated tasks with the project management system.
6.  **`mediabuyer/services/victory_guardrail.py` (inferred from tests)**: Implements business logic for automatically pausing underperforming ad creatives based on defined KPIs (e.g., CPP). This is a critical automation feature for maintaining ad campaign efficiency.
7.  **`mediabuyer/tasks/push_variants.py` (inferred from tests)**: A Celery task responsible for uploading new creative images and pushing creative variants to Meta (Facebook Ads) for A/B testing and campaign deployment.
8.  **`ugc/router.py` (and supporting files)**: Exposes API endpoints for generating User-Generated Content (UGC) scripts and hooks. This module suggests capabilities for generating marketing copy based on product information.

## 4. Technical Debt & Issues

*   **Hardcoded Secret (`secrets/drive.json`)**: This is the most critical issue. Storing a Google service account key directly in the repository is a major security vulnerability. It should be managed via environment variables injected at runtime or a dedicated secrets management system, and *never* committed to source control.
*   **Fragile LLM Output Parsing (`pm_agent/services/planner.py`)**: The use of regex (`_JSON_RE`, `_BRACKET_RE`, `_SNIP_RE`) to extract and sanitize JSON from LLM output is brittle. LLMs are prone to slight formatting variations, and regex is not a robust tool for parsing structured data. This should ideally use Pydantic's structured output parsing capabilities (as hinted by `instructor` in `requirements.txt`) or a dedicated JSON parser with flexible error handling.
*   **`core/config.py` Dependency Inversion Violation**: `core/config.py` imports `mediabuyer.config.settings`. The `core` module should ideally be agnostic to specific application components. This inversion of dependency suggests that `mediabuyer`'s config is treated as the "global" config, which could lead to tighter coupling and difficulties if `mediabuyer` needs to be refactored or if another application needs its own distinct configuration.
*   **Placeholder LLM Implementation (`ugc/services/script_builder.py`)**: The `make_ugc_script` and `make_hooks` functions currently return `"[MOCK]"` strings. This indicates incomplete functionality for a core feature, potentially blocking the full realization of the UGC agent.
*   **Module-level `QdrantClient.recreate_collection`**: In `core/vector/qdrant_store.py`, `_qd.recreate_collection` is called at the module level. This means every time the module is imported, the collection is dropped and recreated. This can lead to data loss and performance issues if not carefully managed, and might indicate a misunderstanding of Qdrant's lifecycle or a simplified approach for local development. For production, `create_collection` with `on_exists="skip"` or explicit migration management would be safer.
*   **Generic Exception Catching (`tests/test_api.py`)**: The `/analyze` endpoint's `except Exception as e` is overly broad and can obscure specific errors, making debugging and robust error recovery more challenging. More granular exception handling is recommended.
*   **`subprocess.check_output("git ls-files ...")` in `pm_agent/services/planner.py`**: Relying on external shell commands can introduce dependencies on the execution environment (e.g., `git` CLI availability, specific shell behavior). This is generally less robust and harder to test than pure Python alternatives or dedicated library calls.

## 5. Revenue/Monetization Potential

**Can this project generate income? How?**
Absolutely. The `roi-agent` project has strong monetization potential, primarily through its core `mediabuyer` and `ugc` functionalities, which directly address common pain points in digital marketing and e-commerce.

1.  **SaaS Platform**: Offer the "Creative Coach" and campaign optimization tools as a subscription-based SaaS. Businesses could subscribe to analyze their ad creatives, get AI-driven recommendations, and automate their Facebook ad campaigns.
2.  **Performance-Based Fees**: Charge clients a percentage of the "incremental lift" or improved ROAS (Return on Ad Spend) that the agent helps them achieve. This aligns incentives directly with client success.
3.  **UGC Content Generation Service**: The `ugc-agent` could generate high-performing ad copy, headlines, and video scripts. This could be offered as a standalone service or a premium add-on to the main platform.
4.  **Agency Tooling**: Used internally by a marketing agency to enhance their service offerings, increase efficiency, and deliver better results for their clients, leading to higher client retention and growth.
5.  **Analytics and Reporting**: The `case_studies` table and performance tracking capabilities could form the basis of a premium analytics and reporting service, providing clients with deep insights and PDF reports on their campaign performance and ROI.

**What's missing to make it production-ready for revenue?**

1.  **Multi-Tenancy**: The current database schema appears single-tenant. To onboard multiple paying clients, robust multi-tenancy is crucial, ensuring data isolation, separate API keys, and configurable access for each client without data leakage.
2.  **User Interface (UI)**: The project is currently API-driven. A compelling, intuitive UI/dashboard is essential for clients to:
    *   Upload/manage creatives.
    *   View AI analysis and recommendations.
    *   Monitor ad campaign performance (CPP, ROAS, etc.).
    *   Manage A/B tests and approval workflows.
    *   Access generated UGC content and performance reports.
3.  **Robust LLM Orchestration & Cost Management**: While fallbacks are in place, a revenue-generating product needs more sophisticated LLM management:
    *   **Fine-tuning/Domain Adaptation**: For specific niches (e.g., fashion, tech), fine-tuning smaller, cheaper models could yield better results and reduce OpenAI/Ollama costs.
    *   **Guardrails & Moderation**: More advanced content moderation for generated text (beyond simple regex) to prevent inappropriate or off-brand outputs.
    *   **Dynamic Model Selection**: Implement logic to intelligently choose the most cost-effective and performant LLM for a given task (e.g., small local model for simple tasks, larger cloud model for complex ones).
4.  **Client Onboarding & Integrations**: A streamlined process for clients to securely connect their Facebook Ad accounts, Shopify stores, etc., including OAuth flows and clear permission management.
5.  **Scalability and Reliability for Critical Workflows**: While Docker Compose is good for development, production deployments will require Kubernetes for horizontal scaling, robust monitoring (beyond basic Sentry), and disaster recovery strategies to ensure high availability for mission-critical ad spending. The `render.yaml` shows a `free` plan, which is not suitable for revenue-generating workloads.

## 6. Integration Opportunities

**How could this project connect with other projects in the portfolio?**

*   **E-commerce platforms**: Beyond Shopify (already integrated), this could connect to WooCommerce, Magento, or custom e-commerce backends to pull product catalogs, pricing, and order data for richer creative analysis and attribution.
*   **CRM/Marketing Automation**: Integrate with Salesforce, HubSpot, or custom CRM systems to segment audiences more effectively, personalize ad creatives based on customer lifecycle, and track lead quality from ads.
*   **Other Ad Platforms**: Extend the `platform` model to integrate with Google Ads, TikTok Ads, Pinterest Ads, etc., transforming `roi-agent` into a multi-platform ad optimization hub.
*   **Business Intelligence (BI) & Analytics Tools**: Push aggregated performance data (e.g., from `DailyPerf` and `CreativePerformance`) to tools like Tableau, Power BI, or a central data warehouse for cross-project reporting and advanced analytics. Grafana Alloy (present in `Dockerfile`) already points towards Grafana for observability.
*   **Digital Asset Management (DAM) Systems**: Integrate with creative asset libraries to pull images/videos directly, improving the workflow for creative ingestion and management.
*   **Internal Knowledge Base/Documentation**: The Qdrant vector store used for "semantic code search" (in `pm_agent/services/planner.py`) could be extended to index internal documentation, architectural decisions, and best practices, making it easier for developers and PMs to find relevant information.

**What APIs or services does it expose/consume?**

**Exposed APIs/Services**:
*   **FastAPI REST Endpoints**:
    *   `mediabuyer` service: Routes for creative analysis (`/analyze`), audience management (`/audiences`), creative variants (`/creatives/{id}/variants`), Facebook messages (`/fb/messages`), and Shopify webhooks (`/webhooks/shopify/order_paid`).
    *   `pm-agent` service: Routes for epic creation (`/epics/epic`), ticket creation (`/tickets`), and status reporting (`/status`).
    *   `ugc-agent` service: Routes for UGC script generation (`/ugc/script`) and hook generation (`/ugc/hooks`).
*   **Celery Queues**: `analysis`, `default` (used for asynchronous task processing like `analyse_creative_task` and `push_variants_to_meta`).
*   **PostgreSQL Database**: Provides a data layer accessible to other services (though direct access is discouraged).
*   **Qdrant Vector Database**: Exposes an interface for vector search, potentially consumable by other AI services needing semantic retrieval.

**Consumed APIs/Services**:
*   **External LLM Providers**:
    *   OpenAI API: `gpt-4o-mini` (fallback for `ai_layer/router.py` and potentially primary for `core/llm/openai_engine.py`).
    *   Ollama: Local `mistral:7b-instruct` (primary for `ai_layer/router.py`).
*   **Social/Ad Platforms**:
    *   Facebook Graph API: For ad creative management, campaign creation, and retrieving insights (`mediabuyer/adapters/facebook`).
    *   Facebook Conversions API (CAPI): For purchase attribution (`mediabuyer/adapters/facebook/capi.py`).
*   **E-commerce Platforms**:
    *   Shopify Webhooks API: Receives `order_paid` events (`tests/test_order_paid_attribution.py`).
*   **Project Management**:
    *   Linear API (GraphQL): For creating/updating issues and projects (`pm_agent/services/linear.py`).
*   **Cloud Storage/Ingestion**:
    *   Google Drive API: For watching and ingesting creative assets (`mediabuyer/adapters/google_drive.py`).
    *   AWS S3 (via aioboto3): For storing uploaded assets (`mediabuyer/adapters/s3.py`).
*   **Monitoring/Observability**:
    *   Sentry SDK: For error reporting.
    *   Grafana Alloy: (Optional, via Dockerfile) for metrics collection.
*   **Utilities**:
    *   HTTPX, Requests: Generic HTTP clients for external calls.
    *   Tiktoken: For token counting with LLMs.
    *   Pillow: For image processing (used in `core/vision.py`).

## 7. Recommended Next Steps (top 3)

1.  **Eliminate Hardcoded Secrets & Implement Proper Secrets Management**: **This is paramount.** The `secrets/drive.json` file embedded directly in the repository is a critical security vulnerability. It must be removed. Replace it with a robust secrets management solution (e.g., AWS Secrets Manager, GCP Secret Manager, HashiCorp Vault) and inject credentials securely as environment variables at runtime. Update `docker-compose.yml` and `Dockerfile` to reflect this change, ensuring secrets are loaded dynamically and never part of the version-controlled codebase.
2.  **Enhance LLM Output Robustness and Reliability for `pm-agent`**: The current regex-based parsing of LLM output in `pm_agent/services/planner.py` (`_extract_json_block`, `_SNIP_RE`) is fragile and prone to breaking with slight changes in LLM response formatting. Leverage libraries like `instructor` (already in `requirements.txt`) or LangChain's structured output parsers to enforce Pydantic schemas directly in LLM calls. This will significantly improve the reliability of task generation and reduce operational overhead from malformed outputs.
3.  **Develop a Multi-Tenancy Strategy for `mediabuyer`**: To monetize the `mediabuyer` service, it needs to support multiple independent clients/brands. This requires:
    *   **Database Schema Design**: Introduce a `client_id` (or similar) across relevant tables (e.g., `creatives`, `audience_profiles`, `shopify_orders`, `ab_tests`) and enforce it via foreign keys or ORM-level filters.
    *   **API Enforcement**: Implement API-level authorization to ensure users/clients can only access their own data.
    *   **Configuration Management**: Allow per-client configuration for API keys (Facebook, Shopify), LLM preferences, and specific guardrail thresholds. This is a foundational step for commercializing the platform.
