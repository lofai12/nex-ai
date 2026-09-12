import sys
from pathlib import Path

backend_dir = Path(__file__).resolve().parent.parent / "chatbot-backend"
sys.path.insert(0, str(backend_dir))

from main import app
