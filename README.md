# Ithihaaso

An autonomous multi-agent knowledge base for historiographical synthesis and source criticism, built as a web platform powered by a dynamic, self-organizing agentic knowledge graph.

## Getting Started

### Prerequisites
- Docker (for PostgreSQL + pgvector)
- Node.js 18+
- Python 3.10+
- OpenRouter API Key

### Setup

1. Start the database:
   ```bash
   docker-compose up -d
   ```

2. Setup backend:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   cp .env.example .env # Add your OPENROUTER_API_KEY
   uvicorn main:app --reload
   ```

3. Setup frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
