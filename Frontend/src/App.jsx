import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ReportForm from "./Pages/ReportForm";
import ReportHistory from "./Pages/ReportHistory";
import SeverityChart from "./Pages/SeverityChart";

export default function App() {
  const [latestReport, setLatestReport] = useState(null);

  return (
    <Router>
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-green-600 text-white p-6 flex flex-col gap-4">
          <h1 className="text-2xl font-bold mb-4">Medical Reports</h1>
          <Link to="/" className="hover:underline">Submit Report</Link>
          <Link to="/history" className="hover:underline">Report History</Link>
          <Link to="/severity" className="hover:underline">Severity Chart</Link>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto bg-gray-100">
          <Routes>
            <Route
              path="/"
              element={<ReportForm onReportProcessed={setLatestReport} />}
            />
            <Route path="/history" element={<ReportHistory />} />
            <Route path="/severity" element={<SeverityChart />} />
          </Routes>

          {/* Latest report can still appear on the form page */}
          {latestReport && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold">Latest Report</h2>
              <div className="p-4 bg-white shadow rounded">
                <p><strong>Drug:</strong> {latestReport.drug}</p>
                <p><strong>Adverse Events:</strong> {latestReport.adverse_events.join(", ")}</p>
                <p><strong>Severity:</strong> {latestReport.severity}</p>
                <p><strong>Outcome:</strong> {latestReport.outcome}</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </Router>
  );
}
