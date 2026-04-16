# Revelio
### Your real-time conversation intelligence layer
**Problem Statement**

---

## Overview

Revelio is a real-time meeting copilot that listens to live audio from your microphone and continuously surfaces intelligent, context-aware suggestions while you talk. It acts as a silent thinking partner, sitting alongside any conversation and providing the right nudge at the right time.

---

## The Problem

People in conversations, whether meetings, interviews, calls, or discussions, often miss opportunities to ask the right question, surface a relevant fact, or challenge a statement being made. Human working memory is limited, and the cognitive load of actively participating in a conversation leaves little room for meta-thinking.

Existing tools either transcribe passively (no intelligence) or require manual prompting (breaks the flow). There is no tool that silently watches a conversation and proactively surfaces the right thing at the right moment.

---

## What Revelio Does

Revelio solves this with a three-panel interface:

### Panel 1 - Mic and Transcript
Live audio is captured from the microphone and transcribed in real time using Whisper Large V3. Transcript chunks appear every ~30 seconds and auto-scroll so the user always sees the latest.

### Panel 2 - Live Suggestions
Every 30 seconds, Revelio analyzes recent transcript context and generates exactly 3 fresh suggestions. These can be a question to ask, a talking point to raise, an answer to a question just posed, a fact-check of a claim made, or a clarification. The right mix is determined by context.

### Panel 3 - Chat
Clicking any suggestion opens a detailed answer in the chat panel with full transcript context. Users can also type questions directly. One continuous session per use, no login required.

---

## Goals

- Surface the right suggestion at the right time based on what is being said
- Keep the experience frictionless -- no login, no setup beyond an API key
- Make suggestion previews useful on their own, with clicks providing even more depth
- Keep latency low from transcript chunk to rendered suggestions
- Let users customize prompts and context windows to tune the experience

---

## Non-Goals

- Production-scale infrastructure or multi-user support
- Persistent storage or user accounts
- Mobile-first or native app experience
- Real-time word-by-word transcription (chunked is fine)

---

## Success Criteria

1. Suggestions feel genuinely useful and well-timed during a real conversation
2. The right type of suggestion appears for the right context
3. Detailed chat answers are substantive and grounded in transcript context
4. Latency from refresh click to rendered suggestions is under 5 seconds
5. The app runs end-to-end reliably without crashes or audio loss
