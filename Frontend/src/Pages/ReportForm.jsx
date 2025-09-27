import { useState } from "react";
import axios from "axios";
import "./ReportForm.css";

export default function ReportForm({ onReportProcessed }) {
  const [drug, setDrug] = useState("");
  const [adverseEvent, setAdverseEvent] = useState("");
  const [severity, setSeverity] = useState("");
  const [outcome, setOutcome] = useState("");
  const [reportText, setReportText] = useState(""); 
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const adverseOptions = ["Nausea", "Headache", "Dizziness", "Fatigue", "Rash"];
  const severityOptions = ["Mild", "Moderate", "Severe"];
  const outcomeOptions = ["Recovered", "Ongoing", "Fatal"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();

      if (drug && adverseEvent && severity && outcome) {
        // ✅ Structured submission
        formData.append("drug", drug);
        formData.append("adverse_event", adverseEvent); // singular key
        formData.append("severity", severity);
        formData.append("outcome", outcome);
      } else if (reportText.trim() || file) {
        // ✅ Free-text submission
        if (reportText.trim()) {
          formData.append("report_text", reportText);
        }
      } else {
        setError("Please fill structured fields or provide a report text/file");
        setLoading(false);
        return;
      }

      if (file) {
        formData.append("file", file);
      }

      const res = await axios.post(
        "https://report-assistant.onrender.com/api/process-report/",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      onReportProcessed(res.data);

      // Reset form
      setDrug("");
      setAdverseEvent("");
      setSeverity("");
      setOutcome("");
      setReportText("");
      setFile(null);
    } catch (err) {
      console.error("❌ Backend error:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Failed to submit report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-header">Submit Medical Report</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <label>Drug Name</label>
        <input
          type="text"
          placeholder="e.g., Drug X"
          value={drug}
          onChange={(e) => setDrug(e.target.value)}
        />

        <label>Adverse Event</label>
        <select
          value={adverseEvent}
          onChange={(e) => setAdverseEvent(e.target.value)}
        >
          <option value="">Select an adverse event</option>
          {adverseOptions.map((ae) => (
            <option key={ae} value={ae}>
              {ae}
            </option>
          ))}
        </select>

        <label>Severity</label>
        <select value={severity} onChange={(e) => setSeverity(e.target.value)}>
          <option value="">Select severity</option>
          {severityOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <label>Outcome</label>
        <select value={outcome} onChange={(e) => setOutcome(e.target.value)}>
          <option value="">Select outcome</option>
          {outcomeOptions.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>

        <label>Or Paste Full Report Text</label>
        <textarea
          placeholder="Paste full report here if you don’t want to fill individual fields"
          value={reportText}
          onChange={(e) => setReportText(e.target.value)}
        />

        <label>Attach File (optional)</label>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />

        {error && <p className="error-message">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Submit Report"}
        </button>
      </form>
    </div>
  );
}
