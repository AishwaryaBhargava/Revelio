from pydantic import BaseModel
from typing import List, Optional

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    transcript: str
    history: List[ChatMessage] = []
    card_context: Optional[str] = None