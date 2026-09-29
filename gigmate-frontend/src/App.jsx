import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Route Guards
import ProtectedRoute from './components/routes/ProtectedRoute';
import RoleRedirect from './components/routes/RoleRedirect';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import { NotFoundPage, UnauthorizedPage } from './pages/NotFoundPage';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import AvailabilityCalendar from './pages/student/AvailabilityCalendar';
import GigExplorer from './pages/student/GigExplorer';
import StudentApplications from './pages/student/StudentApplications';
import CertificatesPage from './pages/student/CertificatesPage';
import StudentProfilePage from './pages/student/StudentProfilePage';

// Recruiter Pages
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import PostGigPage from './pages/recruiter/PostGigPage';
import ManageGigsPage from './pages/recruiter/ManageGigsPage';
import GigApplicationsPage from './pages/recruiter/GigApplicationsPage';

// Admin Page
import AdminDashboard from './pages/admin/AdminDashboard';

export function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            {/* Public Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Auth Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* Role Resolver Route */}
            <Route path="/app" element={<RoleRedirect />} />

            {/* Student Protected Routes */}
            <Route
              path="/student"
              element={
                <ProtectedRoute allowedRoles={['ROLE_STUDENT']}>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/student/dashboard" replace />} />
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="availability" element={<AvailabilityCalendar />} />
              <Route path="gigs" element={<GigExplorer />} />
              <Route path="applications" element={<StudentApplications />} />
              <Route path="certificates" element={<CertificatesPage />} />
              <Route path="profile" element={<StudentProfilePage />} />
            </Route>

            {/* Recruiter Protected Routes */}
            <Route
              path="/recruiter"
              element={
                <ProtectedRoute allowedRoles={['ROLE_RECRUITER']}>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/recruiter/dashboard" replace />} />
              <Route path="dashboard" element={<RecruiterDashboard />} />
              <Route path="post-gig" element={<PostGigPage />} />
              <Route path="manage-gigs" element={<ManageGigsPage />} />
              <Route path="gigs/:gigId/applications" element={<GigApplicationsPage />} />
            </Route>

            {/* Admin Protected Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
            </Route>

            {/* Error Pages */}
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
