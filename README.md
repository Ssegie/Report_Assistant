# Mini Regulatory Report Assistant

## Backend (FastAPI)
cd backend
python -m venv venv
source venv/bin/activate   # or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn app:app --reload --port 8000

Endpoints:
- POST /process-report  { "report": "..." }
- GET /reports
- GET /translate?outcome=<outcome>&lang=fr|sw

## Frontend (React + Vite)
cd frontend
npm install
npm run dev
Open http://localhost:5173

Set env VITE_BACKEND_URL to point to backend if deployed.

## Notes
- The backend uses a simple rule-based extractor. For production, use spaCy or a clinical NER model and proper term normalization (MedDRA).
