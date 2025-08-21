import React, { useEffect, useState } from "react";
import api from "../../services/api";

export default function AdminUsers() {
  const [rows, setRows] = useState([]);

  const load = async () => {
    try {
      const { data } = await api.get("/admin/users");
      setRows(data?.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <h2>Admin • Users</h2>
      {rows.length ? (
        <table>
          <thead>
            <tr><th>ID</th><th>Email</th><th>Roles</th></tr>
          </thead>
          <tbody>
            {rows.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.email}</td>
                <td>{Array.isArray(u.Roles) ? u.Roles.map(r => r.name).join(", ") : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : <p>No users found.</p>}
    </div>
  );
}
