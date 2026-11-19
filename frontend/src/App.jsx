import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth, ROLES } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import EmployeeDetailPage from './pages/EmployeeDetailPage';
import TeamViewPage from './pages/TeamViewPage';
import PolicyQAPage from './pages/PolicyQAPage';
import OnboardingPage from './pages/OnboardingPage';
import EmployeeManagementPage from './pages/EmployeeManagementPage';
import NotFoundPage from './pages/NotFoundPage';

// Root redirect handler based on authenticated role
const RootRedirect = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role === ROLES.EMPLOYEE) {
    return <Navigate to="/onboarding" replace />;
  }

  return <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public Login */}
            <Route path="/login" element={<LoginPage />} />

            {/* Application Protected Pages wrapped in Layout */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <RootRedirect />
                </ProtectedRoute>
              }
            />

            {/* Dashboard & Employee Detail (HR Staff, HR Admin) */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={[ROLES.HR_STAFF, ROLES.HR_ADMIN]}>
                  <Layout>
                    <DashboardPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/employees/:id"
              element={
                <ProtectedRoute allowedRoles={[ROLES.HR_STAFF, ROLES.HR_ADMIN]}>
                  <Layout>
                    <EmployeeDetailPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Team Rollup Analytics (HR Staff, HR Admin) */}
            <Route
              path="/teams"
              element={
                <ProtectedRoute allowedRoles={[ROLES.HR_STAFF, ROLES.HR_ADMIN]}>
                  <Layout>
                    <TeamViewPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Conversational Onboarding Agent (All Roles) */}
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute allowedRoles={[ROLES.EMPLOYEE, ROLES.HR_STAFF, ROLES.HR_ADMIN]}>
                  <Layout>
                    <OnboardingPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Policy Q&A Assistant (All Roles) */}
            <Route
              path="/policy"
              element={
                <ProtectedRoute allowedRoles={[ROLES.EMPLOYEE, ROLES.HR_STAFF, ROLES.HR_ADMIN]}>
                  <Layout>
                    <PolicyQAPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Employee Management Directory (HR Admin Only) */}
            <Route
              path="/admin/employees"
              element={
                <ProtectedRoute allowedRoles={[ROLES.HR_ADMIN]}>
                  <Layout>
                    <EmployeeManagementPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* 404 Route */}
            <Route
              path="*"
              element={
                <Layout>
                  <NotFoundPage />
                </Layout>
              }
            />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
