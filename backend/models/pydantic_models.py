from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any
from datetime import datetime

class DocumentResponse(BaseModel):
    id: int
    filename: str
    uploaded_at: datetime
    
    class Config:
        orm_mode = True

class GraphNode(BaseModel):
    id: str
    label: str
    type: str
    properties: Dict[str, Any]

class GraphEdge(BaseModel):
    source: str
    target: str
    type: str
    weight: float

class GraphResponse(BaseModel):
    nodes: List[GraphNode]
    edges: List[GraphEdge]

class QueryRequest(BaseModel):
    question: str
    include_explanation: bool = False

class QueryResponse(BaseModel):
    answer: str
    citations: List[str]
    explanation_id: Optional[int] = None

class ShapExplanation(BaseModel):
    base_value: float
    shap_values: Dict[str, float]
    feature_values: Dict[str, Any]
