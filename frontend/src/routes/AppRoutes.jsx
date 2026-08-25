import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/layouts/DashboardLayout";
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

const Dashboard = lazy(() => import("@/pages/Dashboard"));
const LoginPage = lazy(() =>
  import("@/pages/auth/LoginPage").then((module) => ({
    default: module.LoginPage,
  })),
);
const RegisterPage = lazy(() =>
  import("@/pages/auth/RegisterPage").then((module) => ({
    default: module.RegisterPage,
  })),
);
const OrganizationsPage = lazy(() => import("@/pages/organizations/OrganizationsPage"));
const ProjectsPage = lazy(() => import("@/pages/projects/ProjectsPage"));
const MembersPage = lazy(() => import("@/pages/members/MembersPage"));
const AcceptInvitePage = lazy(() => import("@/pages/invites/AcceptInvitePage"));
const TasksPage = lazy(() => import("@/pages/tasks/TasksPage"));
const ProjectAnalytics = lazy(() => import("@/pages/projects/ProjectAnalytics"));

function RouteFallback() {
  return <div className="min-h-40 animate-pulse rounded-xl bg-slate-100" />;
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/register" element={<RegisterPage />} />
        <Route path="/accept-invite/:token" element={<AcceptInvitePage />} />
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
          <Route
            path="/organizations/:organizationId/dashboard"
            element={<Dashboard />}
          />{" "}
          <Route
            path="/organizations/:organizationId/projects"
            element={<ProjectsPage />}
          />
          <Route
  path="/organizations/:organizationId/projects/:projectId/analytics"
  element={<ProjectAnalytics />}
/>
          <Route
            path="/organizations/:organizationId/members"
            element={<MembersPage />}
          />
          <Route path="/accept-invite/:token" element={<AcceptInvitePage />} />
          <Route path="/organizations" element={<OrganizationsPage />} />
        </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default AppRoutes;
