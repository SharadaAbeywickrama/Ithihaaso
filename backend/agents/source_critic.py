import json
from langchain_core.prompts import ChatPromptTemplate
from .base import get_llm

class SourceCriticAgent:
    def __init__(self):
        self.llm = get_llm()
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", """You are a rigorous historiographer performing source criticism.
            Analyze the given document and evaluate its reliability based on 5 features:
            1. temporal_proximity (0-1): How close is the author to the events?
            2. author_credentials (0-1): Does the author have relevant expertise/authority?
            3. corroboration (0-1): Is this corroborated by other known facts?
            4. source_type (0-1): 1 for primary, 0.5 for secondary, 0 for tertiary.
            5. neutrality (0-1): 1 for completely neutral, 0 for highly biased.
            
            Output JSON exactly in this format:
            {{
                "reliability_score": 0.85, 
                "primary_source": true,
                "critique_text": "Detailed explanation...",
                "feature_scores": {{
                    "temporal_proximity": 0.9,
                    "author_credentials": 0.8,
                    "corroboration": 0.7,
                    "source_type": 1.0,
                    "neutrality": 0.6
                }}
            }}
            """),
            ("user", "Document text:\n{text}")
        ])

    async def critique(self, text: str) -> dict:
        chain = self.prompt | self.llm
        response = await chain.ainvoke({"text": text})
        
        try:
            content = response.content.strip()
            if content.startswith("```json"):
                content = content[7:-3]
            elif content.startswith("```"):
                content = content[3:-3]
            return json.loads(content)
        except Exception as e:
            print(f"Failed to parse JSON from Critic: {e}")
            return {
                "reliability_score": 0.5,
                "primary_source": False,
                "critique_text": "Failed to generate critique.",
                "feature_scores": {
                    "temporal_proximity": 0.5,
                    "author_credentials": 0.5,
                    "corroboration": 0.5,
                    "source_type": 0.5,
                    "neutrality": 0.5
                }
            }

source_critic = SourceCriticAgent()
