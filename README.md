<div align="center">

# NEX

### Personal AI, built for conversation.

A modern full-stack AI assistant built with **React**, **FastAPI**, and **Google Gemini**.

<br />

<img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/Python-Dark.svg" height="42" />
&nbsp;
<img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/FastAPI.svg" height="42" />
&nbsp;
<img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/React-Dark.svg" height="42" />
&nbsp;
<img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/Vite-Dark.svg" height="42" />
&nbsp;
<img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/GCP-Dark.svg" height="42" />

<br /><br />

![Status](https://img.shields.io/badge/status-active-111111?style=flat-square)
![Python](https://img.shields.io/badge/Python-3.12+-111111?style=flat-square\&logo=python\&logoColor=white)
![React](https://img.shields.io/badge/React-19-111111?style=flat-square\&logo=react\&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-111111?style=flat-square\&logo=fastapi\&logoColor=white)
![Gemini](https://img.shields.io/badge/Gemini-AI-111111?style=flat-square\&logo=google\&logoColor=white)

</div>

---

## About

**NEX** is a personal AI assistant designed around natural conversation, contextual responses, and a clean user experience.

The project combines a lightweight React interface with a FastAPI backend that handles communication with Google Gemini.

Rather than building another generic chatbot demo, NEX is developed as a real full-stack application with a focus on **UX, architecture, reliability, and deployment**.

---

## Core

```text
Conversation
     │
     ▼
┌──────────────┐
│     NEX      │
│  React / UI  │
└──────┬───────┘
       │
       │ HTTP
       ▼
┌──────────────┐
│   FastAPI    │
│   Backend    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│    Gemini    │
│     API      │
└──────────────┘
```

---

## Features

* **Natural AI conversation**
* **Context-aware chat history**
* **Persistent local chat history**
* **Responsive desktop & mobile interface**
* **Dark / light theme support**
* **FastAPI backend**
* **Gemini-powered responses**
* **Typed request validation with Pydantic**
* **Backend health monitoring**
* **Protected API credentials**
* **Clean separation between frontend and backend**

---

## Tech Stack

| Layer             | Technology    |
| ----------------- | ------------- |
| Frontend          | React 19      |
| Build Tool        | Vite          |
| Backend           | FastAPI       |
| Language          | Python        |
| AI                | Google Gemini |
| Validation        | Pydantic      |
| Configuration     | python-dotenv |
| API Communication | REST          |
| Version Control   | Git           |

---

## Project Structure

```text
nex-ai/
│
├── chatbot-backend/
│   ├── main.py
│   ├── requirements.txt
│   └── .env
│
├── chatbot-frontend/
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── App.css
│       └── index.css
│
├── .gitignore
└── README.md
```

> `.env`, virtual environments, dependencies, and generated build files are excluded from version control.

---

## Local Development

### Requirements

* Python 3.12+
* Node.js 18+
* npm
* Google Gemini API key

### Backend

```bash
cd chatbot-backend

python -m venv .venv
```

Windows:

```powershell
.venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create:

```text
chatbot-backend/.env
```

```env
GEMINI_API_KEY=your_api_key
MODEL=gemini-3.6-flash
```

Start the API:

```bash
uvicorn main:app --reload
```

Backend:

```text
http://localhost:8000
```

API documentation:

```text
http://localhost:8000/docs
```

---

### Frontend

Open another terminal:

```bash
cd chatbot-frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## API

### Health

```http
GET /
```

Example:

```json
{
  "status": "ok",
  "service": "NEX AI",
  "model": "gemini-3.6-flash"
}
```

### Chat

```http
POST /chat
Content-Type: application/json
```

Request:

```json
{
  "user_message": "What is FastAPI?",
  "messages": []
}
```

Response:

```json
{
  "response": "FastAPI is a modern Python web framework...",
  "model": "gemini-3.6-flash"
}
```

---

## Environment

The Gemini API key is loaded exclusively through environment variables.

```env
GEMINI_API_KEY=your_api_key
MODEL=gemini-3.6-flash
```

**Never commit `.env` or expose API credentials in the frontend.**

---

## Development Philosophy

NEX is built around a few simple principles:

```text
Clean UI
   +
Useful AI
   +
Simple Architecture
   +
Real Deployment
```

The goal is not to make the biggest AI application.

The goal is to make one that feels **intentional, useful, and complete**.

---

## Status

```text
NEX
├── Frontend       ✓
├── FastAPI API    ✓
├── Gemini         ✓
├── Chat History   ✓
├── Responsive UI  ✓
└── Deployment     → In progress
```

---

## License

MIT License

---

<div align="center">

### NEX

**Built with curiosity, caffeine, and questionable amounts of debugging.**

</div>
