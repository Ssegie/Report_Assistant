import re

def process_report_text(text: str):
    drug_match = re.search(r"\bDrug\s+([A-Z]\w*)", text)
    drug = drug_match.group(0) if drug_match else None

    # simple adverse event detection
    events = []
    for ev in ["nausea", "headache", "dizziness", "fever", "rash"]:
        if ev in text.lower():
            events.append(ev)

    severity_match = re.search(r"\b(mild|moderate|severe)\b", text.lower())
    severity = severity_match.group(0) if severity_match else None

    outcome_match = re.search(r"\b(recovered|ongoing|fatal)\b", text.lower())
    outcome = outcome_match.group(0) if outcome_match else None

    return {
        "drug": drug,
        "adverse_events": events,
        "severity": severity,
        "outcome": outcome,
    }
