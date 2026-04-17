from fastapi import APIRouter, HTTPException, Header
from typing import Optional
from app.api.schemas.suggestions import SuggestionsRequest, SuggestionsResponse
from app.services.suggestions import generate_suggestions
import traceback

router = APIRouter()

@router.post("/suggestions", response_model=SuggestionsResponse)
async def get_suggestions(
    request: SuggestionsRequest,
    x_groq_api_key: Optional[str] = Header(None)
):
    if not x_groq_api_key:
        raise HTTPException(status_code=401, detail="No Groq API key provided. Please add your key in Settings.")

    try:
        cards = await generate_suggestions(
            transcript=request.transcript,
            context_window_words=request.context_window_words,
            api_key=x_groq_api_key
        )
        return SuggestionsResponse(cards=cards)
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))