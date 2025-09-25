import re

COMMON_ADVERSE_EVENTS = ["nausea","headache","dizziness","rash","fatigue","vomiting","fever","diarrhea","pain","insomnia"]

SEVERITY_KEYWORDS = {
    "severe": ["severe","serious","intense","critical"],
    "moderate": ["moderate","significant"],
    "mild": ["mild","slight","minor"]
}

OUTCOME_KEYWORDS = {
    "recovered": ["recovered","resolved","improved"],
    "ongoing": ["ongoing","persisting","stable"],
    "fatal": ["died","death","fatal"]
}

def extract_drug(text):
    m = re.search(r"\bDrug\s+[A-Za-z0-9\-]+", text)
    return m.group(0) if m else None

def extract_adverse_events(text):
    return [ev for ev in COMMON_ADVERSE_EVENTS if ev in text.lower()]

def detect_severity(text):
    for sev, words in SEVERITY_KEYWORDS.items():
        if any(w in text.lower() for w in words):
            return sev
    return "moderate"

def detect_outcome(text):
    for oc, words in OUTCOME_KEYWORDS.items():
        if any(w in text.lower() for w in words):
            return oc
    return "unknown"
