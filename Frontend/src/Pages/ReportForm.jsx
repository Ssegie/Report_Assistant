import { useState } from "react";
import axios from "axios";
import './ReportForm.css'; 

export default function ReportForm({ onReportProcessed }) {
  const [drug, setDrug] = useState("");
  const [adverseEvent, setAdverseEvent] = useState("");
  const [severity, setSeverity] = useState("");
  const [outcome, setOutcome] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const adverseOptions = ["Nausea", "Headache", "Dizziness", "Fatigue", "Rash"];
  const severityOptions = ["Mild", "Moderate", "Severe"];
  const outcomeOptions = ["Recovered", "Ongoing", "Fatal"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!drug.trim()) return setError("Drug name is required");
    if (!adverseEvent) return setError("Select an adverse event");
    if (!severity) return setError("Select severity");
    if (!outcome) return setError("Select outcome");

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("drug", drug);
      formData.append("adverse_events", adverseEvent); // single value, backend can split
      formData.append("severity", severity);
      formData.append("outcome", outcome);
      if (file) formData.append("file", file);

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
      setFile(null);
    } catch (err) {
      console.error(err);
      setError("Failed to submit report");
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
            <option key={ae} value={ae}>{ae}</option>
          ))}
        </select>

        <label>Severity</label>
        <select value={severity} onChange={(e) => setSeverity(e.target.value)}>
          <option value="">Select severity</option>
          {severityOptions.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <label>Outcome</label>
        <select value={outcome} onChange={(e) => setOutcome(e.target.value)}>
          <option value="">Select outcome</option>
          {outcomeOptions.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>

        <label>Attach File (optional)</label>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />

        {error && <p className="error-message">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Submit Report"}
        </button>
      </form>
    </div>
  );
}
