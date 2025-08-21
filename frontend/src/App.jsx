import React, { useMemo } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
//import "./App.css";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  }, [location.key]);

  const roles = Array.isArray(user?.roles) ? user.roles : [];
  const hasAnyRole = (allowed = []) =>
    allowed.length === 0 || roles.some((r) => allowed.includes(r));

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const NavItem = ({ to, label, allow = [] }) => {
    if (!hasAnyRole(allow)) return null;
    return (
      <NavLink to={to} className={({ isActive }) => (isActive ? "active" : undefined)}>
        {label}
      </NavLink>
    );
  };

  return (
    <div className="layout">
      <header className="topbar">
        <div className="brand">LOS • Loan Origination System</div>
        <div className="userbox">
          <span>
            {user?.email || "Unknown User"} {roles.length ? `• ${roles.join(", ")}` : ""}
          </span>
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      <aside className="sidebar">
        <div className="group-title">Main</div>
        <NavItem to="/" label="Dashboard" allow={[]} />
        <NavItem
          to="/loans"
          label="Loans"
          allow={["Admin", "SuperOps", "Ops", "Credit", "Risk", "Partner", "Dealer", "Collections", "Auditor"]}
        />
        <NavItem to="/loans/new" label="Create Loan" allow={["Admin", "SuperOps", "Ops", "Partner", "Dealer"]} />

        <div className="group-title">Dealers</div>
        <NavItem to="/dealers" label="Dealer List" allow={["Admin", "SuperOps", "Ops", "Dealer"]} />
        <NavItem to="/dealers/new" label="Create Dealer" allow={["Admin", "SuperOps", "Ops"]} />

        <div className="group-title">Partners</div>
        <NavItem
          to="/partners/queue"
          label="Partner Queue"
          allow={["Admin", "SuperOps", "Ops", "Partner", "Credit", "Risk"]}
        />

        <div className="group-title">Admin</div>
        <NavItem to="/admin/users" label="Users" allow={["Admin"]} />
        <NavItem to="/admin/roles" label="Roles" allow={["Admin"]} />
      </aside>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
