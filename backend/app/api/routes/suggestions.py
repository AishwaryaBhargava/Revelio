from fastapi import APIRouter, HTTPException
from app.api.schemas.suggestions import SuggestionsRequest, SuggestionsResponse
from app.services.suggestions import generate_suggestions
import traceback

router = APIRouter()

@router.post("/suggestions", response_model=SuggestionsResponse)
async def get_suggestions(request: SuggestionsRequest):
    try:
        cards = await generate_suggestions(
            transcript=request.transcript,
            context_window_words=request.context_window_words
        )
        return SuggestionsResponse(cards=cards)
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))