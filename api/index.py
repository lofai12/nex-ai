import sys
from pathlib import Path

from fastapi import FastAPI

backend_dir = Path(__file__).resolve().parent.parent / "chatbot-backend"
sys.path.insert(0, str(backend_dir))

from main import app as backend_app

app = FastAPI()

app.mount("/api", backend_app)