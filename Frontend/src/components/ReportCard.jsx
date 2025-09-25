import React from "react";

export default function ReportCard({result, backend, onTranslate}){
  async function translate(lang){
    try{
      const q = new URLSearchParams({outcome: result.outcome || "", lang});
      const r = await fetch(`${backend}/translate?${q.toString()}`);
      const d = await r.json();
      onTranslate({...result, translated: d.translated});
    }catch(e){
      console.error(e);
    }
  }
  return (
    <div className="card">
      <h3>Processed Result</h3>
      <div><strong>Drug:</strong> {result.drug || "—"}</div>
      <div><strong>Adverse Events:</strong> {result.adverse_events.join(", ") || "—"}</div>
      <div><strong>Severity:</strong> {result.severity || "—"}</div>
      <div><strong>Outcome:</strong> {result.outcome || "—"} {result.translated && <em> ({result.translated})</em>}</div>

      <div className="translate-buttons">
        <button onClick={()=>translate("fr")}>Translate Outcome → French</button>
        <button onClick={()=>translate("sw")}>Translate Outcome → Swahili</button>
      </div>
    </div>
  );
}
