from sqlalchemy.ext.asyncio import AsyncSession
from models.schemas import Document, SourceCritique
from .document_analyzer import document_analyzer
from .source_critic import source_critic
from .graph_builder import graph_builder
from services.explanation_engine import explanation_engine

class AgentPipeline:
    async def process_document(self, db: AsyncSession, document: Document):
        """Runs the multi-agent pipeline on a newly uploaded document."""
        
        full_text = document.content
        # In a real system, we might only pass summary/chunks, but we'll pass full text here (or up to token limit)
        text_to_analyze = full_text[:15000] # truncate for safety

        # 1. Document Analyzer
        analysis = await document_analyzer.analyze(text_to_analyze)
        
        # 2. Source Critic
        critique_result = await source_critic.critique(text_to_analyze)
        
        # Save Critique
        critique = SourceCritique(
            document_id=document.id,
            reliability_score=critique_result.get("reliability_score", 0.5),
            bias_score=1.0 - critique_result.get("feature_scores", {}).get("neutrality", 0.5),
            primary_source=critique_result.get("primary_source", False),
            critique_text=critique_result.get("critique_text", "")
        )
        db.add(critique)
        await db.flush() # get critique.id

        # Save Explanation for Critique
        feature_scores = critique_result.get("feature_scores", {})
        if feature_scores:
            # We mock the predict_func for SHAP here, or compute SHAP directly
            # For brevity in this pipeline, we'll store the feature values and mock SHAP values proportional to feature
            shap_mock = {k: v * 0.1 for k, v in feature_scores.items()} 
            
            await explanation_engine.save_explanation(
                db=db,
                target_type="critique",
                target_id=str(critique.id),
                base_value=0.5,
                shap_values=shap_mock,
                feature_values=feature_scores
            )

        # 3. Graph Builder
        await graph_builder.build_from_analysis(db, analysis, document.id)

pipeline = AgentPipeline()
