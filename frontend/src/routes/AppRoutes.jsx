import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/layouts/DashboardLayout";
import  Dashboard  from "@/pages/Dashboard";
import { LoginPage } from "@/pages/auth/LoginPage";
import { RegisterPage } from "@/pages/auth/RegisterPage";
import OrganizationsPage from "@/pages/organizations/OrganizationsPage";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function AppRoutes() {
  return (
    <BrowserRouter>
  <Routes>

    <Route path="/" element={<Navigate to="/login" replace />} />

    <Route path="/login" element={<LoginPage />} />

    <Route path="/register" element={<RegisterPage />} />

    <Route
      element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }
    >
      <Route path="/dashboard" element={<Dashboard />} />

      <Route
        path="/organizations"
        element={<OrganizationsPage />}
      />
    </Route>

  </Routes>
</BrowserRouter>
  );
}

export default AppRoutes;