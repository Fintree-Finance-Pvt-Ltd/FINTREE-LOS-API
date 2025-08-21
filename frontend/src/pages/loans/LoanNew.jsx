import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function LoanNew() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    loan_amount: "",
    dealer_id: "",
    partner_id: "",
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const set = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const save = async () => {
    setSaving(true);
    setMsg("");
    try {
      const payload = {
        ...form,
        loan_amount: form.loan_amount ? Number(form.loan_amount) : null,
        dealer_id: form.dealer_id ? Number(form.dealer_id) : null,
        partner_id: form.partner_id ? Number(form.partner_id) : null,
      };
      const { data } = await api.post("/loans", payload);
      const id = data?.data?.id;
      setMsg("Created!");
      if (id) nav(`/loans/${id}`);
    } catch (e) {
      setMsg(e?.response?.data?.message || e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2>Create Loan</h2>
      <div style={{ display: "grid", gap: 10, maxWidth: 520 }}>
        <label>
          Customer Name
          <input value={form.customer_name} onChange={(e) => set("customer_name", e.target.value)} />
        </label>

        <label>
          Email
          <input value={form.customer_email} onChange={(e) => set("customer_email", e.target.value)} />
        </label>

        <label>
          Phone
          <input value={form.customer_phone} onChange={(e) => set("customer_phone", e.target.value)} />
        </label>

        <label>
          Loan Amount
          <input type="number" value={form.loan_amount} onChange={(e) => set("loan_amount", e.target.value)} />
        </label>

        <label>
          Dealer ID (optional)
          <input value={form.dealer_id} onChange={(e) => set("dealer_id", e.target.value)} />
        </label>

        <label>
          Partner ID (optional)
          <input value={form.partner_id} onChange={(e) => set("partner_id", e.target.value)} />
        </label>

        <button onClick={save} disabled={saving}>
          {saving ? "Saving..." : "Create"}
        </button>
        {msg && <p style={{ color: "#e11d48" }}>{msg}</p>}
      </div>
    </div>
  );
}
