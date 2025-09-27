import { useEffect, useState } from "react";
import { api } from "../api";
import ReportCard from "../components/ReportCard";

export default function ReportHistory() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/reports/");
      const normalizedReports = res.data.map(r => ({
        ...r,
        adverse_events: Array.isArray(r.adverse_events)
          ? r.adverse_events
          : r.adverse_events ? r.adverse_events.split(",") : [],
      }));
      setReports(normalizedReports);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch reports.");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchReports(); }, []);

  if (loading) return <p>Loading reports...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!reports.length) return <p>No reports found.</p>;

  return (
    <div>
      {reports.map(report => <ReportCard key={report.id} report={report} />)}
    </div>
  );
}
