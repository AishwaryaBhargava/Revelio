from fastapi import APIRouter, Header, HTTPException
from fastapi.responses import StreamingResponse
from typing import Optional
from app.api.schemas.chat import ChatRequest
from app.services.chat import stream_chat_response

router = APIRouter()

@router.post("/chat")
async def chat(
    request: ChatRequest,
    x_groq_api_key: Optional[str] = Header(None)
):
    if not x_groq_api_key:
        raise HTTPException(status_code=401, detail="No Groq API key provided. Please add your key in Settings.")

    def generate():
        for token in stream_chat_response(
            message=request.message,
            transcript=request.transcript,
            history=[m.dict() for m in request.history],
            api_key=x_groq_api_key
        ):
            yield token

    return StreamingResponse(generate(), media_type="text/plain")