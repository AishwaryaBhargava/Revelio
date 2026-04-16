# Revelio
### Your real-time conversation intelligence layer
**Project Folder Structure**

---

## Full Directory Tree

```
revelio/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── routes/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── health.py              # GET /health
│   │   │   │   ├── transcribe.py          # POST /transcribe
│   │   │   │   ├── suggestions.py         # POST /suggestions
│   │   │   │   └── chat.py                # POST /chat (streaming)
│   │   │   ├── schemas/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── transcribe.py          # TranscribeRequest, TranscribeResponse
│   │   │   │   ├── suggestions.py         # SuggestionCard, SuggestionsResponse
│   │   │   │   └── chat.py                # ChatMessage, ChatRequest
│   │   │   └── __init__.py
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   └── config.py                  # Env vars, model names, defaults
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── groq_client.py             # Shared Groq SDK instance
│   │   │   ├── transcription.py           # Whisper call logic
│   │   │   ├── suggestions.py             # Suggestion prompt + Groq call
│   │   │   └── chat.py                    # Chat prompt + streaming call
│   │   ├── utils/
│   │   │   ├── __init__.py
│   │   │   └── prompt_builder.py          # Builds prompts from transcript context
│   │   ├── data/
│   │   │   └── __init__.py
│   │   ├── models/
│   │   │   └── __init__.py
│   │   ├── tests/
│   │   │   └── __init__.py
│   │   ├── main.py                        # App entry, CORS, router registration
│   │   └── __init__.py
│   ├── .env                               # Local secrets (gitignored)
│   ├── .env.example                       # Template with placeholder values
│   ├── .gitignore
│   └── requirements.txt
├── frontend/
│   ├── public/
│   │   └── dummy.txt
│   ├── src/
│   │   ├── assets/
│   │   │   └── dummy.txt
│   │   ├── components/
│   │   │   ├── transcript/
│   │   │   │   ├── TranscriptPanel.tsx    # Left column wrapper
│   │   │   │   ├── MicButton.tsx          # Start/stop mic control
│   │   │   │   └── TranscriptFeed.tsx     # Scrolling transcript lines
│   │   │   ├── suggestions/
│   │   │   │   ├── SuggestionsPanel.tsx   # Middle column wrapper
│   │   │   │   ├── SuggestionBatch.tsx    # Group of 3 suggestion cards
│   │   │   │   └── SuggestionCard.tsx     # Card with type label + preview
│   │   │   ├── chat/
│   │   │   │   ├── ChatPanel.tsx          # Right column wrapper
│   │   │   │   ├── ChatMessage.tsx        # Single message bubble
│   │   │   │   └── ChatInput.tsx          # Text input + send button
│   │   │   └── settings/
│   │   │       ├── SettingsModal.tsx      # Full-screen settings overlay
│   │   │       └── SettingsForm.tsx       # API key + editable prompt fields
│   │   ├── store/
│   │   │   ├── transcriptStore.ts         # Zustand: transcript chunks
│   │   │   ├── suggestionsStore.ts        # Zustand: suggestion batches
│   │   │   ├── chatStore.ts               # Zustand: chat history
│   │   │   └── settingsStore.ts           # Zustand: API key, prompts, config
│   │   ├── hooks/
│   │   │   ├── useMic.ts                  # MediaRecorder logic + chunking
│   │   │   ├── useSuggestions.ts          # Auto-refresh + manual refresh
│   │   │   └── useChat.ts                 # Send message, handle streaming
│   │   ├── services/
│   │   │   └── api.ts                     # Axios instance + all API calls
│   │   ├── pages/
│   │   │   └── Landing.tsx                # Main page with 3-column layout
│   │   ├── sections/
│   │   │   └── dummy.txt
│   │   ├── styles/
│   │   │   └── global.css
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
├── .env.example
├── .gitignore
└── README.md
```

---

## Key Design Decisions

### Backend: services/ mirrors routes/
Each route file has a corresponding service file. Routes handle HTTP only. Services own the business logic. This makes it easy to swap or iterate on prompt logic without touching the API layer.

### Backend: prompt_builder.py is isolated
All prompt construction lives in one utility file. This is the most iterated-on code in the whole project (prompt engineering is the core challenge), so keeping it isolated makes iteration fast and clean.

### Frontend: store/ is flat, one file per domain
Four Zustand stores, each owning one slice of state: transcript, suggestions, chat, settings. No nested stores, no cross-store subscriptions. Clean boundaries.

### Frontend: hooks/ owns all side effects
MediaRecorder logic, auto-refresh timers, and streaming chat responses all live in custom hooks. Components stay purely presentational.

### Frontend: services/api.ts is the single network layer
All Axios calls go through one file. The API key from `settingsStore` is injected via a request interceptor. No component or hook talks to the network directly.
