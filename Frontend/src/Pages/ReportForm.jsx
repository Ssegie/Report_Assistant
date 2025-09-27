import { useState } from "react";
import { api } from "../api";   // ✅ use the shared axios instance
import "./ReportForm.css";

export default function ReportForm({ onReportProcessed }) {
  // ... your state hooks

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();

      if (drug && adverseEvent && severity && outcome) {
        formData.append("drug", drug);
        formData.append("adverse_events", adverseEvent);
        formData.append("severity", severity);
        formData.append("outcome", outcome);
      } else if (reportText.trim() || file) {
        if (reportText.trim()) formData.append("report_text", reportText);
      } else {
        setError("Please fill all structured fields OR provide report text/file");
        setLoading(false);
        return;
      }

      if (file) formData.append("file", file);

      console.log("🚀 Sending FormData:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      // ✅ Use the api instance with env var
      const res = await api.post("/process-report/", formData);
      onReportProcessed(res.data);

      // Reset form
      setDrug("");
      setAdverseEvent("");
      setSeverity("");
      setOutcome("");
      setReportText("");
      setFile(null);
      document.querySelector('input[type="file"]').value = "";
    } catch (err) {
      console.error("❌ Backend error:", err);
      if (err.response) setError(err.response.data?.error || "Server error occurred");
      else if (err.request)
        setError("No response from server. Check if backend is running & CORS enabled.");
      else setError("Request setup failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ... your JSX stays the same
}
