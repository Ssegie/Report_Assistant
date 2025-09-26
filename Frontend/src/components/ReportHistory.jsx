import { useEffect, useState } from "react";
import axios from "axios";
import ReportCard from "./ReportCard";

export default function ReportHistory() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:8000/api/reports/")
      .then(res => setReports(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading history...</p>;
  if (reports.length === 0) return <p>No reports yet.</p>;

  return (
    <div>
      {reports.map(r => (
        <ReportCard key={r.id} report={r} />
      ))}
    </div>
  );
}
