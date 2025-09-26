import { useState } from "react";
import axios from "axios";

export default function ReportCard({ report }) {
  const [translation, setTranslation] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
    setLoading(true);
    try {
      // Send both keys, backend can pick whichever it expects
      const res = await axios.post("http://localhost:8000/api/translate/", {
        text: report.outcome,
        outcome: report.outcome,
        lang: "fr" // or "sw"
      });
      setTranslation(res.data.translated || "Translation unavailable");
    } catch (err) {
      console.error("Translation error:", err);
      setTranslation("Translation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border p-4 rounded shadow my-2">
      <p><strong>Drug:</strong> {report.drug}</p>
      <p><strong>Adverse Events:</strong> {report.adverse_events.join(", ")}</p>
      <p><strong>Severity:</strong> {report.severity}</p>
      <p><strong>Outcome:</strong> {report.outcome}</p>
      {translation && <p><strong>Translated:</strong> {translation}</p>}
      <button
        onClick={handleTranslate}
        disabled={loading}
        className="mt-2 px-2 py-1 bg-blue-500 text-white rounded"
      >
        {loading ? "Translating..." : "Translate Outcome"}
      </button>
      <p className="text-gray-500 text-sm">
        {new Date(report.created_at).toLocaleString()}
      </p>
    </div>
  );
}
