**REVELIO**

*Your real-time conversation intelligence layer*

**README**

# **What is Revelio?**

Revelio is a real-time AI copilot that listens to your conversations and surfaces exactly the right suggestion at the right moment. It transcribes your mic audio live, analyzes what is being said, and generates three contextual suggestions every 30 seconds: questions to ask, talking points, fact-checks, answers, or clarifications. Clicking any suggestion opens a detailed chat response grounded in the full conversation context.

# **Quick Start**

## **Prerequisites**

- Node.js v18 or higher

- Python 3.11 or higher

- A Groq API key from console.groq.com

## **Backend Setup**

- cd backend

- python -m venv venv && source venv/bin/activate

- pip install -r requirements.txt

- cp .env.example .env and fill in your values

- uvicorn app.main:app --reload --port 8000

## **Frontend Setup**

- cd frontend

- npm install

- cp .env.example .env.local and set VITE_API_URL=http://localhost:8000

- npm run dev

Open http://localhost:5173, paste your Groq API key in Settings, click the mic, and start talking.

# **Stack**

| Frontend | React + Vite + TypeScript + Tailwind CSS |
| --- | --- |
| State | Zustand (4 slices: transcript, suggestions, chat, settings) |
| Backend | Python FastAPI + Uvicorn |
| Transcription | Groq - Whisper Large V3 |
| Intelligence | Groq - GPT-OSS 120B (suggestions + chat) |
| Frontend Deploy | Vercel |
| Backend Deploy | Render |

# **Prompt Strategy**

## **Live Suggestions**

The suggestion prompt receives the last N words of transcript (configurable, default 400 words) and is instructed to identify the single most useful thing to surface right now. The model chooses the suggestion type based on context: if a question was just asked, it surfaces an answer; if a claim was made, it considers a fact-check; if a topic just shifted, it surfaces a relevant talking point. The three cards can be a mix of types. Each card has a short preview that already delivers value without clicking.

## **Detailed Chat Answers**

When a suggestion is clicked or a message is typed, the chat prompt receives the full transcript as context plus the user message. The model is instructed to give a thorough, grounded answer that directly references what was said in the conversation. This keeps answers relevant rather than generic.

## **Context Window Defaults**

| Suggestion context | 400 words of recent transcript |
| --- | --- |
| Chat context | Full transcript (no truncation) |
| Suggestion max tokens | 600 |
| Chat max tokens | 1000 |

All of these are editable in the Settings panel without touching code.

# **Project Structure**

See the Project Folder Structure document for the full annotated tree. The short version:

- backend/app/services/ -- all Groq API calls and prompt logic

- backend/app/utils/prompt_builder.py -- all prompt construction in one place

- frontend/src/store/ -- four Zustand slices, one per concern

- frontend/src/hooks/ -- mic, suggestions refresh, and chat streaming

- frontend/src/services/api.ts -- single file for all backend calls

# **Environment Variables**

## **Backend (.env)**

| GROQ_API_KEY | Your Groq API key (can also be set per-user in the UI) |
| --- | --- |
| ALLOWED_ORIGINS | Comma-separated list of allowed frontend origins |

## **Frontend (.env.local)**

| VITE_API_URL | Backend URL (http://localhost:8000 for local, Render URL for prod) |
| --- | --- |

# **Tradeoffs**

- Chunked transcription vs word-by-word: Whisper works on complete audio segments, not streams. 30s chunks give high accuracy at the cost of slight lag. This is acceptable for suggestion quality.

- No WebSocket for streaming: SSE from FastAPI is simpler to implement and sufficient for single-user chat streaming.

- No database: Session-only by design. Export covers the archival use case.

- Groq-only: Both models are locked to Groq per spec. The service layer is abstracted so swapping providers later requires only changing the service files.

# **Export**

The Export button downloads a JSON file with the full session:

- All transcript chunks with timestamps

- All suggestion batches with timestamps and card types

- Full chat history with timestamps

# **License**

Personal project. Not for redistribution.
