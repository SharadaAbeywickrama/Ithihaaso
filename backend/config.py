import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    OPENROUTER_API_KEY: str
    LLM_MODEL: str = "meta-llama/llama-3.3-70b-instruct"
    DATABASE_URL: str = "postgresql+asyncpg://ithihaaso_user:ithihaaso_pass@localhost:5432/ithihaaso_db"

    class Config:
        env_file = ".env"

settings = Settings()
