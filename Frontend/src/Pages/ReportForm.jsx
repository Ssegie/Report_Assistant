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

      // Structured submission
      if (drug && adverseEvent && severity && outcome) {
        formData.append("drug", drug);
        formData.append("adverse_events", adverseEvent); // ✅ plural
        formData.append("severity", severity);
        formData.append("outcome", outcome);
      } 
      // Free-text submission (from textarea or file)
      else if (reportText.trim() || file) {
        if (reportText.trim()) formData.append("report_text", reportText);
      } 
      else {
        setError("Please fill all structured fields OR provide report text/file");
        setLoading(false);
        return;
      }

      if (file) formData.append("file", file);

      // 🔍 DEBUG: log all FormData keys/values
      console.log("🚀 Sending FormData:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const res = await axios.post(
        "https://report-assistant.onrender.com/api/process-report/",
        formData,
        { timeout: 20000 }
      );

      onReportProcessed(res.data);

      // Reset form
      setDrug("");
      setAdverseEvent("");
      setSeverity("");
      setOutcome("");
      setReportText("");
      setFile(null);
      document.querySelector('input[type="file"]').value = "";
    } catch (err) {
      console.error("❌ Backend error:", err);

      if (err.response) setError(err.response.data?.error || "Server error occurred");
      else if (err.request)
        setError("No response from server. Check if backend is running & CORS enabled.");
      else setError("Request setup failed: " + err.message);
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
        <select value={adverseEvent} onChange={(e) => setAdverseEvent(e.target.value)}>
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
