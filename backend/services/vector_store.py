from langchain_postgres.vectorstores import PGVector
from langchain_openai import OpenAIEmbeddings
from config import settings

# Initialize embeddings via OpenRouter
embeddings = OpenAIEmbeddings(
    openai_api_key=settings.OPENROUTER_API_KEY,
    openai_api_base="https://openrouter.ai/api/v1",
    model="nomic-ai/nomic-embed-text-v1.5" # OpenRouter supported embedding model
)

def get_vector_store() -> PGVector:
    """Returns a connected PGVector instance."""
    # Convert asyncpg URL to psycopg for psycopg2/psycopg3 if PGVector requires synchronous engine
    # Langchain PGVector supports async, but we can just use the connection string.
    db_url = settings.DATABASE_URL.replace("+asyncpg", "+psycopg")
    
    return PGVector(
        embeddings=embeddings,
        collection_name="ithihaaso_documents",
        connection=db_url,
        use_jsonb=True,
    )
