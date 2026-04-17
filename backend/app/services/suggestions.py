import json
import re
from groq import AuthenticationError
from fastapi import HTTPException
from app.services.groq_client import get_groq_client
from app.utils.prompt_builder import build_suggestion_prompt

async def generate_suggestions(transcript: str, context_window_words: int, api_key: str) -> list:
    if not transcript.strip():
        return [
            {
                "type": "TALKING POINT",
                "title": "Start the conversation",
                "preview": "Begin recording and speaking. Suggestions will appear based on what is being discussed."
            },
            {
                "type": "QUESTION TO ASK",
                "title": "Kick off with context",
                "preview": "Start by establishing the goal of this conversation. What are we trying to accomplish today?"
            },
            {
                "type": "CLARIFICATION",
                "title": "Set the agenda",
                "preview": "Consider opening with a clear agenda so everyone knows what will be covered and in what order."
            }
        ]

    prompt = build_suggestion_prompt(transcript, context_window_words)
    client = get_groq_client(api_key)

    try:
        response = client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=800,
            temperature=0.7,
        )
    except AuthenticationError:
        raise HTTPException(status_code=401, detail="Invalid Groq API key. Please check your key in Settings.")

    content = response.choices[0].message.content.strip()
    content = re.sub(r'^```json\s*', '', content)
    content = re.sub(r'\s*```$', '', content)
    content = content.strip()

    try:
        parsed = json.loads(content)
        return parsed["cards"]
    except json.JSONDecodeError:
        match = re.search(r'\{.*\}', content, re.DOTALL)
        if match:
            parsed = json.loads(match.group())
            return parsed["cards"]
        raise ValueError(f"Could not parse suggestions response: {content}")