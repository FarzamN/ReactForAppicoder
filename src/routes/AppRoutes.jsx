import { Routes, Route } from "react-router-dom";
import LoginPage from "../features/auth/LoginPage";
import Dashboard from "../features/dashboard/Dashboard";
import ProjectDetails from "../features/projects/ProjectDetails";
import ProjectForm from "../features/projects/ProjectForm";
import ProtectedRoute from "./ProtectedRoute";
import Layout from "../components/Layout";
import ProjectPage from "../features/projects/ProjectPage";
import SettingPage from "../features/settings/SettingPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/projects"
        element={
          <ProtectedRoute>
            <Layout>
              <ProjectPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <ProjectDetails />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/projects/new"
        element={
          <ProtectedRoute>
            <ProjectForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/projects/edit/:id"
        element={
          <ProtectedRoute>
            <ProjectForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Layout>
              <SettingPage />
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
