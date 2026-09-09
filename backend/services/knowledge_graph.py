import networkx as nx
from typing import List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models.schemas import Entity, Relationship

class KnowledgeGraphManager:
    def __init__(self):
        self.graph = nx.MultiDiGraph()

    async def load_from_db(self, db: AsyncSession):
        """Loads the graph from PostgreSQL into NetworkX memory."""
        self.graph.clear()
        
        # Load Entities
        result = await db.execute(select(Entity))
        entities = result.scalars().all()
        for e in entities:
            self.graph.add_node(e.id, type=e.type, description=e.description, **e.metadata_json)

        # Load Relationships
        result = await db.execute(select(Relationship))
        relationships = result.scalars().all()
        for r in relationships:
            self.graph.add_edge(
                r.source_id, 
                r.target_id, 
                key=r.id,
                type=r.type, 
                weight=r.weight,
                evidence=r.evidence
            )

    def get_subgraph(self, node_id: str, radius: int = 2) -> Dict[str, Any]:
        """Returns a local subgraph around a specific node for visualization."""
        if node_id not in self.graph:
            return {"nodes": [], "edges": []}
            
        nodes = nx.single_source_shortest_path_length(self.graph, node_id, cutoff=radius).keys()
        subgraph = self.graph.subgraph(nodes)
        return self._format_graph(subgraph)
        
    def get_full_graph(self) -> Dict[str, Any]:
        """Returns the entire graph for visualization."""
        return self._format_graph(self.graph)

    def _format_graph(self, g: nx.MultiDiGraph) -> Dict[str, Any]:
        """Formats a NetworkX graph for D3.js."""
        nodes = [
            {"id": n, "label": n, "type": d.get("type", "Unknown"), "properties": d} 
            for n, d in g.nodes(data=True)
        ]
        edges = [
            {"source": u, "target": v, "type": d.get("type", ""), "weight": d.get("weight", 1.0)} 
            for u, v, d in g.edges(data=True)
        ]
        return {"nodes": nodes, "edges": edges}

kg_manager = KnowledgeGraphManager()
