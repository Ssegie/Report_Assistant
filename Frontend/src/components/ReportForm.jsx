import { useState } from "react";
import axios from "axios";

export default function ReportForm({ onReportProcessed }) {
  const [reportText, setReportText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reportText.trim()) return setError("Report cannot be empty");

    setLoading(true);
    setError("");

    try {
      const res = await axios.post("http://localhost:8000/api/process-report/", {
        report: reportText,
      });
      onReportProcessed(res.data);
      setReportText(""); // clear input
    } catch (err) {
      console.error(err);
      setError("Failed to process report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded shadow">
      <textarea
        rows={5}
        placeholder="Paste medical report here..."
        value={reportText}
        onChange={(e) => setReportText(e.target.value)}
        className="w-full p-2 border rounded"
      />
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <button
        type="submit"
        className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
        disabled={loading}
      >
        {loading ? "Processing..." : "Process Report"}
      </button>
    </form>
  );
}
