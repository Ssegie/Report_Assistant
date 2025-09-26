import { useState } from "react";
import axios from "axios";
import './ReportCard.css'; // Import the CSS

export default function ReportCard({ report }) {
  const [translation, setTranslation] = useState({});

  const handleTranslate = async (lang) => {
    try {
      const res = await axios.post("http://localhost:8000/api/translate/", {
        text: report.outcome,
        lang,
      });
      setTranslation((prev) => ({ ...prev, [lang]: res.data.translated }));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="report-card">
      <h3>Drug: {report.drug}</h3>
      <p><strong>Adverse Events:</strong> {report.adverse_events.join(", ")}</p>
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

      {translation.fr && <p className="translation"><strong>French:</strong> {translation.fr}</p>}
      {translation.sw && <p className="translation"><strong>Kiswahili:</strong> {translation.sw}</p>}
    </div>
  );
}
