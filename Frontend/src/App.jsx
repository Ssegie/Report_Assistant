import React, { useState, useEffect } from "react";
import ReportForm from "./components/ReportForm";
import ReportCard from "./components/ReportCard";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export default function App(){
  const [lastResult, setLastResult] = useState(null);
  const [history, setHistory] = useState([]);

  async function handleProcess(reportText){
    const resp = await fetch(`${BACKEND}/process-report`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({report: reportText})
    });
    const data = await resp.json();
    setLastResult(data);
    // update history
    fetchReports();
  }

  async function fetchReports(){
    try{
      const r = await fetch(`${BACKEND}/reports`);
      const arr = await r.json();
      setHistory(arr);
    }catch(e){
      // ignore if backend has no /reports
    }
  }

  useEffect(()=>{ fetchReports(); }, []);

  return (
    <div className="container">
      <h1>Mini Regulatory Report Assistant</h1>
      <ReportForm onProcess={handleProcess} />
      { lastResult && <ReportCard result={lastResult} backend={BACKEND} onTranslate={(updated)=>setLastResult(updated)} /> }
      <hr/>
      <h2>History</h2>
      <div className="history">
        {history.length===0 ? <p>No saved reports yet.</p> :
          history.map(h => <div key={h.id} className="history-card">
            <strong>{h.drug || "—"}</strong>
            <div>Events: {h.adverse_events.join(", ")}</div>
            <div>Severity: {h.severity}</div>
            <div>Outcome: {h.outcome}</div>
          </div>)
        }
      </div>
    </div>
  );
}
