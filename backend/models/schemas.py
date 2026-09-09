from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON, Float, Boolean
from sqlalchemy.orm import relationship
from pgvector.sqlalchemy import Vector
from datetime import datetime
from .database import Base

class Document(Base):
    __tablename__ = "documents"
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, index=True)
    file_path = Column(String)
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    content = Column(Text)
    
    chunks = relationship("DocumentChunk", back_populates="document", cascade="all, delete-orphan")
    critique = relationship("SourceCritique", back_populates="document", uselist=False, cascade="all, delete-orphan")

class DocumentChunk(Base):
    __tablename__ = "document_chunks"
    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"))
    chunk_index = Column(Integer)
    text = Column(Text)
    embedding = Column(Vector(768)) # Default size, will be updated to match model if needed
    
    document = relationship("Document", back_populates="chunks")

class Entity(Base):
    __tablename__ = "entities"
    id = Column(String, primary_key=True, index=True) # Normalized name
    type = Column(String, index=True) # Person, Place, Event, etc.
    description = Column(Text)
    metadata_json = Column(JSON, default={})

class Relationship(Base):
    __tablename__ = "relationships"
    id = Column(Integer, primary_key=True, index=True)
    source_id = Column(String, ForeignKey("entities.id"))
    target_id = Column(String, ForeignKey("entities.id"))
    type = Column(String) # e.g., "PARTICIPATED_IN", "LOCATED_AT"
    weight = Column(Float, default=1.0)
    evidence = Column(JSON, default=[]) # list of document_ids or excerpts

class SourceCritique(Base):
    __tablename__ = "source_critiques"
    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"))
    reliability_score = Column(Float)
    bias_score = Column(Float)
    primary_source = Column(Boolean)
    critique_text = Column(Text)
    
    document = relationship("Document", back_populates="critique")

class ExplanationRecord(Base):
    __tablename__ = "explanation_records"
    id = Column(Integer, primary_key=True, index=True)
    target_type = Column(String) # 'critique', 'entity_extraction', 'query'
    target_id = Column(String) # ID of the related record
    base_value = Column(Float)
    shap_values = Column(JSON) # {feature_name: shap_value}
    feature_values = Column(JSON) # original feature values
