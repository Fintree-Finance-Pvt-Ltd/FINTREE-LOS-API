import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function DealerCreate() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: "",
    type: "new",
    contact_email: "",
    contact_phone: "",
    address: "",
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const set = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const save = async () => {
    setSaving(true);
    setMsg("");
    try {
      await api.post("/dealers", form);
      setMsg("Dealer created.");
      nav("/dealers");
    } catch (e) {
      setMsg(e?.response?.data?.message || e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2>Create Dealer</h2>
      <div style={{ display: "grid", gap: 10, maxWidth: 520 }}>
        <label>
          Name
          <input value={form.name} onChange={(e) => set("name", e.target.value)} />
        </label>
        <label>
          Type
          <select value={form.type} onChange={(e) => set("type", e.target.value)}>
            <option value="existing">existing</option>
            <option value="new">new</option>
          </select>
        </label>
        <label>
          Email
          <input value={form.contact_email} onChange={(e) => set("contact_email", e.target.value)} />
        </label>
        <label>
          Phone
          <input value={form.contact_phone} onChange={(e) => set("contact_phone", e.target.value)} />
        </label>
        <label>
          Address
          <textarea rows={3} value={form.address} onChange={(e) => set("address", e.target.value)} />
        </label>

        <button onClick={save} disabled={saving}>{saving ? "Saving..." : "Create"}</button>
        {msg && <p style={{ color: "#e11d48" }}>{msg}</p>}
      </div>
    </div>
  );
}
