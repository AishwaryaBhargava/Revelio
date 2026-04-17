from groq import AuthenticationError
from fastapi import HTTPException
from app.services.groq_client import get_groq_client
from app.utils.prompt_builder import build_chat_prompt
from typing import Generator

def stream_chat_response(message: str, transcript: str, history: list, api_key: str) -> Generator:
    prompt = build_chat_prompt(transcript, message)
    client = get_groq_client(api_key)

    messages = [{"role": "system", "content": prompt}]

    for msg in history[-10:]:
        messages.append({"role": msg["role"], "content": msg["content"]})

    messages.append({"role": "user", "content": message})

    try:
        stream = client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=messages,
            max_tokens=1000,
            temperature=0.7,
            stream=True,
        )
    except AuthenticationError:
        raise HTTPException(status_code=401, detail="Invalid Groq API key. Please check your key in Settings.")

    for chunk in stream:
        delta = chunk.choices[0].delta.content
        if delta:
            yield delta