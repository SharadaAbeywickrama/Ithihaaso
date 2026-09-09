from sqlalchemy.ext.asyncio import AsyncSession
from models.schemas import Entity, Relationship
from services.knowledge_graph import kg_manager

class GraphBuilderAgent:
    def __init__(self):
        pass

    async def build_from_analysis(self, db: AsyncSession, analysis_result: dict, document_id: int):
        """Takes output from DocumentAnalyzer and updates the database/graph."""
        
        # 1. Upsert Entities
        for e_data in analysis_result.get("entities", []):
            # Very simple upsert logic (for production, use PostgreSQL ON CONFLICT)
            entity = Entity(
                id=e_data["id"],
                type=e_data["type"],
                description=e_data["description"]
            )
            db.merge(entity) # merge handles insert or update

        # 2. Insert Relationships
        for r_data in analysis_result.get("relationships", []):
            rel = Relationship(
                source_id=r_data["source"],
                target_id=r_data["target"],
                type=r_data["type"],
                weight=r_data["weight"],
                evidence=[document_id]
            )
            db.add(rel)

        await db.commit()
        
        # Reload memory graph
        await kg_manager.load_from_db(db)

graph_builder = GraphBuilderAgent()
