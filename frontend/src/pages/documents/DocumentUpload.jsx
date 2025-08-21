import React, { useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";

export default function DocumentUpload() {
  const { loanId } = useParams();
  const [files, setFiles] = useState([]);
  const [docType, setDocType] = useState("GENERIC");
  const [msg, setMsg] = useState("");

  const submit = async () => {
    setMsg("");
    try {
      const fd = new FormData();
      for (const f of files) fd.append("files", f);
      fd.append("doc_type", docType);
      await api.post(`/docs/loan/${loanId}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      setMsg("Uploaded successfully.");
      setFiles([]);
    } catch (e) {
      setMsg(e?.response?.data?.message || e.message);
    }
  };

  return (
    <div>
      <h2>Upload Documents for Loan #{loanId}</h2>
      <div style={{ display: "grid", gap: 10, maxWidth: 520 }}>
        <label>
          Document Type
          <select value={docType} onChange={(e) => setDocType(e.target.value)}>
            <option>AADHAAR</option>
            <option>PAN</option>
            <option>BANK_STMT</option>
            <option>INCOME_DOC</option>
            <option value="GENERIC">GENERIC</option>
          </select>
        </label>
        <input multiple type="file" onChange={(e) => setFiles([...e.target.files])} />
        <button onClick={submit}>Upload</button>
        {msg && <p style={{ color: "#16a34a" }}>{msg}</p>}
      </div>
    </div>
  );
}
