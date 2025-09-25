# backend/app.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import re
import sqlite3
from typing import List, Optional
import uvicorn

# Optional: basic translation map
TRANSLATIONS = {
    "fr": {"recovered": "rétabli", "ongoing": "en cours", "fatal": "mortel"},
    "sw": {"recovered": "amepona", "ongoing": "inaendelea", "fatal": "kifo"}
}

app = FastAPI(title="Mini Regulatory Report Assistant")

# SQLite DB helpers (simple)
DB_PATH = "reports.db"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("""
    CREATE TABLE IF NOT EXISTS reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        original TEXT,
        drug TEXT,
        adverse_events TEXT,
        severity TEXT,
        outcome TEXT
    )
    """)
    conn.commit()
    conn.close()

init_db()

class ReportIn(BaseModel):
    report: str

class ReportOut(BaseModel):
    drug: Optional[str]
    adverse_events: List[str]
    severity: Optional[str]
    outcome: Optional[str]

# Helper extraction logic (rule-based + simple NLP)
COMMON_ADVERSE_EVENTS = [
    "nausea","headache","dizziness","rash","fatigue","vomiting","fever","diarrhea","pain","insomnia"
]

SEVERITY_KEYWORDS = {
    "severe": ["severe","serious","intense","critical"],
    "moderate": ["moderate","significant"],
    "mild": ["mild","slight","minor"]
}

OUTCOME_KEYWORDS = {
    "recovered": ["recovered","resolved","resolved completely","improved"],
    "ongoing": ["ongoing","continued","persisting","stable"],
    "fatal": ["died","death","fatal"]
}

def extract_drug(text):
    # simple regex looking for "Drug X" or "drug X" or "DrugName"
    m = re.search(r'\b([Dd]rug\s+[A-Za-z0-9\-]+)\b', text)
    if m:
        return m.group(1)
    # fallback: look for capitalized token followed by whitespace + optional generic words
    m2 = re.search(r'\b([A-Z][a-zA-Z0-9\-]{1,30})\b', text)
    return m2.group(1) if m2 else None

def extract_adverse_events(text):
    found = []
    t = text.lower()
    for ev in COMMON_ADVERSE_EVENTS:
        if re.search(r'\b' + re.escape(ev) + r'\b', t):
            found.append(ev)
    # also look for pattern "experienced X and Y"
    m = re.search(r'experienc(?:ed|es)?\s+([a-z, and]+)', t)
    if m:
        # split by comma/and
        parts = re.split(r',|\band\b', m.group(1))
        for p in parts:
            p = p.strip()
            # pick nouns (approx)
            if len(p) > 2 and p not in found:
                # cleanup trailing words
                p = re.sub(r'[^a-z\s\-]', '', p)
                found.append(p)
    return found

def detect_severity(text):
    t = text.lower()
    for sev, words in SEVERITY_KEYWORDS.items():
        for w in words:
            if w in t:
                return sev
    return "moderate"  # default guess

def detect_outcome(text):
    t = text.lower()
    for oc, words in OUTCOME_KEYWORDS.items():
        for w in words:
            if w in t:
                return oc
    return "unknown"

def save_report(original, drug, events, severity, outcome):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute(
        "INSERT INTO reports (original, drug, adverse_events, severity, outcome) VALUES (?, ?, ?, ?, ?)",
        (original, drug, ",".join(events), severity, outcome)
    )
    conn.commit()
    last_id = c.lastrowid
    conn.close()
    return last_id

@app.post("/process-report", response_model=ReportOut)
def process_report(payload: ReportIn):
    text = payload.report.strip()
    if not text:
        raise HTTPException(400, "Empty report")
    drug = extract_drug(text)
    adverse_events = extract_adverse_events(text)
    severity = detect_severity(text)
    outcome = detect_outcome(text)

    # Save to DB
    save_report(text, drug or "", adverse_events, severity, outcome)

    return {
        "drug": drug,
        "adverse_events": adverse_events,
        "severity": severity,
        "outcome": outcome
    }

@app.get("/reports")
def get_reports():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT id, original, drug, adverse_events, severity, outcome FROM reports ORDER BY id DESC")
    rows = c.fetchall()
    conn.close()
    res = []
    for r in rows:
        res.append({
            "id": r[0],
            "original": r[1],
            "drug": r[2],
            "adverse_events": r[3].split(",") if r[3] else [],
            "severity": r[4],
            "outcome": r[5]
        })
    return res

@app.get("/translate")
def translate_outcome(outcome: str, lang: str = "fr"):
    outcome_lower = outcome.lower()
    if lang in TRANSLATIONS and outcome_lower in TRANSLATIONS[lang]:
        return {"translated": TRANSLATIONS[lang][outcome_lower]}
    # fallback: return original with note
    return {"translated": outcome}

# If running standalone
if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
