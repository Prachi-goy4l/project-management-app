import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/layouts/DashboardLayout";
import Dashboard from "@/pages/Dashboard";
import { LoginPage } from "@/pages/auth/LoginPage";
import { RegisterPage } from "@/pages/auth/RegisterPage";
import OrganizationsPage from "@/pages/organizations/OrganizationsPage";
import ProjectsPage from "@/pages/projects/ProjectsPage";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MembersPage from "@/pages/members/MembersPage";
import AcceptInvitePage from "@/pages/invites/AcceptInvitePage";
import TasksPage from "@/pages/tasks/TasksPage";
function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/register" element={<RegisterPage />} />
        <Route
      path="/accept-invite/:token"
      element={<AcceptInvitePage />}
    />
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path="/organizations/:organizationId/projects/:projectId/tasks"
            element={<TasksPage />}
          />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/organizations/:organizationId/projects"
            element={<ProjectsPage />}
          />
          <Route
            path="/organizations/:organizationId/members"
            element={<MembersPage />}
          />
          <Route path="/accept-invite/:token" element={<AcceptInvitePage />} />
          <Route path="/organizations" element={<OrganizationsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
