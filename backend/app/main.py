# Entry point for the FastAPI app
# Registers routers and configures CORS

from fastapi import FastAPI

app = FastAPI(title="Revelio API")

@app.get("/")
def root():
    return {"message": "Revelio API is running"}