import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

export default function LoanList() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/loans");
      setRows(data?.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <h2>Loans</h2>
      <div style={{ margin: "10px 0" }}>
        <Link to="/loans/new">+ New Loan</Link>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : rows.length ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Application No</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Dealer</th>
              <th>Partner</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td><Link to={`/loans/${r.id}`}>{r.id}</Link></td>
                <td>{r.application_no || "-"}</td>
                <td>{r.customer_name}</td>
                <td>{r.loan_amount}</td>
                <td>{r.status}</td>
                <td>{r.dealer_id || "-"}</td>
                <td>{r.partner_id || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No loans yet.</p>
      )}
    </div>
  );
}
