from app.services.groq_client import client
from app.utils.prompt_builder import build_chat_prompt
from typing import List, Generator

def stream_chat_response(message: str, transcript: str, history: list) -> Generator:
    prompt = build_chat_prompt(transcript, message)

    messages = [{"role": "system", "content": prompt}]

    for msg in history[-10:]:
        messages.append({"role": msg["role"], "content": msg["content"]})

    messages.append({"role": "user", "content": message})

    stream = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=messages,
        max_tokens=1000,
        temperature=0.7,
        stream=True,
    )

    for chunk in stream:
        delta = chunk.choices[0].delta.content
        if delta:
            yield delta