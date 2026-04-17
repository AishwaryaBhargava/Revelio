from pydantic import BaseModel
from typing import List

class SuggestionCard(BaseModel):
    type: str
    title: str
    preview: str

class SuggestionsRequest(BaseModel):
    transcript: str
    context_window_words: int = 400

class SuggestionsResponse(BaseModel):
    cards: List[SuggestionCard]