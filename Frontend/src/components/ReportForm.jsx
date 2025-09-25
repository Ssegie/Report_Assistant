import React, {useState} from "react";

export default function ReportForm({onProcess}){
  const [text, setText] = useState("");
  return (
    <div className="form">
      <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Paste adverse event report here..." rows={6}></textarea>
      <div className="buttons">
        <button onClick={()=>onProcess(text)}>Process Report</button>
      </div>
    </div>
  );
}
