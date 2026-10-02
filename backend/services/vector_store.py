from langchain_postgres.vectorstores import PGVector
from langchain_openai import OpenAIEmbeddings
from config import settings

# Initialize embeddings via OpenRouter
embeddings = OpenAIEmbeddings(
    openai_api_key=settings.OPENROUTER_API_KEY,
    openai_api_base="https://openrouter.ai/api/v1",
    model="openai/text-embedding-3-small" # Verified OpenRouter embedding model
)

def get_vector_store() -> PGVector:
    """Returns a connected PGVector instance."""
    return PGVector(
        embeddings=embeddings,
        collection_name="ithihaaso_documents",
        connection=settings.DATABASE_URL,
        use_jsonb=True,
        async_mode=True,
        create_extension=False,
    )
