import React from "react";
import { Navigate } from "react-router-dom";

export default function RoleGate({ allow = [], children }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const roles = user?.roles || [];
  const ok = allow.length === 0 || roles.some((r) => allow.includes(r));
  if (!ok) return <Navigate to="/not-authorized" replace />;
  return children;
}
