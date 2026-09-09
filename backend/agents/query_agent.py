from langchain_core.prompts import ChatPromptTemplate
from services.vector_store import get_vector_store
from .base import get_llm

class QueryAgent:
    def __init__(self):
        self.llm = get_llm()
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", """You are a historical research assistant.
            Use the following context to answer the question. Cite the sources provided.
            
            Context:
            {context}
            """),
            ("user", "{question}")
        ])

    async def answer_query(self, question: str) -> dict:
        try:
            vector_store = get_vector_store()
            docs = await vector_store.asimilarity_search(question, k=5)
            
            context = "\n\n".join([f"Source (Chunk ID {d.metadata.get('chunk_index')}): {d.page_content}" for d in docs])
            
            chain = self.prompt | self.llm
            response = await chain.ainvoke({"context": context, "question": question})
            
            return {
                "answer": response.content,
                "citations": [d.metadata.get("filename", "Unknown") for d in docs]
            }
        except Exception as e:
            return {
                "answer": f"Error performing query: {str(e)}",
                "citations": []
            }

query_agent = QueryAgent()
