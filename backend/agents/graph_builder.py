from sqlalchemy.ext.asyncio import AsyncSession
from models.schemas import Entity, Relationship
from services.knowledge_graph import kg_manager

class GraphBuilderAgent:
    def __init__(self):
        pass

    async def build_from_analysis(self, db: AsyncSession, analysis_result: dict, document_id: int):
        """Takes output from DocumentAnalyzer and updates the database/graph."""
        
        # 1. Upsert Entities
        seen_entities = set()
        for e_data in analysis_result.get("entities", []):
            entity_id = e_data.get("id")
            if not entity_id: continue
            
            seen_entities.add(entity_id)
            entity = Entity(
                id=entity_id,
                type=e_data.get("type", "Unknown"),
                description=e_data.get("description", "")
            )
            await db.merge(entity) # fixed: await is required for async session

        # 2. Insert Relationships
        for r_data in analysis_result.get("relationships", []):
            source = r_data.get("source")
            target = r_data.get("target")
            if not source or not target: continue
            
            # Ensure implicitly mentioned entities exist to prevent ForeignKeyViolation
            if source not in seen_entities:
                await db.merge(Entity(id=source, type="Unknown", description="Implicitly created"))
                seen_entities.add(source)
            if target not in seen_entities:
                await db.merge(Entity(id=target, type="Unknown", description="Implicitly created"))
                seen_entities.add(target)
                
            rel = Relationship(
                source_id=source,
                target_id=target,
                type=r_data.get("type", "RELATED_TO"),
                weight=r_data.get("weight", 1.0),
                evidence=[document_id]
            )
            db.add(rel)

        await db.commit()
        
        # Reload memory graph
        await kg_manager.load_from_db(db)

graph_builder = GraphBuilderAgent()
