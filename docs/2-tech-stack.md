# Revelio
### Your real-time conversation intelligence layer
**Finalized Tech Stack**

---

## Stack at a Glance

| Layer | Technology | Reason |
|---|---|---|
| Frontend Framework | React + Vite | Fast HMR, lightweight, TypeScript support out of the box |
| Styling | Tailwind CSS | Utility-first, fast to build dark UI, no custom CSS overhead |
| State Management | Zustand | Minimal boilerplate, perfect for 4 independent slices (transcript, suggestions, chat, settings) |
| Backend Framework | Python FastAPI | Async-first, automatic OpenAPI docs, fast to build typed endpoints |
| Transcription | Groq - Whisper Large V3 | Fastest available Whisper inference, required by spec |
| Suggestions + Chat | Groq - GPT-OSS 120B | Required by spec, ensures fair prompt comparison |
| Frontend Deploy | Vercel | Zero-config Vite deployment, free tier sufficient |
| Backend Deploy | Render | Simple FastAPI deploy, free tier with auto-sleep |
| Language (Frontend) | TypeScript | Type safety across stores, API calls, and component props |
| HTTP Client | Axios | Interceptors for API key injection, cleaner than raw fetch |

---

## Frontend Details

### React + Vite
Vite gives us near-instant dev server startup and HMR. React is the right choice for this component-heavy three-column layout where each panel has independent state and lifecycle.

### Zustand Store Slices
We split state into four independent Zustand stores to keep concerns clean:

- `transcriptStore` -- holds all transcript chunks with timestamps
- `suggestionsStore` -- holds suggestion batches, each batch is an array of 3 cards
- `chatStore` -- holds the full chat message history for the session
- `settingsStore` -- holds API key, prompts, and context window config, persisted to localStorage

### Key Frontend Libraries

| Library | Purpose |
|---|---|
| axios | HTTP client with request interceptors |
| zustand | State management |
| react-markdown | Render markdown in chat responses |
| lucide-react | Icon set for mic, refresh, send buttons |

---

## Backend Details

### FastAPI
FastAPI gives us async endpoints, automatic request/response validation via Pydantic, and built-in CORS support. Each route maps cleanly to one concern: transcribe, suggest, or chat.

### Service Layer
Business logic lives in `services/`, not in routes. Routes only handle HTTP concerns. This keeps the code testable and the prompt logic easy to iterate on independently.

### Key Backend Libraries

| Library | Purpose |
|---|---|
| fastapi | Web framework |
| uvicorn | ASGI server |
| groq | Official Groq Python SDK |
| python-multipart | Audio file upload handling |
| pydantic | Request/response schema validation |
| python-dotenv | Environment variable loading |

---

## API Design

| Endpoint | Purpose |
|---|---|
| `POST /transcribe` | Accepts audio blob, returns transcript text via Whisper |
| `POST /suggestions` | Accepts recent transcript, returns 3 suggestion cards |
| `POST /chat` | Accepts message + full transcript, returns streamed response |
| `GET /health` | Health check for deploy monitoring |

---

## What We Intentionally Excluded

- **Database or persistent storage** -- session only, no login needed
- **Redis / message queues** -- overkill for single-user session tool
- **WebSockets for streaming** -- SSE from FastAPI is simpler and sufficient
- **Docker** -- Render handles deployment natively, no containerization needed for this scale
