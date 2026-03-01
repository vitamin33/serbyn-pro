# ragline — Architecture Analysis

_Analyzed: 2026-03-01T02:28:49.658919_
_Files: 114 | Tokens: ~225,909_

## 1. Architecture Overview

RAGline is a streaming-first, multi-tenant Python backend designed for AI-assisted e-commerce, offering LLM/RAG capabilities. It aims to provide a robust, observable, and extensible foundation for building advanced AI applications.

- **What does this project do?** It provides an event-driven, multi-tenant backend for managing products and orders, integrated with LLM/RAG for conversational AI, and designed for real-time interactions via streaming.
- **Main tech stack:** Python 3.11+, FastAPI, SQLAlchemy 2.0 (with asyncpg), Celery, Redis (for caching and streams), OpenAI API (for LLM/embeddings, with local model support via Ollama), pgvector (for vector database), Pydantic, Structlog, Prometheus.
- **Architecture pattern:** The project follows a **Microservices (Monorepo)** pattern, with distinct services (`api`, `llm`, `worker`) co-located in a single repository. It heavily leverages an **Event-Driven Architecture** using Redis Streams and an Outbox pattern for inter-service communication and reliability.
- **Key entry points:**
    - **API Service:** `services/api/main.py` (FastAPI, port 8000), handling REST APIs, SSE, and WebSockets.
    - **LLM Service:** `services/llm/main.py` (FastAPI, port 8001), handling chat, RAG, and tool execution.
    - **Worker Service:** `services/worker/celery_app.py` (Celery), processing background tasks from the outbox and streams.
    - **Infrastructure:** `ops/docker-compose.yml` provides local setup for PostgreSQL, Redis, Prometheus, Grafana, and Jaeger.
    - **Development:** `Makefile` commands like `setup-all`, `test`, `lint`, `type`, `sec`, `validate-contracts`.

## 2. Code Quality Assessment (1-10 scale)

- **Code organization:** 9/10
    - Excellent, logical separation into `services`, `packages`, `contracts`, `tests`, `ops`, and `docs`.
    - Clear ownership boundaries defined for "Agent A", "B", and "C" in `CLAUDE.md` and `agent-scopes/`.
    - `pyproject.toml` and `.vscode/settings.json` enforce consistent paths and configurations.
- **Error handling:** 8/10
    - Evident use of `try/except` blocks in critical areas (`RedisCache`, `LLMClient`, `OutboxConsumer`).
    - Custom exceptions (`ToolError`, `CircuitBreakerError`, `RateLimitExceededError`, `CostThresholdExceededError`) are well-defined.
    - Logging with `structlog` and `get_task_logger` is integrated, indicating structured logging intent.
    - Specific HTTP exceptions (`HTTPException`) are used in FastAPI routes.
- **Testing coverage (based on test files found):** 7/10
    - Comprehensive `tests/` directory with `unit/`, `integration/`, `examples/` subdirectories, clearly structured by agent (`tests/unit/agent_a/`, `tests/integration/cross_agent/`).
    - Detailed `README.md` files within `tests/` explain the scope and how to run tests.
    - `Makefile` includes commands for `test-unit`, `test-integration`, `test-all`, `lint`, `type`, `sec`, `validate-contracts`.
    - **Issue:** The `CI Pipeline` (`.github/workflows/ci.yml`) explicitly uses `|| true` after `pytest` commands, which means tests can fail without breaking the CI build. This significantly degrades the actual coverage and reliability assurance. Coverage reporting is also "temporarily disabled".
- **Documentation quality:** 9/10
    - Outstanding documentation, including `README.md`, `ARCHITECTURE.md`, `CLAUDE.md` (AI development rules), `DAILY_STATUS.md` (detailed sprint tracking), `DEVELOPMENT_PLAN.md`, `RAG_ARCHITECTURE.md`, `TECHNICAL_DEBT.md`, `SLOs.md`, and `SECURITY.md`.
    - Docstrings and comments are generally present and informative in the code examples provided.
    - The documentation not only describes the system but also the development process, AI integration strategy, and future roadmap.
- **Security practices:** 7/10
    - JWT-based authentication and role-based access control are implemented in `packages/security/`.
    - `Makefile` includes `sec` command running `bandit` and `safety check`.
    - `.pre-commit-config.yaml` includes `ruff`, `bandit`, and `gitleaks` (secrets detection).
    - `SECURITY.md` exists, though not provided for full review.
    - **Issue:** `JWT_SECRET` is hardcoded as a default in `jwt.py` and advised to be changed in `.env.example`, posing a risk if not properly configured in production.
    - **Issue:** `DATABASE_URL` in `docker-compose-db.yml` uses `secure_password` placeholder, and has `POSTGRES_HOST_AUTH_METHOD: trust`, which is not secure for production.
    - **Issue:** CORS `allow_origins=["*"]` in `services/llm/main.py` is flagged as a `TODO` for production hardening.

## 3. Key Components

1.  **`services/api/main.py`**: The core FastAPI application for the API service (Agent A). It defines endpoints for authentication, product CRUD, order management, and real-time event streaming via SSE/WebSocket. It also integrates with `packages/db/` and `packages/cache/`.
2.  **`services/llm/main.py`**: The FastAPI application for the LLM service (Agent C). It orchestrates LLM interactions, integrates the RAG pipeline (`packages/rag/`), manages tool execution (`services/llm/tools/`), and handles streaming chat responses.
3.  **`services/worker/celery_app.py`**: The Celery application for the Worker service (Agent B). It configures worker pools, task routing, and schedules background tasks for event processing, notifications, and DLQ management.
4.  **`packages/db/models.py`**: Defines the SQLAlchemy ORM models for the entire application's relational database (PostgreSQL), including `Tenant`, `User`, `Product`, `Order`, `OrderItem`, `Outbox`, and `Job` tables.
5.  **`packages/orchestrator/outbox.py`**: Implements the Outbox Pattern consumer (Agent B), reliably fetching unprocessed events from the database and publishing them to Redis Streams, with retry logic and DLQ integration.
6.  **`packages/orchestrator/stream_producer.py`**: Manages publishing events to Redis Streams (Agent B), automatically routing events to appropriate topics based on aggregate type, and handling serialization.
7.  **`packages/rag/embeddings.py`**: Core component for the RAG system (Agent C), handling vector embeddings generation (OpenAI, SentenceTransformers) and storage/retrieval using `pgvector` in PostgreSQL.
8.  **`services/llm/tools/`**: This directory (Agent C) contains the implementations of various LLM function-calling tools (`retrieve_menu`, `apply_promos`, `confirm`, `search_knowledge_base`), which abstract business logic for the LLM.

## 4. Technical Debt & Issues

-   **Critical CI/CD Reliability:** The `CI Pipeline` (`.github/workflows/ci.yml`) uses `|| true` for `pytest` commands, allowing tests to fail without marking the build as failed. This is a severe anti-pattern that undermines the purpose of CI. Additionally, coverage reporting is "temporarily disabled".
-   **Security: Hardcoded/Default Secrets & Credentials:**
    -   `JWT_SECRET=your-secret-key-here-change-in-production` in `.env.example` and as a default in `jwt.py` (`your-secret-key-change-in-production`). This poses a significant security risk if not updated in production.
    -   `POSTGRES_PASSWORD: password` and `POSTGRES_HOST_AUTH_METHOD: trust` in `docker-compose-db.yml` are insecure defaults for anything beyond local development.
-   **Multi-tenancy Isolation (Database Level):** `docs/TECHNICAL_DEBT.md` identifies "Tenant Isolation at Database Level" as a critical issue, currently using metadata filtering, risking "Potential data leakage" and performance problems. This needs a robust solution like Row-Level Security (RLS).
-   **Incomplete Features/Placeholders:**
    -   `packages/rag/ingestion.py` has `_cleanup_old_documents` with a `logger.warning("Document cleanup not implemented - requires vector store enhancement")`.
    -   `packages/orchestrator/tool_cache.py` uses a "Simple semantic hash - in production would use embeddings". This implies a performance/accuracy gap.
    -   CORS `allow_origins=["*"]` in `services/llm/main.py` and `services/api/main.py` needs to be hardened for production.
-   **Code Quality Exceptions in Ruff:** `pyproject.toml` ignores several Ruff rules (`C901` complexity, `E501` line length, `F401` unused imports, `F841` unused variables). While sometimes temporary in development, these should be addressed or justified before production.
-   **MyPy Import Ignores:** `mypy` is configured with `ignore_missing_imports = true` and `tests.* ignore_errors = true`. This can mask type-checking issues, particularly in complex dependencies or test setups.

## 5. Revenue/Monetization Potential

This project has strong revenue potential, primarily as a **SaaS platform for AI-assisted business operations**, targeting e-commerce, restaurant, or service industries.

-   **How can this project generate income?**
    1.  **Subscription Tiers (Multi-tenancy):** Offer different tiers (e.g., Basic, Pro, Enterprise) based on usage limits (API calls, LLM tokens, RAG document storage), features (e.g., advanced tools, voice integration), and support. Each `tenant_id` represents a paying customer.
    2.  **AI Feature as a Service (FaaS):** Monetize individual AI capabilities, such as:
        -   **Conversational AI/Chatbots:** Charge per conversation, per LLM token, or per active user/session.
        -   **RAG-powered Search:** Premium access to knowledge base search and personalized recommendations (e.g., product search, policy lookup).
        -   **Function Calling / AI Tools:** Charge per tool execution, especially for high-value actions like `apply_promos` or `confirm` that directly impact sales.
        -   **Voice AI (future):** Voice commerce, AI assistants for order taking, customer support.
    3.  **Data Analytics & Insights:** Offer premium dashboards (Grafana-based) and reports on business performance, customer behavior, and AI effectiveness.
    4.  **Customization & Integration:** Charge for professional services to integrate with existing customer systems or develop bespoke AI tools.

-   **What's missing to make it production-ready for revenue?**
    1.  **Robust Billing & Subscription Management:** Integration with a payment gateway (Stripe, Paddle) for recurring subscriptions, usage tracking, and invoice generation.
    2.  **Enhanced Security & Compliance:** Address critical database-level tenant isolation (`docs/TECHNICAL_DEBT.md`), implement PII detection/moderation (planned in `21DAY_SCHEDULE.md`), strengthen secrets management, and ensure compliance with relevant data protection regulations (GDPR, CCPA).
    3.  **Comprehensive LLM Cost Optimization & Tracking:** Full implementation of `ragline_llm_request_cost_usd` and other LLM observability metrics (`packages/orchestrator/tool_metrics.py`, `21DAY_SCHEDULE.md` Phase 2) is crucial to accurately price AI features and ensure profitability.
    4.  **Scalability & High Availability:** Implement horizontal scaling for all services, connection pooling for databases, Redis cluster for high availability, and an API Gateway (planned in `21DAY_SCHEDULE.md` Phase 5) for intelligent routing and centralized controls.
    5.  **Service Level Agreements (SLAs) & Operational Playbooks:** Formalize SLOs (`docs/SLOs.md`), establish alerting, and create runbooks (`docs/DEVELOPMENT_SYSTEM_IMPROVEMENTS.md` Phase 3) for quick incident response to guarantee service reliability to paying customers.
    6.  **Full CI/CD Pipeline:** Reliable and automated deployments with canary strategies (`docs/DEVELOPMENT_SYSTEM_IMPROVEMENTS.md` Phase 6) are essential to ensure new revenue-generating features can be deployed quickly and safely.

## 6. Integration Opportunities

The project's event-driven, API-first, and multi-tenant design provides numerous integration opportunities within a larger portfolio.

-   **How could this project connect with other projects in the portfolio?**
    1.  **Centralized E-commerce Platform:** RAGline's order/product management and AI capabilities could integrate as a core service for a broader e-commerce platform, providing AI-powered product discovery, customer support, and order processing.
    2.  **Customer Engagement Hub:** The SSE/WebSocket event streaming and future voice integration could feed into a customer engagement platform for real-time notifications, personalized marketing, or AI-driven customer service.
    3.  **MLOps Platform:** Its LLM/RAG capabilities, tool orchestration, and detailed metrics make it a natural fit for an MLOps platform, offering standardized AI component deployment and monitoring.
    4.  **Backend for Frontend (BFF):** It can serve as a powerful BFF for various client applications (web, mobile, voice interfaces), abstracting complex backend logic and integrating AI.
    5.  **Event Data Lake/Warehouse:** All events flowing through Redis Streams (`ragline:stream:*`) can be ingested into a central data lake for long-term analytics, business intelligence, and model training.

-   **What APIs or services does it expose/consume?**
    -   **Exposes:**
        -   **REST API (FastAPI):** `/v1/auth`, `/v1/products`, `/v1/orders`, `/chat/completions`, `/v1/tools` (OpenAPI spec at `contracts/openapi.yaml`).
        -   **Streaming API (SSE/WebSocket):** `/v1/events/stream`, `/v1/events/stream/orders`, `/v1/events/stream/notifications`, `/chat/ws/{client_id}`.
        -   **Prometheus Metrics:** `/metrics` endpoint on `API`, `LLM`, and `Worker` services (ports 8000, 8001, 8081).
        -   **Health Checks:** `/health` endpoint for all services.
    -   **Consumes:**
        -   **PostgreSQL:** Database for core data and `pgvector` for embeddings.
        -   **Redis:** Cache, message broker (Celery), and event streaming (Redis Streams).
        -   **OpenAI API:** For LLM inference and embedding generation (or local LLMs like Ollama via `OPENAI_API_BASE`).
        -   **Celery:** Internal task queue for asynchronous processing within the worker service.

## 7. Recommended Next Steps (top 3)

1.  **Address Critical CI/CD & Test Reliability (High Impact on Development & Production Quality):**
    *   **Action:** Immediately remove `|| true` from all `pytest` commands in `.github/workflows/ci.yml`. This is non-negotiable for a healthy project.
    *   **Action:** Re-enable and configure code coverage reporting, setting an initial minimum threshold (e.g., 60%) in `pyproject.toml` and enforcing it in CI.
    *   **Justification:** This single change dramatically improves development velocity by catching bugs early, and ensures that the project's extensive test suite provides actual reliability guarantees, which is fundamental for production readiness and building trust.

2.  **Implement Database-Level Multi-tenancy Isolation (High Impact on Security & Scalability):**
    *   **Action:** Prioritize the implementation of Row-Level Security (RLS) in PostgreSQL, or a schema-per-tenant approach, to enforce strict data isolation between tenants. Update SQLAlchemy models and query patterns to leverage RLS.
    *   **Justification:** The current metadata-based filtering carries a significant risk of data leakage, which is unacceptable for a multi-tenant SaaS. RLS provides a robust, database-enforced security layer, critical for customer trust and compliance, and lays the groundwork for secure scaling.

3.  **Enhance LLM Cost Optimization & Observability (High Impact on Monetization & Cost Control):**
    *   **Action:** Fully implement and integrate the LLM-specific metrics outlined in `packages/orchestrator/tool_metrics.py` and the `LLM Observability` phase in `docs/21DAY_SCHEDULE.md`. This includes detailed tracking of Time to First Token (TTFT), token throughput, and granular cost per request (`ragline_llm_request_cost_usd`).
    *   **Justification:** With AI features being a core offering, precise cost tracking is essential to make informed pricing decisions, optimize model usage, and prevent unexpected API costs. Enhanced observability provides the necessary insights to continuously improve AI performance and profitability.
