# from fastapi import APIRouter
# from pydantic import BaseModel
# import google.generativeai as genai
# import os
# import chromadb
# import requests  # <-- for SerpAPI
# from app.core.config import settings

# router = APIRouter(prefix="/chat", tags=["Chat"])

# # Configure Gemini
# genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
# model = genai.GenerativeModel("gemini-1.5-flash")

# # Chroma client
# chroma_client = chromadb.PersistentClient(path=settings.CHROMA_PERSIST_DIR)
# collection = chroma_client.get_or_create_collection("documents")


# class QueryRequest(BaseModel):
#     query: str
#     prompt: str | None = None
#     doc_ids: list[str] | None = None
#     websearch: bool = False 


# @router.post("/ask")
# async def ask_question(request: QueryRequest):
#     query = request.query
#     try:
#         context = ""
#         used_docs = []
#         web_results = []

#         # --- Knowledge Base Retrieval ---
#         if request.doc_ids:  
#             query_embedding = genai.embed_content(
#                 model="models/embedding-001",
#                 content=query
#             )["embedding"]

#             results = collection.query(
#                 query_embeddings=[query_embedding],
#                 n_results=3,
#                 where={"doc_id": {"$in": request.doc_ids}}
#             )

#             retrieved_docs = results.get("documents", [[]])[0]
#             used_docs = results.get("metadatas", [[]])[0]

#             if retrieved_docs:
#                 context += "\n\n".join(retrieved_docs)

#         # --- Optional Web Search ---
#         if request.websearch:
#             serp_api_key = os.getenv("SERPAPI_KEY")
#             params = {
#                 "engine": "google",
#                 "q": query,
#                 "api_key": serp_api_key
#             }
#             try:
#                 r = requests.get("https://serpapi.com/search", params=params)
#                 data = r.json()
#                 organic_results = data.get("organic_results", [])[:5]
#                 web_results = [
#                     {
#                         "title": item.get("title"),
#                         "link": item.get("link"),
#                         "snippet": item.get("snippet")
#                     }
#                     for item in organic_results
#                 ]

#                 # Feed web search snippets into context
#                 if organic_results:
#                     context += "\n\n".join(
#                         f"Web Search Results : {res.get('title')}: {res.get('snippet')}" 
#                         for res in organic_results
#                     )

#             except Exception as e:
#                 web_results = [{"error": f"Web search failed: {str(e)}"}]

#         # --- Construct Prompt ---
#         if context:
#             prompt = f"""
#             You are a helpful assistant. 
#             Use the following context (from uploaded docs and/or web search) to answer the question.

#             Context:
#             {context}

#             Question:
#             {query}
#             """
#         else:
#             prompt = query

#         if request.prompt:
#             prompt = request.prompt + "\n\n" + prompt

#         # --- LLM Call ---
#         response = model.generate_content(prompt)

#         return {
#             "answer": response.text,
#             "used_docs": used_docs,
#             "web_results": web_results
#         }

#     except Exception as e:
#         return {"error": str(e)}

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List
import google.generativeai as genai
import os
import chromadb
import requests
from app.core.config import settings

router = APIRouter(prefix="/chat", tags=["Chat"])

# Initialize GenAI Client
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY not set in environment")
genai.configure(api_key=api_key)

# Chroma client
os.makedirs(settings.CHROMA_PERSIST_DIR, exist_ok=True)
chroma_client = chromadb.PersistentClient(path=settings.CHROMA_PERSIST_DIR)
collection = chroma_client.get_or_create_collection("documents")


class QueryRequest(BaseModel):
    query: str
    prompt: Optional[str] = None
    doc_ids: Optional[List[str]] = None
    websearch: bool = False


@router.post("/ask")
async def ask_question(request: QueryRequest):
    query = request.query
    try:
        context = ""
        used_docs = []
        web_results = []

        # --- Knowledge Base Retrieval ---
        if request.doc_ids:
            # Embed the query using the embedding model
            embedding_result = genai.embed_content(
                model="models/embedding-001",
                content=query
            )
            query_embedding = embedding_result["embedding"]

            # Query Chroma
            results = collection.query(
                query_embeddings=[query_embedding],
                n_results=3,
                where={"doc_id": {"$in": request.doc_ids}} if request.doc_ids else {}
            )

            # Safely extract documents and metadata
            retrieved_docs = results.get("documents", [[]])
            retrieved_docs = retrieved_docs[0] if retrieved_docs else []

            used_docs = results.get("metadatas", [[]])
            used_docs = used_docs[0] if used_docs else []

            if retrieved_docs:
                context += "\n\n".join(retrieved_docs)

        # --- Optional Web Search ---
        if request.websearch:
            serp_api_key = os.getenv("SERPAPI_KEY")
            if not serp_api_key:
                return {"error": "SERPAPI_KEY not set in environment"}

            params = {
                "engine": "google",
                "q": query,
                "api_key": serp_api_key
            }
            try:
                r = requests.get("https://serpapi.com/search", params=params)
                data = r.json()
                organic_results = data.get("organic_results", [])[:5]
                web_results = [
                    {
                        "title": item.get("title"),
                        "link": item.get("link"),
                        "snippet": item.get("snippet")
                    }
                    for item in organic_results
                ]

                # Add web search snippets to context
                if organic_results:
                    context += "\n\n".join(
                        f"Web Search Result: {res.get('title')}: {res.get('snippet')}"
                        for res in organic_results
                    )
            except Exception as e:
                web_results = [{"error": f"Web search failed: {str(e)}"}]

        # --- Construct Prompt ---
        if context:
            prompt = f"""
You are a helpful assistant.
Use the following context (from uploaded docs and/or web search) to answer the question.

Context:
{context}

Question:
{query}
"""
        else:
            prompt = query

        if request.prompt:
            prompt = request.prompt + "\n\n" + prompt

        # --- LLM Call using Gemini 1.5-flash ---
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)

        return {
            "answer": response.text if hasattr(response, "text") else response["text"],
            "used_docs": used_docs,
            "web_results": web_results
        }

    except Exception as e:
        return {"error": str(e)}
