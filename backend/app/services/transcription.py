from app.services.groq_client import client

async def transcribe_audio(audio_bytes: bytes, filename: str) -> str:
    transcription = client.audio.transcriptions.create(
        file=(filename, audio_bytes),
        model="whisper-large-v3",
        response_format="text"
    )
    return transcription