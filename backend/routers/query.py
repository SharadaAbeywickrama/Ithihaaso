from fastapi import APIRouter
from models.pydantic_models import QueryRequest, QueryResponse
from agents.query_agent import query_agent

router = APIRouter()

@router.post("/", response_model=QueryResponse)
async def ask_question(request: QueryRequest):
    result = await query_agent.answer_query(request.question)
    return QueryResponse(
        answer=result.get("answer", ""),
        citations=result.get("citations", []),
        explanation_id=None # Mocking SHAP for queries for now
    )
