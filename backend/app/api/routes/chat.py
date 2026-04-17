from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from app.api.schemas.chat import ChatRequest
from app.services.chat import stream_chat_response

router = APIRouter()

@router.post("/chat")
async def chat(request: ChatRequest):
    def generate():
        for token in stream_chat_response(
            message=request.message,
            transcript=request.transcript,
            history=[m.dict() for m in request.history],
        ):
            yield token

    return StreamingResponse(generate(), media_type="text/plain")