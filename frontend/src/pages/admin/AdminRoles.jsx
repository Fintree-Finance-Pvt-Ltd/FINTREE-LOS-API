import React, { useEffect, useState } from "react";
import api from "../../services/api";

export default function AdminRoles() {
  const [rows, setRows] = useState([]);
  const [seeding, setSeeding] = useState(false);

  const load = async () => {
    try {
      const { data } = await api.get("/admin/roles");
      setRows(data?.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const seed = async () => {
    setSeeding(true);
    try {
      await api.post("/admin/roles/seed");
      await load();
    } catch (e) {
      console.error(e);
    } finally {
      setSeeding(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <h2>Admin • Roles</h2>
      <button onClick={seed} disabled={seeding} style={{ marginBottom: 10 }}>
        {seeding ? "Seeding..." : "Seed Default Roles"}
      </button>
      {rows.length ? (
        <table>
          <thead>
            <tr><th>ID</th><th>Name</th><th>Description</th></tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.name}</td>
                <td>{r.description || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : <p>No roles found.</p>}
    </div>
  );
}
