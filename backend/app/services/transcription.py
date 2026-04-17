from groq import AuthenticationError
from fastapi import HTTPException
from app.services.groq_client import get_groq_client

async def transcribe_audio(audio_bytes: bytes, filename: str, api_key: str) -> str:
    try:
        client = get_groq_client(api_key)
        transcription = client.audio.transcriptions.create(
            file=(filename, audio_bytes),
            model="whisper-large-v3",
            response_format="text"
        )
        return transcription
    except AuthenticationError:
        raise HTTPException(status_code=401, detail="Invalid Groq API key. Please check your key in Settings.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))