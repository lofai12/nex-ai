<p align="center">
  <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/Python-Dark.svg" height="48" alt="Python" />
  <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/FastAPI.svg" height="48" alt="FastAPI" />
  <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/React-Dark.svg" height="48" alt="React" />
  <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/Vite-Dark.svg" height="48" alt="Vite" />
  <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/GCP-Dark.svg" height="48" alt="Google Gemini" />
</p>

<h1 align="center">🤖 AI Chat Assistant</h1>

<p align="center">
  <b>Full-stack AI chatbot powered by Google Gemini + FastAPI + React</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/python-3.8+-blue?style=flat-square&logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/fastapi-0.100+-009688?style=flat-square&logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/react-19-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/vite-6-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/gemini-2.0--flash-4285F4?style=flat-square&logo=google&logoColor=white" alt="Gemini" />
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="License" />
</p>

---

## ✨ Features

- ⚡ **Real-time chat** — send messages and receive AI responses instantly
- 🧠 **Gemini 2.0 Flash** — powered by Google's latest fast-thinking model
- 💾 **Persistent history** — chat log saved in `localStorage`, survives refreshes
- 🌓 **Auto dark mode** — respects OS-level `prefers-color-scheme`
- 📱 **Fully responsive** — works on desktop, tablet, and mobile
- 🔒 **CORS-safe** — backend only accepts requests from allowed origins
- 🧪 **Health-check endpoint** — monitor backend readiness at `GET /`
- 🎯 **Typed API** — Pydantic models validate every request

---

## 🏗 Architecture

```
┌──────────────────────────────────────────────┐
│                  Browser                      │
│  ┌────────────────────────────────────────┐  │
│  │         React + Vite (port 5173)       │  │
│  │   App.jsx  │  App.css  │  Axios/fetch  │  │
│  └──────────────────┬─────────────────────┘  │
└─────────────────────┼────────────────────────┘
                      │  POST /chat
                      ▼
┌─────────────────────┼────────────────────────┐
│              FastAPI (port 8000)              │
│  ┌──────────────────┴─────────────────────┐  │
│  │            main.py                      │  │
│  │  • CORS middleware                      │  │
│  │  • Pydantic ChatInput model             │  │
│  │  • Gemini integration                   │  │
│  └──────────────────┬─────────────────────┘  │
└─────────────────────┼────────────────────────┘
                      │  google-generativeai
                      ▼
            ┌──────────────────┐
            │  Google Gemini    │
            │  2.0 Flash model  │
            └──────────────────┘
```

---

## 📦 Project Structure

```
fastapi-react-ai-chatbot/
├── chatbot-backend/            # FastAPI server
│   ├── main.py                 # App entrypoint, routes, Gemini config
│   ├── .env                    # API keys (git-ignored)
│   └── requirements.txt        # (optional) pip dependencies
│
├── chatbot-frontend/           # React SPA
│   ├── index.html              # Vite entry HTML
│   ├── package.json            # Dependencies & scripts
│   └── src/
│       ├── main.jsx            # React DOM root
│       ├── App.jsx             # Chat UI + logic
│       ├── App.css             # All styles (light/dark themes)
│       └── index.css           # Global CSS reset
│
└── README.md                   # This file
```

---

## 🚀 Quick Start

### 0. Prerequisites

| Tool  | Version    | Check with      |
|-------|------------|-----------------|
| Node.js | ≥ 18 LTS  | `node --version` |
| npm     | ≥ 9       | `npm --version`  |
| Python  | ≥ 3.8     | `python --version` |
| pip     | ≥ 21      | `pip --version`  |

You also need a **Google Gemini API key** — get one free at [Google AI Studio](https://aistudio.google.com/apikey).

---

### 1. Clone & Install Backend

```bash
cd chatbot-backend

# Create virtual environment
python -m venv .venv

# Activate it
source .venv/bin/activate      # macOS / Linux
.venv\Scripts\activate         # Windows

# Install dependencies
pip install fastapi uvicorn python-dotenv google-generativeai
```

---

### 2. Set Your API Key

Create a `.env` file inside `chatbot-backend/`:

```env
GOOGLE_API_KEY=your-real-api-key-here
```

> ⚠️ **Never commit `.env`.** It is already listed in `.gitignore`.

---

### 3. Start the Backend

```bash
cd chatbot-backend
uvicorn main:app --reload
```

✅ API running at **http://localhost:8000**
✅ Interactive docs at **http://localhost:8000/docs**

---

### 4. Install & Start Frontend

```bash
cd chatbot-frontend
npm install
npm run dev
```

✅ Chat UI at **http://localhost:5173**

---

### 5. Chat!

Type a message in the browser — the backend forwards it to Gemini and streams the response back.

---

## 🔌 API Reference

### Health Check

```http
GET /
```

**Response** `200 OK`
```json
{ "status": "ok" }
```

---

### Send Chat Message

```http
POST /chat
Content-Type: application/json
```

**Request Body**
```json
{
  "user_message": "Explain quantum computing in one sentence."
}
```

**Response** `200 OK`
```json
{
  "response": "Quantum computing uses qubits that can exist in superposition..."
}
```

**Error** `500 Internal Server Error`
```json
{
  "detail": "Error generating content: ..."
}
```

---

## ⚙️ Configuration

### Backend Environment Variables

| Variable          | Required | Description                     |
|-------------------|----------|---------------------------------|
| `GOOGLE_API_KEY`  | ✅ Yes   | Google Gemini API key           |

### CORS Allowed Origins

Edit the `origins` list in `chatbot-backend/main.py`:

```python
origins = [
    "http://localhost:5173",          # local dev
    "https://your-deployed-app.com",  # production frontend
]
```

---

## 🧑‍💻 Development

### Frontend

| Script             | Action                         |
|--------------------|--------------------------------|
| `npm run dev`      | Start Vite dev server (HMR)   |
| `npm run build`    | Production build to `dist/`   |
| `npm run preview`  | Preview production build      |
| `npm run lint`     | Run ESLint                    |

### Backend

```bash
uvicorn main:app --reload --port 8000
# --reload   auto-restart on code changes
# --port     change the port
```

---

## 🐛 Troubleshooting

| Problem | Likely Fix |
|---------|------------|
| `GOOGLE_API_KEY environment variable is not set` | Create `.env` inside `chatbot-backend/` with a valid key |
| `Failed to initialize Gemini model` | Check that your API key is active and has quota remaining |
| `Network Error` / CORS errors in browser | Ensure backend is running on port 8000 and frontend on 5173 |
| `ModuleNotFoundError: No module named 'google.generativeai'` | Run `pip install google-generativeai` |
| Chat history disappears | `localStorage` may have been cleared — this is expected in incognito mode |

---

## 🚢 Deployment

### Backend (example with Render / Railway)

```bash
# Use the same start command; add your env vars in the hosting dashboard
uvicorn main:app --host 0.0.0.0 --port $PORT
```

### Frontend (example with Vercel / Netlify)

```bash
npm run build
# Deploy the chatbot-frontend/dist folder
```

> **Remember** to update the `fetch` URL in `App.jsx` and the CORS `origins` in `main.py` to match your deployed URLs.

---

## 📄 License

MIT © 2024 — see the [LICENSE](LICENSE) file for details.

---

## 🙌 Acknowledgments

- [Google Gemini API](https://ai.google.dev/) for the AI model
- [FastAPI](https://fastapi.tiangolo.com/) for the Python backend framework
- [Vite](https://vitejs.dev/) for the blazing-fast frontend tooling
- [Phosphor Icons](https://phosphoricons.com/) for icon inspiration
