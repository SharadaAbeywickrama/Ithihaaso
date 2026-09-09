from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models.database import init_db
from routers import documents, graph, query, explanations
import contextlib

@contextlib.asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await init_db()
    yield
    # Shutdown

app = FastAPI(title="Ithihaaso API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(documents.router, prefix="/api/documents", tags=["Documents"])
app.include_router(graph.router, prefix="/api/graph", tags=["Graph"])
app.include_router(query.router, prefix="/api/query", tags=["Query"])
app.include_router(explanations.router, prefix="/api/explanations", tags=["Explanations"])

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
