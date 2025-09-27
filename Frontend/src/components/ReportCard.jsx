import { useState } from "react";
import axios from "axios";
import './ReportCard.css';

export default function ReportCard({ report }) {
  const [translation, setTranslation] = useState({});

  const handleTranslate = async (lang) => {
    try {
      const res = await api.post("/translate/", {
        outcome: report.outcome, // matches backend
        lang,
      });
      setTranslation((prev) => ({ ...prev, [lang]: res.data.translated }));
    } catch (err) {
      console.error("Translation error:", err);
    }
  };

  return (
    <div className="report-card">
      <h3>Drug: {report.drug}</h3>
      <p><strong>Adverse Event:</strong> {report.adverse_events}</p>
      <p><strong>Severity:</strong> {report.severity}</p>
      <p><strong>Outcome:</strong> {report.outcome}</p>

      <div className="button-group">
        <button onClick={() => handleTranslate("fr")} className="translate-btn">
          French
        </button>
        <button onClick={() => handleTranslate("sw")} className="translate-btn">
          Kiswahili
        </button>
      </div>

      {translation.fr && (
        <p className="translation"><strong>French:</strong> {translation.fr}</p>
      )}
      {translation.sw && (
        <p className="translation"><strong>Kiswahili:</strong> {translation.sw}</p>
      )}
    </div>
  );
}
