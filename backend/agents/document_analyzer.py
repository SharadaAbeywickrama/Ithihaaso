import json
from langchain_core.prompts import ChatPromptTemplate
from .base import get_llm

class DocumentAnalyzerAgent:
    def __init__(self):
        self.llm = get_llm()
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", """You are an expert historian and text analyzer. 
            Extract entities (Person, Place, Event, Institution, Concept) and relationships from the text.
            Output JSON in the following format:
            {{
                "entities": [
                    {{"id": "entity_name", "type": "Person", "description": "brief desc"}}
                ],
                "relationships": [
                    {{"source": "entity1", "target": "entity2", "type": "PARTICIPATED_IN", "weight": 1.0}}
                ]
            }}
            Ensure valid JSON output."""),
            ("user", "Text:\n{text}")
        ])
        
    async def analyze(self, text: str) -> dict:
        chain = self.prompt | self.llm
        response = await chain.ainvoke({"text": text})
        
        try:
            # Simple JSON parsing; in production, use PydanticOutputParser
            # Strip markdown code blocks if present
            content = response.content.strip()
            if content.startswith("```json"):
                content = content[7:-3]
            elif content.startswith("```"):
                content = content[3:-3]
            return json.loads(content)
        except Exception as e:
            print(f"Failed to parse JSON from Analyzer: {e}")
            return {"entities": [], "relationships": []}

document_analyzer = DocumentAnalyzerAgent()
