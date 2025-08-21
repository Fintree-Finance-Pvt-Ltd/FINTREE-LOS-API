import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import ProtectedRoute from "../components/ProtectedRoute";
import RoleGate from "../components/RoleGate";

import LoginOTP from "../pages/auth/LoginOTP";
import Dashboard from "../pages/Dashboard";

import LoanList from "../pages/loans/LoanList";
import LoanNew from "../pages/loans/LoanNew";
import LoanView from "../pages/loans/LoanView";

import DealerList from "../pages/dealers/DealerList";
import DealerCreate from "../pages/dealers/DealerCreate";

import PartnerQueue from "../pages/partners/PartnerQueue";

import DocumentUpload from "../pages/documents/DocumentUpload";

import AdminUsers from "../pages/admin/AdminUsers";
import AdminRoles from "../pages/admin/AdminRoles";

import NotAuthorized from "../pages/NotAuthorized";
import NotFound from "../pages/NotFound";

const router = createBrowserRouter([
  { path: "/login", element: <LoginOTP /> },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },

      { path: "loans", element: <LoanList /> },
      {
        path: "loans/new",
        element: (
          <RoleGate allow={["Admin", "SuperOps", "Ops", "Partner", "Dealer"]}>
            <LoanNew />
          </RoleGate>
        ),
      },
      { path: "loans/:id", element: <LoanView /> },

      {
        path: "dealers",
        element: (
          <RoleGate allow={["Admin", "SuperOps", "Ops", "Dealer"]}>
            <DealerList />
          </RoleGate>
        ),
      },
      {
        path: "dealers/new",
        element: (
          <RoleGate allow={["Admin", "SuperOps", "Ops"]}>
            <DealerCreate />
          </RoleGate>
        ),
      },

      {
        path: "partners/queue",
        element: (
          <RoleGate allow={["Admin", "SuperOps", "Ops", "Partner", "Credit", "Risk"]}>
            <PartnerQueue />
          </RoleGate>
        ),
      },

      {
        path: "docs/upload/:loanId",
        element: (
          <RoleGate allow={["Admin", "SuperOps", "Ops", "Partner", "Dealer"]}>
            <DocumentUpload />
          </RoleGate>
        ),
      },

      {
        path: "admin/users",
        element: (
          <RoleGate allow={["Admin"]}>
            <AdminUsers />
          </RoleGate>
        ),
      },
      {
        path: "admin/roles",
        element: (
          <RoleGate allow={["Admin"]}>
            <AdminRoles />
          </RoleGate>
        ),
      },

      { path: "not-authorized", element: <NotAuthorized /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default router;
