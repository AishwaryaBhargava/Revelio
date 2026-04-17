from fastapi import APIRouter, UploadFile, File, HTTPException, Header
from typing import Optional
from app.services.transcription import transcribe_audio
from app.api.schemas.transcribe import TranscribeResponse

router = APIRouter()

@router.post("/transcribe", response_model=TranscribeResponse)
async def transcribe(
    file: UploadFile = File(...),
    x_groq_api_key: Optional[str] = Header(None)
):
    if not x_groq_api_key:
        raise HTTPException(status_code=401, detail="No Groq API key provided. Please add your key in Settings.")

    if not file:
        raise HTTPException(status_code=400, detail="No audio file provided")

    audio_bytes = await file.read()

    if len(audio_bytes) == 0:
        raise HTTPException(status_code=400, detail="Audio file is empty")

    text = await transcribe_audio(audio_bytes, file.filename or "audio.webm", x_groq_api_key)

    return TranscribeResponse(text=text)