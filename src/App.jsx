import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";

// Auth
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import CheckEmail from "./pages/auth/CheckEmail";
import ResetPassword from "./pages/auth/ResetPassword";

// Landing
import Landing from "./pages/Landing";

// Candidate
import JobFeed from "./pages/candidate/JobFeed";
import JobDetail from "./pages/candidate/JobDetail";
import MyApplications from "./pages/candidate/MyApplications";
import SavedJobs from "./pages/candidate/SavedJobs";
import Profile from "./pages/candidate/Profile";
import AITools from "./pages/candidate/AITools";

// Company
import CompanyDashboard from "./pages/company/CompanyDashboard";
import PostJob from "./pages/company/PostJob";
import ActiveJobs from "./pages/company/ActiveJobs";
import EditJob from "./pages/company/EditJob";
import Applicants from "./pages/company/Applicants";
import CompanySettings from "./pages/company/CompanySettings";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCompanies from "./pages/admin/AdminCompanies";
import AdminCandidates from "./pages/admin/AdminCandidates";
import AdminJobs from "./pages/admin/AdminJobs";

import GoogleSuccess from "./pages/auth/GoogleSuccess";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/check-email" element={<CheckEmail />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Candidate - protected */}
          <Route
            path="/candidate/jobs"
            element={
              <ProtectedRoute allowedRoles={["CANDIDATE"]}>
                <JobFeed />
              </ProtectedRoute>
            }
          />
          <Route
            path="/candidate/jobs/:id"
            element={
              <ProtectedRoute allowedRoles={["CANDIDATE"]}>
                <JobDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/candidate/applications"
            element={
              <ProtectedRoute allowedRoles={["CANDIDATE"]}>
                <MyApplications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/candidate/saved"
            element={
              <ProtectedRoute allowedRoles={["CANDIDATE"]}>
                <SavedJobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/candidate/profile"
            element={
              <ProtectedRoute allowedRoles={["CANDIDATE"]}>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/candidate/ai-tools"
            element={
              <ProtectedRoute allowedRoles={["CANDIDATE"]}>
                <AITools />
              </ProtectedRoute>
            }
          />

          {/* Company - protected */}
          <Route
            path="/company/dashboard"
            element={
              <ProtectedRoute allowedRoles={["COMPANY"]}>
                <CompanyDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/jobs"
            element={
              <ProtectedRoute allowedRoles={["COMPANY"]}>
                <ActiveJobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/jobs/new"
            element={
              <ProtectedRoute allowedRoles={["COMPANY"]}>
                <PostJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/jobs/:id/edit"
            element={
              <ProtectedRoute allowedRoles={["COMPANY"]}>
                <EditJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/applicants"
            element={
              <ProtectedRoute allowedRoles={["COMPANY"]}>
                <Applicants />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/settings"
            element={
              <ProtectedRoute allowedRoles={["COMPANY"]}>
                <CompanySettings />
              </ProtectedRoute>
            }
          />

          {/* Admin - protected */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/companies"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminCompanies />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/candidates"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminCandidates />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/jobs"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminJobs />
              </ProtectedRoute>
            }
          />

          <Route path="/auth/google/success" element={<GoogleSuccess />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
