# llm-evals-poc — Architecture Analysis

_Analyzed: 2026-03-01T02:24:11.194201_
_Files: 17 | Tokens: ~2,547_

## 1. Architecture Overview

This project is a Proof-of-Concept (PoC) for an LLM-powered Question-Answering (Q&A) system utilizing Retrieval-Augmented Generation (RAG). It provides a REST API endpoint to answer natural language queries by retrieving relevant information from a PostgreSQL `pgvector` database and feeding it to an OpenAI LLM.

**Main tech stack:**
*   **Backend Framework:** FastAPI, Uvicorn
*   **Database:** PostgreSQL with `pgvector` extension (Docker image `ankane/pgvector`)
*   **LLM & Embeddings:** OpenAI API
*   **Data Models:** Pydantic
*   **Utilities:** NumPy, scikit-learn, python-dotenv
*   **Database Driver:** Psycopg

**Architecture pattern:**
The project follows a **Monolithic Application** pattern, specifically a RESTful API backend, augmented with a **RAG (Retrieval-Augmented Generation)** pattern for LLM interaction. It's designed as a standalone service interacting with external LLM APIs and a dedicated vector database.

**Key entry points:**
*   **API:** `app/main.py` exposes the `/ask` endpoint via Uvicorn (`uvicorn app.main:app --reload`).
*   **Data Seeding:** `scripts/seed_embeddings.py` populates embeddings in the database.
*   **Evaluations:** `scripts/eval_retrieval.py`, `scripts/eval_qa.py`, `scripts/eval_faithfulness.py` for RAG component performance assessment.

## 2. Code Quality Assessment (1-10 scale)

*   **Code organization: 7/10**
    *   The project structure (`app/`, `retriever/`, `scripts/`, `tests/`) is logical and clean for a PoC. Modules within these directories (e.g., `llm.py`, `prompting.py`, `pgstore.py`) have clear responsibilities. `__init__.py` files are present.
    *   Could benefit from a `config/` module for constants like LLM model names, `k` values, etc., currently spread across files (e.g., `app/llm.py`, `retriever/pgstore.py`).
*   **Error handling: 4/10**
    *   `app/llm.py` and `retriever/embeddings.py` use broad `except Exception:` blocks, which swallows specific error information and defaults to mock behavior. This is problematic for debugging and understanding failures in a production environment.
    *   Database connection in `retriever/pgstore.py` uses `psycopg.connect` with a `with` statement, which is good for resource management.
*   **Testing coverage: 2/10**
    *   Only `tests/test_contracts.py` exists, which validates Pydantic schemas. This ensures data contract integrity but provides no coverage for the core RAG logic, LLM interaction, database operations, or API endpoint functionality.
    *   The `scripts/eval_*.py` files are evaluation scripts, not unit or integration tests, although they do exercise parts of the system.
*   **Documentation quality: 6/10**
    *   `README.md` is excellent for quick setup and understanding the project's purpose and key commands.
    *   Inline code comments are minimal. Type hints are present in some functions (e.g., `app/schema.py`, `app/prompting.py`, `retriever/pgstore.py`), but inconsistently applied (e.g., `app/llm.py:chat_json` lacks them).
*   **Security practices: 5/10**
    *   Environment variables (`OPENAI_API_KEY`, `PG_DSN`, `USE_MOCKS`) are used for configuration, which is a good practice.
    *   `docker-compose.yml` hardcodes `POSTGRES_USER: postgres` and `POSTGRES_PASSWORD: postgres`. This is insecure for anything beyond local development.
    *   Broad `except Exception` blocks could mask potential security vulnerabilities (e.g., input sanitization failures).
    *   SQL queries in `retriever/pgstore.py` are generally safe, using parameterized queries (`%s`) and `psycopg.sql.Literal` for dynamic parts, mitigating direct SQL injection risks.
    *   No explicit authentication/authorization is implemented for the `/ask` endpoint, which is a significant gap for a production service.

## 3. Key Components

1.  **`app/main.py`**: The FastAPI application entry point. It defines the `/ask` API endpoint, orchestrating the entire RAG pipeline from query reception to returning an LLM-generated answer.
2.  **`app/llm.py`**: Handles interactions with the OpenAI Chat API. It includes a mock implementation for local development or when the API key is unavailable, and parses the JSON response from the LLM.
3.  **`app/prompting.py`**: Defines the system and user prompts used to instruct the LLM, including specific instructions for JSON output format and source citations.
4.  **`retriever/pgstore.py`**: Manages interaction with the PostgreSQL `pgvector` database. It handles storing and retrieving document embeddings, performing vector similarity search (`ORDER BY embedding <=> %s::vector`), and constructing the context block for the LLM.
5.  **`retriever/embeddings.py`**: Responsible for generating text embeddings using the OpenAI Embeddings API. Similar to `app/llm.py`, it includes a mock (hash-based) implementation.
6.  **`app/schema.py`**: Defines Pydantic models (`QAResponse`) for request/response validation, ensuring data consistency and clear API contracts.
7.  **`scripts/eval_*.py`**: A set of scripts (`eval_retrieval.py`, `eval_qa.py`, `eval_faithfulness.py`) used to evaluate different aspects of the RAG system's performance against a `gold.jsonl` dataset.
8.  **`scripts/seed_embeddings.py`**: A utility script to iterate through existing documents in the database, generate embeddings for their text content, and store these vectors back into the `docs` table.

## 4. Technical Debt & Issues

*   **Obvious bugs, anti-patterns, or risks:**
    *   **Anti-pattern:** Broad `except Exception:` blocks in `app/llm.py` and `retriever/embeddings.py` hide critical errors, making debugging difficult and potentially masking deeper issues. They also directly fall back to mock behavior, which might not be desired for all failure modes.
    *   **Risk:** `docker-compose.yml` hardcoding PostgreSQL credentials (`POSTGRES_USER: postgres`, `POSTGRES_PASSWORD: postgres`). This is a critical security vulnerability if used in any non-development environment.
    *   **Risk:** Lack of input validation/sanitization beyond Pydantic schema validation for the `q` parameter in `app/main.py`. While FastAPI/Pydantic handle basic types, malicious input in the query string could potentially exploit LLM vulnerabilities (prompt injection, although the system prompt aims to mitigate this).
*   **Missing tests or documentation:**
    *   **Tests:** Core RAG logic (retrieval, context building, LLM interaction) is untested. Critical components like `app/llm.py`, `retriever/pgstore.py`, `retriever/embeddings.py`, and `app/main.py` require dedicated unit and integration tests.
    *   **Documentation:** Lack of comprehensive docstrings for functions and modules, especially for complex logic or design decisions. Type hints are inconsistent.
*   **Hardcoded values or secrets:**
    *   `POSTGRES_USER` and `POSTGRES_PASSWORD` in `docker-compose.yml`.
    *   LLM model names (`gpt-4o-mini`, `text-embedding-3-small`) are hardcoded in `app/llm.py` and `retriever/embeddings.py`.
    *   Magic numbers like `k=8`, `probes=10` in `retriever/pgstore.py` are hardcoded and could be configurable.

## 5. Revenue/Monetization Potential

**Can this project generate income? How?**
Yes, this project has significant monetization potential as a foundation for a customizable RAG-based Q&A system. It can generate income through:
1.  **SaaS Offering:** Hosting the service and providing it to businesses as a white-label solution or a managed Q&A platform for their internal documents/knowledge bases.
2.  **API Monetization:** Offering the Q&A functionality as a paid API service, where other applications can integrate and pay per query or per usage tier.
3.  **Consulting/Customization:** Using this PoC as a starting point for building bespoke RAG solutions for clients with specific data sources, LLM requirements, or compliance needs.

**What's missing to make it production-ready for revenue?**
1.  **Scalability & Performance:**
    *   **Caching:** Caching of embeddings, LLM responses, or popular queries.
    *   **Asynchronous Processing:** If query volume increases, current synchronous processing might become a bottleneck.
    *   **Horizontal Scaling:** Strategies for running multiple FastAPI instances and scaling the PostgreSQL database.
2.  **Robust Multi-Tenancy:** While `tenant_id` is passed, true isolation (e.g., separate schemas, row-level security, separate indices in `pgvector`) needs to be rigorously implemented and tested to ensure data privacy for different customers.
3.  **Security & Compliance:**
    *   **Authentication & Authorization:** Secure user authentication (e.g., JWT, API keys) for the `/ask` endpoint and robust role-based access control.
    *   **Data Encryption:** Encryption at rest and in transit (HTTPS, encrypted DB volumes).
    *   **Audit Logging:** Comprehensive logging of API access and data operations.
4.  **Observability:**
    *   **Comprehensive Logging:** Structured logging with appropriate log levels for diagnostics.
    *   **Monitoring & Alerting:** Integration with monitoring tools (e.g., Prometheus, Grafana) to track API performance, LLM usage, database health, and error rates.
    *   **Tracing:** Distributed tracing for understanding request flow through the system.
5.  **Admin & Data Ingestion Interface:**
    *   A user-friendly interface or API endpoints for clients to upload, manage, and delete their documents, trigger re-embeddings, and configure RAG parameters.
    *   Robust error handling and validation for data ingestion.
6.  **Cost Management:** Strategies to optimize LLM API usage (e.g., batching, token usage monitoring, prompt engineering for efficiency) and database resource allocation.
7.  **Deployment & Operations:** CI/CD pipelines, container orchestration (Kubernetes), infrastructure as code (Terraform), and robust backup/restore procedures.

## 6. Integration Opportunities

**How could this project connect with other projects in the portfolio?**
*   **Knowledge Management Systems:** Integrate with internal or client-facing knowledge bases (e.g., Confluence, SharePoint, Notion, custom CMS) to automatically ingest and update documents for the RAG system via the seeding scripts (or a dedicated ingestion service).
*   **Customer Support Platforms:** Embed the `/ask` API into CRM systems (e.g., Salesforce, Zendesk) or internal helpdesk tools to provide immediate answers to agents, improving resolution times.
*   **Enterprise Search:** Enhance existing enterprise search solutions by providing natural language Q&A capabilities on top of structured and unstructured data.
*   **Data Lakes/Warehouses:** Ingest documents stored in data lakes (e.g., S3, Google Cloud Storage) for processing and embedding.
*   **Reporting & Analytics:** Feed the evaluation results from `scripts/eval_*.py` into central data analytics platforms for tracking and improving model performance over time.

**What APIs or services does it expose/consume?**
*   **Exposes:** A RESTful HTTP API `/ask` (defined in `app/main.py`).
*   **Consumes:**
    *   **OpenAI API:** For generating embeddings (`retriever/embeddings.py`) and for chat completions (`app/llm.py`).
    *   **PostgreSQL with `pgvector`:** As its primary data store for documents and their vector embeddings (`retriever/pgstore.py`).
    *   **Environment Variables:** Leverages `python-dotenv` and `os.getenv` for configuration (API keys, DB connection string, mock flags).

## 7. Recommended Next Steps (top 3)

1.  **Implement Robust Error Handling and Logging (Priority: High):**
    *   Replace generic `except Exception:` blocks in `app/llm.py` and `retriever/embeddings.py` with specific exception types (e.g., `openai.APIError`, `psycopg.Error`).
    *   Implement structured logging (e.g., `loguru` or Python's `logging` module with a JSON formatter) across the application, capturing relevant context (e.g., request IDs, tenant IDs, LLM response details, latency). This is critical for debugging, monitoring, and operational stability.
2.  **Expand Comprehensive Test Coverage (Priority: High):**
    *   Develop unit tests for core modules: `app/llm.py` (mocking OpenAI calls), `app/prompting.py`, `retriever/embeddings.py` (mocking OpenAI calls), and `retriever/pgstore.py` (mocking `psycopg` or using a test database/fixtures).
    *   Create integration tests for the `/ask` API endpoint in `app/main.py`, ensuring the full RAG pipeline functions correctly with mocked external services. This will greatly improve code reliability and maintainability.
3.  **Enhance Security Posture & Configuration Management (Priority: High):**
    *   **Remove Hardcoded Secrets:** Eliminate hardcoded PostgreSQL credentials from `docker-compose.yml`. Use environment variables or a secrets management solution for production deployments.
    *   **Implement Authentication/Authorization:** Add an authentication layer (e.g., API key-based or OAuth2) to the `/ask` endpoint to control access.
    *   **Centralize Configuration:** Move hardcoded values like LLM model names, `k` values, and `probes` to a central configuration file or environment variables, allowing easier adjustment without code changes.
