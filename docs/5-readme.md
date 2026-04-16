# Revelio
### Your real-time conversation intelligence layer

---

## What is Revelio?

Revelio is a real-time AI copilot that listens to your conversations and surfaces exactly the right suggestion at the right moment. It transcribes your mic audio live, analyzes what is being said, and generates three contextual suggestions every 30 seconds: questions to ask, talking points, fact-checks, answers, or clarifications. Clicking any suggestion opens a detailed chat response grounded in the full conversation context.

---

## Quick Start

### Prerequisites
- Node.js v18 or higher
- Python 3.11 or higher
- A Groq API key from [console.groq.com](https://console.groq.com)

### Backend Setup
1. `cd backend`
2. `python -m venv venv && source venv/bin/activate` (Windows: `venv\Scripts\activate`)
3. `pip install -r requirements.txt`
4. `cp .env.example .env` and fill in your values
5. `uvicorn app.main:app --reload --port 8000`

### Frontend Setup
1. `cd frontend`
2. `npm install`
3. `cp .env.example .env.local` and set `VITE_API_URL=http://localhost:8000`
4. `npm run dev`

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

---

## Prompt Strategy

### Live Suggestions
The suggestion prompt receives the last N words of transcript (configurable, default 400 words) and is instructed to identify the single most useful thing to surface right now. The model chooses the suggestion type based on context: if a question was just asked, it surfaces an answer; if a claim was made, it considers a fact-check; if a topic just shifted, it surfaces a relevant talking point. The three cards can be a mix of types. Each card has a short preview that already delivers value without clicking.

### Detailed Chat Answers
When a suggestion is clicked or a message is typed, the chat prompt receives the full transcript as context plus the user message. The model is instructed to give a thorough, grounded answer that directly references what was said in the conversation. This keeps answers relevant rather than generic.

### Context Window Defaults

| Setting | Default |
|---|---|
| Suggestion context | 400 words of recent transcript |
| Chat context | Full transcript (no truncation) |
| Suggestion max tokens | 600 |
| Chat max tokens | 1000 |

All of these are editable in the Settings panel without touching code.

---

## Project Structure

```
revelio/
├── backend/app/
│   ├── api/routes/       # HTTP endpoints (transcribe, suggestions, chat, health)
│   ├── api/schemas/      # Pydantic request/response models
│   ├── core/             # Config and env vars
│   ├── services/         # All Groq API calls and prompt logic
│   └── utils/            # prompt_builder.py lives here
└── frontend/src/
    ├── components/       # UI components per panel (transcript, suggestions, chat, settings)
    ├── store/            # Four Zustand slices
    ├── hooks/            # useMic, useSuggestions, useChat
    ├── services/         # api.ts: single file for all backend calls
    └── pages/            # Landing.tsx: main 3-column layout
```

---

## Environment Variables

### Backend (.env)

| Variable | Description |
|---|---|
| `GROQ_API_KEY` | Your Groq API key (can also be set per-user in the UI) |
| `ALLOWED_ORIGINS` | Comma-separated list of allowed frontend origins |

### Frontend (.env.local)

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend URL (http://localhost:8000 for local, Render URL for prod) |

---

## Tradeoffs

- **Chunked transcription vs word-by-word:** Whisper works on complete audio segments, not streams. 30s chunks give high accuracy at the cost of slight lag. Acceptable for suggestion quality.
- **No WebSocket for streaming:** SSE from FastAPI is simpler to implement and sufficient for single-user chat streaming.
- **No database:** Session-only by design. Export covers the archival use case.
- **Groq-only:** Both models are locked to Groq per spec. The service layer is abstracted so swapping providers later requires only changing the service files.

---

## Export

The Export button downloads a JSON file with the full session:

```json
{
  "exportedAt": "2026-04-16T10:30:00Z",
  "transcript": [
    { "timestamp": "10:00:01", "text": "..." }
  ],
  "suggestionBatches": [
    {
      "timestamp": "10:00:30",
      "cards": [
        { "type": "QUESTION TO ASK", "title": "...", "preview": "..." }
      ]
    }
  ],
  "chat": [
    { "timestamp": "10:01:00", "role": "user", "content": "..." },
    { "timestamp": "10:01:03", "role": "assistant", "content": "..." }
  ]
}
```

---

## Live URLs

| | URL |
|---|---|
| Frontend | *(to be added after Phase 6 deploy)* |
| Backend | *(to be added after Phase 6 deploy)* |

---

## License

Personal project. Not for redistribution.
