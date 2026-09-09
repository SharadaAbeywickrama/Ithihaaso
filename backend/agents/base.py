from langchain_openai import ChatOpenAI
from config import settings

def get_llm():
    """Returns the configured LLM from OpenRouter."""
    return ChatOpenAI(
        model=settings.LLM_MODEL,
        openai_api_key=settings.OPENROUTER_API_KEY,
        openai_api_base="https://openrouter.ai/api/v1",
        temperature=0.1 # Low temperature for analytical tasks
    )
