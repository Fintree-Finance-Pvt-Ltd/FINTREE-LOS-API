import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

export default function DealerList() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/dealers");
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
      <h2>Dealers</h2>
      <div style={{ margin: "10px 0" }}>
        <Link to="/dealers/new">+ New Dealer</Link>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : rows.length ? (
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Name</th><th>Type</th><th>Email</th><th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.name}</td>
                <td>{r.type}</td>
                <td>{r.contact_email || "-"}</td>
                <td>{r.contact_phone || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No dealers yet.</p>
      )}
    </div>
  );
}
