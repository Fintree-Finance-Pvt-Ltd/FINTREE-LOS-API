import React from "react";
export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome to Fintree LOS {user?.email || ""}!</p>
      {/* <ul>
        <li>Quick links: Loans, Dealers, Partner Queue, Admin.</li>
        <li>Your roles: {Array.isArray(user?.roles) ? user.roles.join(", ") : "—"}</li>
      </ul> */}
    </div>
  );
}
