from groq import Groq

def get_groq_client(api_key: str) -> Groq:
    return Groq(api_key=api_key)