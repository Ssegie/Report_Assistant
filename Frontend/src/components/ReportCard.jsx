import { useState } from "react";
import axios from "axios";

export default function ReportCard({ report }) {
  const [translations, setTranslations] = useState({});
  const [loadingLang, setLoadingLang] = useState("");

  const handleTranslate = async (lang) => {
    setLoadingLang(lang);
    try {
      const res = await axios.post("http://localhost:8000/api/translate/", {
        outcome: report.outcome,
        lang: lang,
      });
      setTranslations((prev) => ({
        ...prev,
        [lang]: res.data.translated,
      }));
    } catch (err) {
      console.error(err);
      alert("Translation failed. Please try again.");
    } finally {
      setLoadingLang("");
    }
  };

  return (
    <div className="border p-4 rounded shadow my-2">
      <p><strong>Drug:</strong> {report.drug}</p>
      <p><strong>Adverse Events:</strong> {report.adverse_events.join(", ")}</p>
      <p><strong>Severity:</strong> {report.severity}</p>
      <p><strong>Outcome:</strong> {report.outcome}</p>

      <div className="mt-2 flex gap-2">
        <button
          onClick={() => handleTranslate("fr")}
          disabled={loadingLang === "fr"}
          className="px-2 py-1 bg-blue-500 text-white rounded"
        >
          {loadingLang === "fr" ? "Translating to French..." : "Translate to French"}
        </button>

        <button
          onClick={() => handleTranslate("sw")}
          disabled={loadingLang === "sw"}
          className="px-2 py-1 bg-green-500 text-white rounded"
        >
          {loadingLang === "sw" ? "Translating to Kiswahili..." : "Translate to Kiswahili"}
        </button>
      </div>

      {translations.fr && (
        <p className="mt-2"><strong>French:</strong> {translations.fr}</p>
      )}
      {translations.sw && (
        <p className="mt-2"><strong>Kiswahili:</strong> {translations.sw}</p>
      )}

      <p className="text-gray-500 text-sm mt-2">{new Date(report.created_at).toLocaleString()}</p>
    </div>
  );
}
