import os
import shutil
from fastapi import APIRouter, Depends, UploadFile, File, BackgroundTasks, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models.database import get_db
from models.schemas import Document, DocumentChunk
from models.pydantic_models import DocumentResponse
from services.document_processor import processor
from services.vector_store import get_vector_store
from agents.pipeline import pipeline

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

async def process_document_background(db: AsyncSession, doc_id: int):
    # Fetch doc
    result = await db.execute(select(Document).where(Document.id == doc_id))
    doc = result.scalar_one_or_none()
    if not doc:
        return

    # Process and chunk
    with open(doc.file_path, "rb") as f:
        file_bytes = f.read()
    
    chunks = await processor.process_file(file_bytes, doc.filename)
    
    # Run Agent Pipeline (Analyzer, Critic, GraphBuilder)
    await pipeline.process_document(db, doc)

    # Store Vectors
    # Note: we should store the doc id in metadata
    if chunks:
        metadatas = [{"document_id": doc.id, "chunk_index": i, "filename": doc.filename} for i in range(len(chunks))]
        vector_store = get_vector_store()
        await vector_store.aadd_texts(texts=chunks, metadatas=metadatas)

@router.post("/upload", response_model=DocumentResponse)
async def upload_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...), 
    db: AsyncSession = Depends(get_db)
):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    
    # Save file to disk
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Read content for DB storage
    with open(file_path, "rb") as buffer:
        content_bytes = buffer.read()
        try:
            content = content_bytes.decode('utf-8', errors='ignore') # fallback text
        except:
            content = ""

    # Create DB entry
    doc = Document(filename=file.filename, file_path=file_path, content=content)
    db.add(doc)
    await db.commit()
    await db.refresh(doc)

    # Queue background processing
    background_tasks.add_task(process_document_background, db, doc.id)

    return doc

@router.get("/", response_model=list[DocumentResponse])
async def list_documents(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Document))
    return result.scalars().all()
