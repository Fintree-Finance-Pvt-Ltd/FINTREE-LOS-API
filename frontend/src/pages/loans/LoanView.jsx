import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../../services/api";

export default function LoanView() {
  const { id } = useParams();
  const nav = useNavigate();
  const [row, setRow] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/loans/${id}`);
      setRow(data?.data || null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!row) return <p>Not found</p>;

  return (
    <div>
      <h2>Loan #{row.id}</h2>
      <p><b>Application No:</b> {row.application_no || "-"}</p>
      <p><b>Customer:</b> {row.customer_name}</p>
      <p><b>Amount:</b> {row.loan_amount}</p>
      <p><b>Status:</b> {row.status}</p>
      <p><b>Dealer:</b> {row.dealer_id || "-"}</p>
      <p><b>Partner:</b> {row.partner_id || "-"}</p>

      <div style={{ marginTop: 12 }}>
        <Link to={`/docs/upload/${row.id}`}>Upload Documents</Link>
      </div>

      <div style={{ marginTop: 12 }}>
        <button onClick={() => nav(-1)}>Back</button>
      </div>
    </div>
  );
}
