import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from "recharts";
import './SeverityChart.css';

export default function SeverityChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drugs, setDrugs] = useState([]);
  const [selectedDrug, setSelectedDrug] = useState("All");
  const [allReports, setAllReports] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    if (allReports.length) updateChartData();
  }, [selectedDrug, allReports]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://report-assistant.onrender.com/api/reports/");
      const reports = res.data || [];

      setAllReports(reports);

      // Extract unique drugs
      const uniqueDrugs = Array.from(new Set(reports.map(r => r.drug || "Unknown")));
      setDrugs(["All", ...uniqueDrugs]);
    } catch (err) {
      console.error("Failed to fetch reports for chart", err);
    } finally {
      setLoading(false);
    }
  };

  const updateChartData = () => {
    const filteredReports = selectedDrug === "All" 
      ? allReports 
      : allReports.filter(r => r.drug === selectedDrug);

    const severityOrder = ["Mild", "Moderate", "Severe", "Unknown"];

    const severityCount = filteredReports.reduce((acc, report) => {
      const sev = report.severity || "Unknown";
      acc[sev] = (acc[sev] || 0) + 1;
      return acc;
    }, {});

    const chartData = severityOrder.map(sev => ({
      severity: sev,
      count: severityCount[sev] || 0,
    }));

    setData(chartData);
  };

  if (loading) return <p className="loading">Loading chart...</p>;
  if (!data.length) return <p className="loading">No data to display.</p>;

  return (
    <div className="severity-chart-container">
      <h2>Severity Distribution</h2>

      <div className="drug-filter">
        <label>Filter by Drug:</label>
        <select
          value={selectedDrug}
          onChange={(e) => setSelectedDrug(e.target.value)}
        >
          {drugs.map(drug => (
            <option key={drug} value={drug}>{drug}</option>
          ))}
        </select>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="severity" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
