# Revelio
### Your real-time conversation intelligence layer
**Project Development Pipeline — V1.0**

---

## Phase Summary

| Phase | Title |
|---|---|
| Phase 0 | Setup and Prerequisites |
| Phase 1 | Project Scaffolding |
| Phase 2 | Mic and Transcript |
| Phase 3 | Live Suggestions |
| Phase 4 | Chat |
| Phase 5 | Settings and Export |
| Phase 6 | Polish and Deploy |

> Each phase includes: Goal, What We Do (with checkboxes), Acceptance Criteria, Outcome, Notes / References, Testing, and Evaluation.

---

## Phase 0: Setup and Prerequisites

| | |
|---|---|
| **Phase** | 0 of 6 |
| **Estimated Effort** | 0.5 day |
| **Dependencies** | None |

### Goal:
Prepare the development environment, acquire all necessary credentials, and establish project structure so the team can begin building immediately with zero setup friction.

### What we do:

**Project Structure:**
- [ ] Create root folder `revelio/` with `backend/` and `frontend/` subdirectories
- [ ] Initialize git repository at root level
- [ ] Create `.gitignore` at root, backend, and frontend levels (ignore .env, node_modules, __pycache__, venv, .DS_Store)
- [ ] Create `.env` and `.env.example` files with placeholder values at all levels

**Credentials and Accounts:**
- [ ] Create Groq account at console.groq.com
- [ ] Generate and securely store Groq API key
- [ ] Create Vercel account (frontend deploy)
- [ ] Create Render account (backend deploy)

**Local Environment:**
- [ ] Verify Node.js v18+ is installed
- [ ] Verify Python 3.11+ and pip are installed
- [ ] Verify git is configured with correct user details

**Documentation:**
- [ ] Finalize and store all 5 project documents (Problem Statement, Tech Stack, Folder Structure, Pipeline, README)

### Acceptance Criteria:
- Root folder structure matches the finalized folder structure document exactly
- `.gitignore` files are in place and no secrets are committed
- `.env.example` files exist at root, backend, and frontend with all required variable names listed
- Groq API key is accessible and tested (able to make a test call)
- Git repo is initialized and has at least one commit

### Outcome:
A clean, ready-to-develop environment with all credentials in place and zero blockers for Phase 1.

### Notes / References:
- Never commit the actual `.env` file -- only `.env.example`
- Groq API key will later be entered by users via the Settings UI, but the developer needs one for local testing

### Testing:
- Verify git log shows initial commit with correct folder structure
- Verify `.env` files are listed in `.gitignore` and do not appear in `git status`
- Run a test Groq API call using the SDK to confirm the key is valid
- Confirm Vercel and Render accounts are accessible

### Evaluation:
- Zero secrets exposed in git history
- Any developer can clone the repo and follow the README to get running in under 10 minutes

---

## Phase 1: Project Scaffolding

| | |
|---|---|
| **Phase** | 1 of 6 |
| **Estimated Effort** | 1 day |
| **Dependencies** | Phase 0 complete |

### Goal:
Stand up a working frontend and backend skeleton with the full folder structure in place, routing configured, CORS enabled, and a verified end-to-end connection between frontend and backend.

### What we do:

**Frontend:**
- [ ] Initialize React + Vite + TypeScript project using `npm create vite@latest` inside `frontend/`
- [ ] Install and configure Tailwind CSS with `tailwind.config.js` and `global.css`
- [ ] Install dependencies: zustand, axios, lucide-react, react-markdown
- [ ] Create Zustand store skeleton files: `transcriptStore.ts`, `suggestionsStore.ts`, `chatStore.ts`, `settingsStore.ts`
- [ ] Create placeholder component files for all components defined in folder structure (empty shells)
- [ ] Create `services/api.ts` with Axios instance (base URL from `VITE_API_URL` env var)
- [ ] Build `Landing.tsx` with static 3-column layout (no logic, just structure and labels)
- [ ] Verify frontend runs locally on http://localhost:5173

**Backend:**
- [ ] Create Python virtual environment inside `backend/`
- [ ] Install dependencies: fastapi, uvicorn, groq, python-multipart, pydantic, python-dotenv
- [ ] Generate `requirements.txt`
- [ ] Implement `main.py` with FastAPI app, CORS middleware (allow frontend origin), and router registration
- [ ] Implement `GET /health` route returning `{ "status": "ok" }`
- [ ] Create all route, schema, service, and utility files as empty skeletons matching folder structure
- [ ] Verify backend runs locally on http://localhost:8000

**Integration Verification:**
- [ ] Frontend calls `GET /health` and renders the response on screen
- [ ] Confirm CORS is correctly configured (no CORS errors in browser console)

### Acceptance Criteria:
- Frontend runs on localhost:5173 with 3-column layout visible
- Backend runs on localhost:8000 and `GET /health` returns `{ "status": "ok" }`
- Frontend successfully fetches `/health` and displays the result with no CORS errors
- All store skeleton files exist and export their initial state without errors
- All component, service, route, schema, and service files exist as skeletons (no logic yet, no import errors)
- Folder structure matches the finalized structure document exactly

### Outcome:
A complete skeleton application where both frontend and backend are running, connected, and ready for feature development.

### Notes / References:
- Do not add any business logic in this phase, skeletons only
- The 3-column layout does not need to be pixel-perfect yet, structure only

### Testing:
- Navigate to localhost:5173, confirm 3-column shell renders with no console errors
- `curl http://localhost:8000/health`, confirm response is `{ "status": "ok" }`
- Open browser dev tools Network tab, confirm `/health` call from frontend returns 200 with no CORS error
- Import each store file in a test component and confirm no TypeScript errors

### Evaluation:
- Zero import errors across all skeleton files
- Zero CORS errors in browser console
- A new developer can clone the repo, follow the README, and reach this state in under 15 minutes

---

## Phase 2: Mic and Transcript

| | |
|---|---|
| **Phase** | 2 of 6 |
| **Estimated Effort** | 1.5 days |
| **Dependencies** | Phase 1 complete, Groq API key available |

### Goal:
Implement live audio capture from the microphone, chunk the audio every 30 seconds, transcribe it using Groq Whisper Large V3, and display the growing transcript in the left column with auto-scroll.

### What we do:

**Frontend: useMic.ts Hook:**
- [ ] Request microphone permission using MediaRecorder API
- [ ] On start: begin recording audio stream
- [ ] Every 30 seconds: stop current chunk, send audio blob to `POST /transcribe`, start new chunk
- [ ] On stop: send any remaining audio as final chunk
- [ ] Expose state: `isRecording`, `error`, and `startMic` / `stopMic` functions
- [ ] Handle mic permission denied gracefully with a user-facing error message

**Frontend: Transcript UI:**
- [ ] `MicButton.tsx`: toggle button showing IDLE or RECORDING state with appropriate icon
- [ ] `TranscriptFeed.tsx`: renders transcript lines with timestamps, auto-scrolls to bottom on new chunk
- [ ] `TranscriptPanel.tsx`: wires MicButton and TranscriptFeed, connects to transcriptStore
- [ ] `transcriptStore.ts`: holds array of `{ timestamp, text }` objects, exposes `addChunk` action

**Backend: POST /transcribe:**
- [ ] Accept multipart audio file upload
- [ ] Validate file is present and not empty
- [ ] Call Groq Whisper Large V3 via `transcription.py` service
- [ ] Return `{ "text": "transcribed content" }`
- [ ] Handle Groq API errors and return appropriate HTTP error codes

**Frontend: api.ts:**
- [ ] Add `transcribeAudio(audioBlob)` function that POSTs to `/transcribe` as `multipart/form-data`
- [ ] Inject Groq API key from settingsStore into request headers

### Acceptance Criteria:
- Clicking the mic button starts recording; clicking again stops it
- Every 30 seconds while recording, a new transcript chunk appears in the left panel
- Transcript auto-scrolls to the latest line
- Each transcript line is prefixed with a timestamp
- Mic permission denied shows a clear error message to the user, does not crash
- `POST /transcribe` returns transcribed text for a valid audio file
- `POST /transcribe` returns a 400 error for an empty or missing audio file

### Outcome:
A fully working left column where the user can speak and see their words appear in real time as timestamped transcript chunks.

### Notes / References:
- Audio format: MediaRecorder defaults vary by browser. Use `audio/webm` for Chrome, `audio/ogg` for Firefox. Handle both or force webm.
- Whisper handles short chunks fine but needs at least a few seconds of audio to produce meaningful output
- Test with both short utterances and long continuous speech

### Testing:
- Start recording, speak for 30+ seconds, confirm a transcript chunk appears
- Speak across multiple 30-second intervals, confirm chunks accumulate and auto-scroll
- Stop recording mid-interval, confirm the remaining audio is still sent and transcribed
- Deny mic permission in browser, confirm error message appears and app does not crash
- POST a valid audio file to `/transcribe` directly, confirm text is returned
- POST an empty body to `/transcribe`, confirm 400 is returned

### Evaluation:
- Transcription accuracy is intelligible for clear speech in English
- Latency from end of chunk to text appearing on screen is under 5 seconds
- No audio data is lost between chunks during a continuous recording session
- Zero unhandled errors in browser console during a full record/stop cycle

---

## Phase 3: Live Suggestions

| | |
|---|---|
| **Phase** | 3 of 6 |
| **Estimated Effort** | 2 days (prompt engineering is the majority of this phase) |
| **Dependencies** | Phase 2 complete (transcript must be populating for suggestions to be meaningful) |

### Goal:
Generate exactly 3 contextually intelligent suggestion cards every 30 seconds based on recent transcript content, display them in the middle column with type labels, and auto-refresh on a timer with a manual refresh option.

### What we do:

**Backend: POST /suggestions:**
- [ ] Accept recent transcript text and context window size as input
- [ ] Build suggestion prompt in `prompt_builder.py` using transcript context
- [ ] Call Groq GPT-OSS 120B via `suggestions.py` service
- [ ] Return exactly 3 suggestion cards, each with: `type`, `title`, `preview`
- [ ] Suggestion types: `QUESTION TO ASK`, `TALKING POINT`, `ANSWER`, `FACT CHECK`, `CLARIFICATION`
- [ ] Handle empty or very short transcript gracefully (return a starter suggestion set)
- [ ] Handle Groq API errors and return appropriate HTTP error codes

**Prompt Engineering (core of this phase):**
- [ ] Define prompt that reads recent transcript and identifies the single most useful action right now
- [ ] Instruct model to vary suggestion types based on context (do not always return the same mix)
- [ ] Instruct model to make each preview useful on its own, not just a teaser
- [ ] Tune context window default (start with last 400 words of transcript)
- [ ] Tune max tokens for suggestions (start at 600)
- [ ] Test prompt across at least 3 different conversation types: technical discussion, casual conversation, Q&A
- [ ] Iterate until suggestions feel genuinely useful and well-timed

**Frontend: useSuggestions.ts Hook:**
- [ ] On mic start: begin 30-second auto-refresh timer for suggestions
- [ ] On each tick: call `POST /suggestions` with recent transcript context
- [ ] On manual refresh button click: immediately trigger a suggestions fetch
- [ ] Expose state: `batches`, `isLoading`, `lastRefreshedAt`, `refresh` function
- [ ] On mic stop: clear the auto-refresh timer

**Frontend: Suggestions UI:**
- [ ] `SuggestionCard.tsx`: displays type label, title, preview text. Full card is clickable.
- [ ] `SuggestionBatch.tsx`: renders a group of 3 cards for one refresh cycle
- [ ] `SuggestionsPanel.tsx`: stacks batches top-to-bottom, newest at top, older batches visually faded
- [ ] Add Reload Suggestions button with auto-refresh countdown display (e.g. "auto-refresh in 21s")
- [ ] `suggestionsStore.ts`: holds array of batches, each batch is `{ timestamp, cards: [] }`

**Frontend: api.ts:**
- [ ] Add `fetchSuggestions(recentTranscript, contextWindowWords)` function

### Acceptance Criteria:
- Every 30 seconds while recording, exactly 3 new suggestion cards appear at the top of the middle column
- Older batches remain visible below, visually faded
- Manual reload button triggers an immediate refresh
- Auto-refresh countdown is displayed and accurate
- Each card shows a type label (QUESTION TO ASK, TALKING POINT, ANSWER, FACT CHECK, or CLARIFICATION)
- Suggestion previews are useful on their own without needing to click
- Suggestion types vary based on what is being said in the transcript (not always the same 3 types)
- Empty transcript returns a graceful fallback (no crash, no empty cards)

### Outcome:
A working middle column that surfaces contextually intelligent, varied, and immediately useful suggestion cards in real time as the conversation progresses.

### Notes / References:
- This is the most important phase. Spend the time on the prompt.
- Test the prompt against: a technical architecture discussion, a sales call simulation, a Q&A session, and a casual conversation
- The preview text should answer "what should I do with this?" without requiring a click
- Context window of 400 words is a starting point, tune it based on quality vs latency

### Testing:
- Speak for 30 seconds about a technical topic, confirm suggestions are relevant and not generic
- Ask a question out loud, confirm at least one suggestion is an ANSWER type
- Make a factual claim, confirm at least one suggestion is a FACT CHECK type
- Click manual refresh mid-interval, confirm new suggestions appear immediately
- Confirm older batches persist below new batch and are visually distinct
- Test with empty transcript, confirm no crash and a graceful fallback
- POST directly to `/suggestions` with varied transcript samples, inspect suggestion quality

### Evaluation:
- Suggestions feel genuinely useful and well-timed for at least 3 different conversation types
- The right suggestion type appears for the right context (not random)
- Latency from refresh trigger to cards rendered is under 5 seconds
- Zero unhandled errors during a full session with multiple refresh cycles
- Prompt iterated until a developer using the app live says "that was actually helpful"

---

## Phase 4: Chat

| | |
|---|---|
| **Phase** | 4 of 6 |
| **Estimated Effort** | 1.5 days |
| **Dependencies** | Phase 3 complete (suggestion cards must be clickable) |

### Goal:
Implement the right column chat panel where clicking a suggestion sends it to a detailed answer endpoint with full transcript context, users can also type freely, and responses stream token by token.

### What we do:

**Backend: POST /chat:**
- [ ] Accept message text, full transcript context, and chat history as input
- [ ] Build detailed answer prompt in `prompt_builder.py` using full transcript
- [ ] Call Groq GPT-OSS 120B with streaming enabled via `chat.py` service
- [ ] Stream response tokens back to frontend using Server-Sent Events (SSE)
- [ ] Handle Groq API errors and stream a graceful error message

**Prompt Engineering:**
- [ ] Write detailed answer prompt that is grounded in the full transcript context
- [ ] Instruct model to reference specific things said in the conversation
- [ ] Keep tone helpful, direct, and substantive (not padded)
- [ ] Tune max tokens for chat (start at 1000)
- [ ] Test with suggestion-triggered messages and free-typed questions

**Frontend: useChat.ts Hook:**
- [ ] Send message to `POST /chat` with full transcript and chat history
- [ ] Handle SSE stream: append tokens to the current assistant message as they arrive
- [ ] Expose state: `messages`, `isStreaming`, `sendMessage` function
- [ ] When a suggestion card is clicked: auto-populate and submit the message

**Frontend: Chat UI:**
- [ ] `ChatMessage.tsx`: user bubble (right-aligned) and assistant bubble (left-aligned) with timestamps
- [ ] Render assistant messages with react-markdown for formatted responses
- [ ] Show a typing indicator while streaming is in progress
- [ ] `ChatInput.tsx`: text input field with Send button, submit on Enter key
- [ ] `ChatPanel.tsx`: scrollable message list, auto-scrolls to bottom on new message or token
- [ ] `chatStore.ts`: holds full message array `{ role, content, timestamp }`
- [ ] Add introductory placeholder text: "Click a suggestion or type a question below"

**Frontend: api.ts:**
- [ ] Add `sendChatMessage(message, transcript, history)` function with SSE stream handling

### Acceptance Criteria:
- Clicking a suggestion card sends it to the chat panel and a streaming response begins
- Users can type a question directly in the input and receive a streaming response
- Responses stream token by token, not all at once
- A typing indicator is visible while the response is streaming
- Chat history accumulates across the session (all messages visible)
- Chat responses reference the conversation transcript context, not generic answers
- Pressing Enter in the input field submits the message
- Chat panel auto-scrolls to the latest message

### Outcome:
A fully working right column where suggestion clicks and free-typed questions both produce detailed, transcript-grounded streaming answers, building a continuous chat history for the session.

### Notes / References:
- One continuous chat thread per session, no branching
- No login or persistence required, session only
- The full transcript should be passed as context on every chat message, not just recent chunks

### Testing:
- Click 3 different suggestion types, confirm each triggers a streaming chat response
- Type a custom question, confirm streaming response begins within 2 seconds
- Confirm chat history accumulates and all messages remain visible after multiple exchanges
- Confirm responses reference specific things said in the transcript
- Confirm typing indicator appears during streaming and disappears when done
- Confirm Enter key submits and does not add a newline
- Test with a very long transcript, confirm no timeout or truncation error

### Evaluation:
- Time from send to first streaming token is under 2 seconds
- Chat answers are substantive and grounded in the transcript, not generic
- Zero broken streams or incomplete responses during a full session
- User can hold a 10-message conversation without any errors or state issues

---

## Phase 5: Settings and Export

| | |
|---|---|
| **Phase** | 5 of 6 |
| **Estimated Effort** | 1 day |
| **Dependencies** | Phase 4 complete (all three panels must be working) |

### Goal:
Build the Settings panel where users enter their Groq API key and edit prompts and context window sizes, and an Export function that downloads the full session as a JSON file.

### What we do:

**Settings: Frontend:**
- [ ] `SettingsModal.tsx`: full-screen overlay accessible via a gear icon in the top bar
- [ ] `SettingsForm.tsx` with fields: Groq API Key (password input), Suggestion Prompt (textarea), Chat Prompt (textarea), Suggestion Context Window in words (number input), Chat Max Tokens (number input)
- [ ] All fields pre-filled with hardcoded optimal defaults from `settingsStore.ts`
- [ ] Save button writes all values to settingsStore and persists to localStorage
- [ ] Groq API key is injected into all outgoing Axios requests via a request interceptor in `api.ts`
- [ ] Settings button visible in the app header at all times

**Settings: Defaults (hardcoded in settingsStore.ts):**
- [ ] Suggestion context window: 400 words
- [ ] Chat max tokens: 1000
- [ ] Suggestion prompt: the final optimized prompt from Phase 3
- [ ] Chat prompt: the final optimized prompt from Phase 4

**Export:**
- [ ] Export button visible in app header at all times
- [ ] On click: serialize full session to JSON: `{ exportedAt, transcript: [], suggestionBatches: [], chat: [] }`
- [ ] Each transcript entry: `{ timestamp, text }`
- [ ] Each suggestion batch: `{ timestamp, cards: [{ type, title, preview }] }`
- [ ] Each chat message: `{ timestamp, role, content }`
- [ ] Trigger browser download of the JSON file named `revelio-session-[date].json`

### Acceptance Criteria:
- Settings modal opens and closes without losing app state
- All settings fields are pre-filled with the default values on first open
- Saving settings persists values across page reload (localStorage)
- Groq API key from settings is used in all API calls (not hardcoded anywhere)
- Prompt fields in settings are editable and the new prompts are used on next suggestion/chat call
- Export button downloads a valid JSON file with all three data types
- Exported JSON includes timestamps for every entry
- Exported file is named `revelio-session-[ISO date].json`

### Outcome:
A fully configurable app where the user can bring their own API key and tune prompts without touching code, plus a reliable export of the complete session for review.

### Notes / References:
- The settings prompts are the most valuable part of this phase for evaluators reviewing the export
- Do not hardcode any API key anywhere in the codebase, even for testing
- JSON export should be human-readable (pretty-printed with 2-space indent)

### Testing:
- Open settings, change the suggestion prompt, trigger a refresh, confirm the new prompt is used
- Open settings, save the API key, reload the page, confirm the key persists in the form
- Remove the API key from settings and try to fetch suggestions, confirm a clear error appears
- Click export after a full session, open the JSON file, confirm all three data types are present with timestamps
- Confirm exported JSON is valid (paste into a JSON validator)
- Edit context window size in settings, confirm the new value is sent in the next `/suggestions` request

### Evaluation:
- Zero hardcoded API keys anywhere in the codebase
- Settings changes take effect on the very next API call without requiring a page reload
- Exported JSON passes JSON validation with no errors
- A reviewer reading the exported session can reconstruct the full conversation and all suggestions without the app

---

## Phase 6: Polish and Deploy

| | |
|---|---|
| **Phase** | 6 of 6 |
| **Estimated Effort** | 1 day |
| **Dependencies** | Phases 0 through 5 complete |

### Goal:
Add loading states, error handling, and UX polish across the entire app, then deploy frontend to Vercel and backend to Render with verified end-to-end functionality on the live URLs.

### What we do:

**Error Handling:**
- [ ] Display a non-blocking toast or inline message on any API failure (transcription, suggestions, chat)
- [ ] Handle network timeout gracefully (retry once, then show error)
- [ ] Handle Groq rate limit errors with a user-facing message
- [ ] Handle missing API key: show a prompt to open settings instead of crashing

**Loading States:**
- [ ] Suggestion cards: show 3 skeleton card placeholders while a refresh is loading
- [ ] Chat: show typing indicator from the first token request until streaming ends
- [ ] Mic button: show a brief connecting state while MediaRecorder initializes

**UX Polish:**
- [ ] Confirm auto-scroll works reliably across all 3 panels
- [ ] Confirm transcript, suggestions, and chat panels each have correct overflow and scrollbar behavior
- [ ] Add keyboard shortcut: Enter to send chat, Escape to close settings
- [ ] Confirm settings modal can be closed by clicking outside it
- [ ] Verify the 3-column layout holds correctly on 1280px, 1440px, and 1920px wide screens

**Deploy: Frontend to Vercel:**
- [ ] Connect GitHub repo to Vercel
- [ ] Set `VITE_API_URL` environment variable to the Render backend URL
- [ ] Confirm build succeeds and app is accessible at a public Vercel URL

**Deploy: Backend to Render:**
- [ ] Create new Web Service on Render pointing to `backend/`
- [ ] Set start command: `uvicorn app.main:app --host 0.0.0.0 --port 8000`
- [ ] Set `ALLOWED_ORIGINS` environment variable to the Vercel frontend URL
- [ ] Confirm `GET /health` returns `{ "status": "ok" }` on the live Render URL

**End-to-End Verification on Live URLs:**
- [ ] Open Vercel URL, enter Groq API key in settings
- [ ] Click mic, speak for 60 seconds, confirm transcript appears
- [ ] Confirm suggestions refresh automatically
- [ ] Click a suggestion, confirm streaming chat response
- [ ] Export session, confirm valid JSON download

**README:**
- [ ] Update README with live Vercel URL and Render URL
- [ ] Confirm setup instructions are accurate and tested
- [ ] Add a Prompt Strategy section explaining the final prompt decisions
- [ ] Add a Tradeoffs section covering key decisions made during development

### Acceptance Criteria:
- Frontend is live at a public Vercel URL
- Backend is live at a public Render URL with `/health` returning `{ "status": "ok" }`
- Full end-to-end session works on the live URLs (mic, transcript, suggestions, chat, export)
- All API errors show a user-facing message and do not crash the app
- Skeleton loading states are visible during all loading operations
- README is complete with setup instructions, live URLs, prompt strategy, and tradeoffs
- No hardcoded secrets in any committed file
- App renders correctly at 1280px, 1440px, and 1920px viewport widths

### Outcome:
A fully deployed, publicly accessible Revelio app that works end-to-end from mic to suggestions to chat to export, with a clean codebase and complete documentation.

### Notes / References:
- Render free tier has a cold start delay of ~30 seconds after inactivity. This is acceptable for this project.
- Test on a second browser and device to catch any environment-specific issues
- The export file from a live test session should be saved and ready to share during any demo or review

### Testing:
- Open the live Vercel URL in an incognito window, confirm it loads with no errors
- Complete a full end-to-end session: enter API key, record 90 seconds, review suggestions, click 3 suggestions, type 2 chat messages, export
- Trigger each error state manually: disconnect network mid-session, enter invalid API key, deny mic permission
- Test on Chrome and Firefox
- Verify `/health` on live Render URL returns 200
- Share the Vercel URL with one other person and have them test it independently

### Evaluation:
- Live app is accessible and fully functional with no setup beyond entering a Groq API key
- Latency from refresh click to suggestions rendered is under 5 seconds on live URLs
- Time from chat send to first streaming token is under 2 seconds on live URLs
- Zero 5xx errors during a clean end-to-end session
- README is accurate enough that someone unfamiliar with the project can set it up locally in under 15 minutes
