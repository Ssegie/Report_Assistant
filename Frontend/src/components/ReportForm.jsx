import { useState } from "react";
import axios from "axios";

export default function ReportForm({ onReportProcessed }) {
  const [reportText, setReportText] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reportText.trim()) return setError("Report cannot be empty");

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("report", reportText);
      if (file) formData.append("file", file);

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
    <form onSubmit={handleSubmit} className="p-4 border rounded shadow">
      <textarea
        rows={5}
        placeholder="Paste medical report here..."
        value={reportText}
        onChange={(e) => setReportText(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="mt-2"
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
