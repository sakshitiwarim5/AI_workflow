# 🧠 **AI Chat + Knowledge Base App**

This project is a full-stack application for chatting with an AI (powered by OpenAI/Gemini) with optional knowledge base and live web search via SerpAPI.

Note: Make sure that both backend and frontend folder have a .env in the root.

## 🏗️ **Architecture**

**Backend:** FastAPI (Python) with ChromaDB for vector storage

**Frontend:** React (Vite) for chat UI

## 🚀 **Setup Instructions**

### 1. **Clone the Repository**

```bash
git clone https://github.com/siwamsingh/AI-Workflow.git
```

## ⚙️ **Backend (FastAPI)**

### 2. 🐍 **Create and Activate Virtual Environment**

```bash
# Move into backend folder
cd backend

# Install virtual enviroment
python -m venv .venv

# Mac/Linux
source .venv/bin/activate
# Windows
.venv\Scripts\activate
```

### 3. 📦 **Install Dependencies**

```bash
pip install -r requirements.txt
```

### 4. 🔑 **Configure Environment Variables**

Create a `.env` file inside the backend root directory and add:

```text
DATABASE_URL=your_database_url_here
OPENAI_API_KEY=your_openai_api_key_here
SERPAPI_KEY=your_serpapi_key_here
GEMINI_API_KEY=your_gemini_api_key_here
CHROMA_PERSIST_DIR=./chroma_persist
```

### 5. 🚦 **Run the Backend**

Start the server on port 8000:

```bash
uvicorn app.main:app --reload --port 8000
```

Your FastAPI server is now running at:
👉 **http://localhost:8000**

## 💻 **Frontend (React + Vite)**

### 6. 📦 **Install Dependencies**

From the `frontend/` folder:

```bash
npm install
```

### 7. 🔑 **Configure Environment Variables**

Inside the frontend root, create a `.env` file and add:

```text
VITE_SERVER_URL="http://localhost:8000"
```

### 8. 🚦 **Run the Frontend**

```bash
npm run dev
```

By default, Vite runs at:
👉 **http://localhost:5173**

## ✅ **Final Check**

- **Backend running on:** http://localhost:8000
- **Frontend running on:** http://localhost:5173
- Both `.env` files are configured correctly

Now open the frontend URL, start chatting, and the AI should respond with context from your knowledge base & web search results (if enabled)! 