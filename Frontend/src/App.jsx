import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import ReportForm from "./Pages/ReportForm";
import ReportHistory from "./Pages/ReportHistory";
import SeverityChart from "./Pages/SeverityChart";

export default function App() {
  const [latestReport, setLatestReport] = useState(null);

  return (
    <Router>
      <div className="app-container flex h-screen w-screen overflow-hidden">
        {/* Sidebar */}
        <aside className="sidebar flex-shrink-0">
          <h1 className="sidebar-title">Medical Reports</h1>
          <nav className="sidebar-nav flex flex-col gap-2">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              Submit Report
            </NavLink>
            <NavLink
              to="/history"
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              Report History
            </NavLink>
            <NavLink
              to="/severity"
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              Severity Chart
            </NavLink>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="main-content flex-1 overflow-auto p-6">
          <Routes>
            <Route
              path="/"
              element={<ReportForm onReportProcessed={setLatestReport} />}
            />
            <Route path="/history" element={<ReportHistory />} />
            <Route path="/severity" element={<SeverityChart />} />
          </Routes>

          {/* Latest report preview on form page */}
          {latestReport && (
            <div className="latest-report-container mt-6 p-6 bg-green-600 text-white rounded shadow">
              <h2 className="text-xl font-semibold mb-2">Latest Report</h2>
              <p><strong>Drug:</strong> {latestReport.drug}</p>
              <p><strong>Adverse Events:</strong> {latestReport.adverse_events.join(", ")}</p>
              <p><strong>Severity:</strong> {latestReport.severity}</p>
              <p><strong>Outcome:</strong> {latestReport.outcome}</p>
            </div>
          )}
        </main>
      </div>
    </Router>
  );
}
