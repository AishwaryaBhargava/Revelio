from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import health, transcribe, suggestions, chat

app = FastAPI(title="Revelio API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.ALLOWED_ORIGINS],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(transcribe.router)
app.include_router(suggestions.router)
app.include_router(chat.router)

@app.get("/")
def root():
    return {"message": "Revelio API is running"}