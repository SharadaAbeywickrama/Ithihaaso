from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models.database import get_db
from models.schemas import ExplanationRecord
from models.pydantic_models import ShapExplanation

router = APIRouter()

@router.get("/{target_type}/{target_id}", response_model=ShapExplanation)
async def get_explanation(target_type: str, target_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(ExplanationRecord)
        .where(ExplanationRecord.target_type == target_type)
        .where(ExplanationRecord.target_id == target_id)
    )
    record = result.scalar_one_or_none()
    
    if not record:
        raise HTTPException(status_code=404, detail="Explanation not found")
        
    return ShapExplanation(
        base_value=record.base_value,
        shap_values=record.shap_values,
        feature_values=record.feature_values
    )
