# Revelio
### Your real-time conversation intelligence layer

Revelio is a real-time AI copilot that listens to your conversations and surfaces exactly the right suggestion at the right moment. It transcribes your mic audio live, analyzes what is being said, and generates three contextual suggestions every 30 seconds: questions to ask, talking points, fact-checks, answers, or clarifications. Clicking any suggestion opens a detailed chat response grounded in the full conversation context.

---

## Live Demo

| | URL |
|---|---|
| Frontend | https://revelio-iota.vercel.app |
| Backend | https://revelio-d4r4.onrender.com |

---

## Quick Start

### Prerequisites
- Node.js v20.19 or higher
- Python 3.11 or higher
- A Groq API key from [console.groq.com](https://console.groq.com)

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env      # fill in your GROQ_API_KEY
uvicorn app.main:app --reload --port 8000
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.local   # set VITE_API_URL=http://localhost:8000
npm run dev
```

Open [http://localhost:5173](http://localhost:5173), paste your Groq API key in Settings, click the mic, and start talking.

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite + TypeScript + Tailwind CSS |
| State | Zustand (4 slices: transcript, suggestions, chat, settings) |
| Backend | Python FastAPI + Uvicorn |
| Transcription | Groq - Whisper Large V3 |
| Intelligence | Groq - GPT-OSS 120B (suggestions + chat) |
| Frontend Deploy | Vercel |
| Backend Deploy | Render |
| Font | Outfit (Google Fonts) |

---

## How It Works

Revelio has three panels:

**1. Mic and Transcript (left / Transcript tab on mobile)**
Audio is captured via the browser MediaRecorder API and chunked every 30 seconds. Each chunk is sent to the FastAPI backend which calls Groq Whisper Large V3 for transcription. The transcript appends in real time with timestamps and auto-scrolls.

**2. Live Suggestions (middle / Suggestions tab on mobile)**
Every time a new transcript chunk arrives, Revelio sends the recent transcript context to Groq GPT-OSS 120B and generates exactly 3 suggestion cards. Each card has a type label (QUESTION TO ASK, TALKING POINT, ANSWER, FACT CHECK, or CLARIFICATION), a title, and a preview that is useful on its own without clicking. New batches stack on top, older ones fade below. Manual refresh is also available.

**3. Chat (right / Chat tab on mobile)**
Clicking a suggestion sends the card title as a clean message to the chat panel with the full transcript and card context passed to the backend. Responses stream token by token using Server-Sent Events. Users can also type questions directly. One continuous chat session per use, no login required.

---

## Prompt Strategy

### Live Suggestions
The suggestion prompt receives the last N words of transcript (default 400, configurable in Settings) and is instructed to identify the single most useful thing to surface right now. The model chooses suggestion types based on context:

- If a question was just asked, it surfaces an ANSWER
- If a claim was made, it considers a FACT CHECK
- If a topic just shifted, it surfaces a TALKING POINT
- If something was unclear, it surfaces a CLARIFICATION
- If the conversation needs to go deeper, it surfaces a QUESTION TO ASK

The three cards can be a mix of types. The model is explicitly instructed not to always return the same mix -- it reads the context and picks what is most useful right now. Each preview is written to deliver value without requiring a click.

### Detailed Chat Answers
The chat prompt receives the full transcript (not just recent context) plus the user message and optional card context. The model is instructed to give a concise, grounded answer that directly references what was said in the conversation. Responses are 3-5 sentences maximum unless a list is genuinely needed.

### Context Window Defaults

| Setting | Default |
|---|---|
| Suggestion context | 400 words of recent transcript |
| Chat context | Full transcript |
| Suggestion max tokens | 600 |
| Chat max tokens | 1000 |

All settings are editable in the Settings panel without touching code.

---

## Security

- Every API request requires a Groq API key passed from the frontend via the `X-Groq-API-Key` header
- The backend never falls back to the environment key for user requests
- Missing key returns a 401 immediately
- Invalid key triggers a blocking error modal on the frontend and auto-stops the mic
- No API keys are hardcoded anywhere in the codebase

---

## Project Structure

```
revelio/
├── backend/
│   └── app/
│       ├── api/
│       │   ├── routes/        # health, transcribe, suggestions, chat
│       │   └── schemas/       # Pydantic request/response models
│       ├── core/              # config and env vars
│       ├── services/          # all Groq API calls
│       └── utils/
│           └── prompt_builder.py   # all prompt construction in one place
└── frontend/
    └── src/
        ├── components/        # transcript, suggestions, chat, settings, shared
        ├── store/             # 4 Zustand slices
        ├── hooks/             # useMic, useSuggestions, useChat, useWindowSize
        ├── services/          # api.ts: single file for all backend calls
        └── pages/             # Landing.tsx: main layout (desktop + mobile)
```

---

## Environment Variables

### Backend `.env`

| Variable | Description |
|---|---|
| `GROQ_API_KEY` | Your Groq API key (used for local dev only, not for user requests) |
| `ALLOWED_ORIGINS` | Comma-separated allowed frontend origins |

### Frontend `.env.local`

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend URL (http://localhost:8000 for local) |

---

## Tradeoffs

**Chunked transcription vs word-by-word**
Whisper works on complete audio segments. 30 second chunks give high accuracy at the cost of a slight lag. Real-time word-by-word streaming would require a different STT model and significantly more complexity. The tradeoff is intentional -- suggestion quality depends on having complete sentences to analyze.

**Suggestions trigger on chunk arrival, not on a fixed timer**
Rather than refreshing on a fixed 30 second timer regardless of whether new content exists, suggestions trigger when a new transcript chunk arrives. This means suggestions are always grounded in new information and never redundantly re-analyze the same content.

**SSE instead of WebSockets for chat streaming**
Server-Sent Events from FastAPI are simpler to implement and sufficient for single-direction streaming (server to client). WebSockets would add complexity with no benefit for this use case.

**No database**
Session-only by design. The Export button covers the archival use case and produces a clean JSON file with full session data for review.

**Groq-only**
Both models are locked to Groq per the project spec. The service layer is abstracted so swapping providers in the future requires only changing the service files, not the routes or prompts.

**Desktop-first, mobile-responsive**
The primary experience is the 3-column desktop layout. On screens below 1024px, the layout switches to a tab-based single-panel view with a bottom navigation bar and badges for new suggestions and chat messages.

**Card context passed separately from user message**
When a suggestion card is clicked, only the card title is shown as the user message in chat. The full card preview is passed to the backend as separate context. This keeps the chat readable while preserving response quality.

---

## Export

The Export button downloads a complete session JSON:

```json
{
  "exportedAt": "2026-04-17T01:19:37.776Z",
  "transcript": [
    { "timestamp": "9:18:44 PM", "text": "..." }
  ],
  "suggestionBatches": [
    {
      "timestamp": "9:18:45 PM",
      "cards": [
        { "type": "ANSWER", "title": "...", "preview": "..." }
      ]
    }
  ],
  "chat": [
    { "timestamp": "9:18:51 PM", "role": "user", "content": "..." },
    { "timestamp": "9:18:51 PM", "role": "assistant", "content": "..." }
  ]
}
```

---

## Development Pipeline

Built across 9 phases:

| Phase | Description |
|---|---|
| Phase 0 | Setup and prerequisites |
| Phase 1 | Project scaffolding and health check |
| Phase 2 | Mic capture and Whisper transcription |
| Phase 3 | Live suggestion generation and prompt engineering |
| Phase 4 | Streaming chat with transcript context |
| Phase 5 | Settings panel and session export |
| Phase 6 | UI redesign, polish, error handling, and deployment |
| Phase 7 | Chat UX improvements -- clean suggestion click messages |
| Phase 8 | Mobile responsive layout with tab navigation |

---

## License

Personal project. Not for redistribution.