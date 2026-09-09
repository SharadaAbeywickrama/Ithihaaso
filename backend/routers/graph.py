from fastapi import APIRouter, Depends
from models.pydantic_models import GraphResponse
from services.knowledge_graph import kg_manager

router = APIRouter()

@router.get("/", response_model=GraphResponse)
async def get_graph():
    """Returns the entire knowledge graph."""
    # Ensure memory graph is populated from DB on startup, or just return memory graph
    # (Assuming memory graph is kept in sync by agents)
    data = kg_manager.get_full_graph()
    return data
