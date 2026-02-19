import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import MCQTests from "./pages/MCQTests";
import CodeEditor from "./pages/CodeEditor";
import Results from "./pages/Results";
import Admin from "./pages/Admin";
import Layout from "./components/Layout";
import AdminLayout from "./components/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import ManageQuestions from "./pages/admin/ManageQuestions";
import StudentDashboard from "./pages/student/StudentDashboard";
import TestInterface from "./pages/student/TestInterface";
import StudentMCQ from "./pages/student/StudentMCQ";
import "./index.css";

/**
 * Routing Rules (strict login enforcement):
 *  • "/" → always goes to /login
 *  • "/login" → public; auto-redirects to dashboard if already logged in
 *  • "/admin/login" → public; auto-redirects to /admin if already logged in as admin
 *  • All other routes → wrapped in ProtectedRoute
 *  • "*" wildcard → redirect to /login (not "/", so unauthenticated users don't loop)
 */
function App() {
  return (
    <Router>
      <Routes>

        {/* ROOT → always Login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public Login Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* ─── STUDENT ROUTES ──────────────────────────────────────────── */}
        <Route
          element={
            <ProtectedRoute role="student">
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/mcq-tests" element={<MCQTests />} />
          <Route path="/code-editor" element={<CodeEditor />} />
          <Route path="/results" element={<Results />} />
          <Route path="/student/test/:level" element={<TestInterface />} />
          <Route path="/student/mcq" element={<StudentMCQ />} />
          {/* Alias */}
          <Route path="/student/dashboard" element={<Navigate to="/dashboard" replace />} />
        </Route>

        {/* ─── ADMIN ROUTES ────────────────────────────────────────────── */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Admin />} />
          <Route path="questions" element={<ManageQuestions />} />
        </Route>

        {/* ─── FALLBACK → Login (never "/" to avoid loops) ─────────────── */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </Router>
  );
}

export default App;