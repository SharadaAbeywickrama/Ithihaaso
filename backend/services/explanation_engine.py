import numpy as np
import shap
from sqlalchemy.ext.asyncio import AsyncSession
from models.schemas import ExplanationRecord

class ExplanationEngine:
    def __init__(self):
        pass

    def compute_shap_values(self, model_predict_func, feature_names: list[str], feature_values: dict[str, float], base_value: float = 0.5):
        """
        Computes approximate SHAP values using KernelExplainer.
        Since we don't have a dataset of instances, we use the base_value as the background distribution (single sample).
        """
        # Background data: a single instance of all zeros (or base values)
        background = np.zeros((1, len(feature_names)))
        
        # Explainer
        explainer = shap.KernelExplainer(model_predict_func, background)
        
        # Instance to explain
        instance = np.array([[feature_values[f] for f in feature_names]])
        
        # Compute SHAP values
        shap_values_raw = explainer.shap_values(instance)
        
        # KernelExplainer returns a list of arrays if multi-class, or single array
        if isinstance(shap_values_raw, list):
            sv = shap_values_raw[0][0]
        else:
            sv = shap_values_raw[0]

        # Map back to feature names
        return {name: float(val) for name, val in zip(feature_names, sv)}

    async def save_explanation(self, db: AsyncSession, target_type: str, target_id: str, base_value: float, shap_values: dict, feature_values: dict):
        """Saves the explanation to the database."""
        record = ExplanationRecord(
            target_type=target_type,
            target_id=target_id,
            base_value=base_value,
            shap_values=shap_values,
            feature_values=feature_values
        )
        db.add(record)
        await db.commit()
        return record

explanation_engine = ExplanationEngine()
