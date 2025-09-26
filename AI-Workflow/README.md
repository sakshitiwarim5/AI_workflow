

# AI Chat + Knowledge Base App

[![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.101.0-green?logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.2.0-blue?logo=react)](https://reactjs.org/)
[![ChromaDB](https://img.shields.io/badge/ChromaDB-0.4.0-orange)](https://www.trychroma.com/)

A full-stack application to chat with an AI (powered by Gemini/OpenAI), integrated with a knowledge base and optional live web search via SerpAPI.

> Ensure both backend and frontend folders have a `.env` file in their root.

---

## Architecture

**Backend:** FastAPI (Python) + ChromaDB for vector storage
**Frontend:** React (Vite) for chat UI

**Flow:**

1. User sends query from React frontend
2. Backend checks knowledge base and optionally SerpAPI
3. AI (Gemini/OpenAI) responds with combined context

---

## Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/sakshitiwarim5/AI_workflow.git
cd AI_workflow
```

---

## Backend Setup (FastAPI)

### 2. Create & Activate Virtual Environment

```bash
cd backend
python -m venv .venv

# Activate
# Windows
.venv\Scripts\activate
# Mac/Linux
source .venv/bin/activate
```

---

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

---

### 4. Configure Environment Variables

Create a `.env` file in the backend folder:

```text
DATABASE_URL=your_database_url_here
OPENAI_API_KEY=your_openai_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
SERPAPI_KEY=your_serpapi_key_here
CHROMA_PERSIST_DIR=./chroma_persist
```

---

### 5. Run Backend

```bash
uvicorn app.main:app --reload --port 8000
```

Server will be available at: [http://localhost:8000](http://localhost:8000)

---

## Frontend Setup (React + Vite)

### 6. Install Dependencies

```bash
cd frontend
npm install
```

---

### 7. Configure Environment Variables

Create a `.env` file in the frontend folder:

```text
VITE_SERVER_URL="http://localhost:8000"
```

---

### 8. Run Frontend

```bash
npm run dev
```

Vite will run at: [http://localhost:5173](http://localhost:5173)


## Final Check

- Backend: [http://localhost:8000](http://localhost:8000)
- Frontend: [http://localhost:5173](http://localhost:5173)
- `.env` files are correctly configured

Open frontend URL and start chatting. AI will respond using your knowledge base and web search results (if enabled).

