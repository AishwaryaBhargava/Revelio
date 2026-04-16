from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.transcription import transcribe_audio
from app.api.schemas.transcribe import TranscribeResponse

router = APIRouter()

@router.post("/transcribe", response_model=TranscribeResponse)
async def transcribe(file: UploadFile = File(...)):
    if not file:
        raise HTTPException(status_code=400, detail="No audio file provided")
    
    audio_bytes = await file.read()
    
    if len(audio_bytes) == 0:
        raise HTTPException(status_code=400, detail="Audio file is empty")
    
    text = await transcribe_audio(audio_bytes, file.filename or "audio.webm")
    
    return TranscribeResponse(text=text)