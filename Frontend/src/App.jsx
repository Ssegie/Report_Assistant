import { useState } from "react";
import ReportForm from "./components/ReportForm";
import ReportCard from "./components/ReportCard";
import ReportHistory from "./components/ReportHistory";
import SeverityChart from "./components/SeverityChart";

export default function App() {
  const [latestReport, setLatestReport] = useState(null);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Medical Report Assistant</h1>

      <ReportForm onReportProcessed={setLatestReport} />

      {latestReport && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Latest Report</h2>
          <ReportCard report={latestReport} />
        </div>
      )}

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Report History</h2>
        <ReportHistory />
      </div>
    </div>
  );
}
