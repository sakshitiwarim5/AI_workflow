import fitz  # PyMuPDF
import uuid
import os
from fastapi import APIRouter, UploadFile, Depends
from pydantic import BaseModel
from datetime import datetime
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.session import get_db
from app.db.models import Document
from app.core.config import settings

import google.generativeai as genai
import chromadb


class DocumentSchema(BaseModel):
    id: int
    filename: str
    doc_id: str
    created_at: datetime

    class Config:
        orm_mode = True

router = APIRouter(prefix="/documents", tags=["Documents"])

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Chroma client
chroma_client = chromadb.PersistentClient(path=settings.CHROMA_PERSIST_DIR)
collection = chroma_client.get_or_create_collection("documents")


@router.get("/")
async def test_documents():
    return {"msg": "documents api working"}


@router.get("/list", response_model=List[DocumentSchema])
async def list_documents(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Document))
    docs = result.scalars().all()

    return docs
    

@router.post("/upload")
async def upload_document(file: UploadFile, db: AsyncSession = Depends(get_db)):
    # Save file temporarily
    file_path = f"./tmp_{file.filename}"
    with open(file_path, "wb") as f:
        f.write(await file.read())

    # Extract text using PyMuPDF
    doc = fitz.open(file_path)
    text = ""
    for page in doc:
        text += page.get_text()
    doc.close()
    os.remove(file_path)

    # Generate embeddings with Gemini
    embedding_response = genai.embed_content(
        model="models/embedding-001",
        content=text
    )
    embedding = embedding_response["embedding"]

    # Store embedding in Chroma
    doc_id = str(uuid.uuid4())
    collection.add(
        ids=[doc_id],
        embeddings=[embedding],
        documents=[text],
        metadatas=[{"filename": file.filename, "doc_id": doc_id}]
    )

    # Store metadata in Postgres
    new_doc = Document(
        filename=file.filename,
        doc_id=doc_id
    )
    db.add(new_doc)
    await db.commit()

    return {"status": "uploaded", "doc_id": doc_id}
