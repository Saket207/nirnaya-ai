import React, { Component } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth, ROLES } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import EmployeeDetailPage from './pages/EmployeeDetailPage';
import TeamViewPage from './pages/TeamViewPage';
import PolicyQAPage from './pages/PolicyQAPage';
import OnboardingPage from './pages/OnboardingPage';
import EmployeeManagementPage from './pages/EmployeeManagementPage';
import NotFoundPage from './pages/NotFoundPage';

// Top-level Error Boundary to prevent full white-screen crashes
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught runtime error in Nirnaya UI:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FBF4EF] flex items-center justify-center p-6 text-[#312C29]">
          <div className="max-w-md w-full bg-white rounded-3xl border border-[#DED1C9] p-8 shadow-xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#FDEAE5] text-[#D9684C] flex items-center justify-center mx-auto text-xl font-bold font-mono">
              !
            </div>
            <h2 className="text-xl font-heading font-bold text-[#312C29]">Application Encountered an Error</h2>
            <p className="text-xs text-[#5D5753] leading-relaxed">
              A view rendering error occurred. You can safely return to the homepage or reload the application.
            </p>
            {this.state.error && (
              <p className="p-3 bg-[#FAF6F2] rounded-xl text-left text-[11px] font-mono text-[#B2553E] border border-[#DED1C9] break-words">
                {this.state.error.message || String(this.state.error)}
              </p>
            )}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  window.location.href = '/';
                }}
                className="px-5 py-2.5 rounded-full bg-[#312C29] text-white text-xs font-bold hover:bg-[#1C1816] transition-colors"
              >
                Go to Homepage
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-5 py-2.5 rounded-full bg-[#FAF6F2] border border-[#DED1C9] text-[#312C29] text-xs font-semibold hover:bg-[#F2EAE3] transition-colors"
              >
                Reload
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

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
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <Routes>
            {/* Public Login */}
            <Route path="/login" element={<LoginPage />} />

            {/* Public Homepage (Noovotic Design System) */}
            <Route path="/" element={<HomePage />} />

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
  </ErrorBoundary>
);
}

export default App;
