import { useState } from "react";
import axios from "axios";
import './ReportForm.css'; // Import the CSS

export default function ReportForm({ onReportProcessed }) {
  const [reportText, setReportText] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reportText.trim() && !file) return setError("Report text or file is required");
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("report", reportText);
    if (file) formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:8000/api/process-report/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onReportProcessed(res.data);
      setReportText("");
      setFile(null);
    } catch (err) {
      console.error(err);
      setError("Failed to process report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="report-form">
      <h2>Submit Medical Report</h2>

      <textarea
        rows={5}
        placeholder="Paste report here..."
        value={reportText}
        onChange={(e) => setReportText(e.target.value)}
      />

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      {error && <p className="error">{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? "Processing..." : "Process Report"}
      </button>
    </form>
  );
}
