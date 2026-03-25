import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

/**
 * ProtectedRoute — Iron-clad login gate.
 *
 * STRICT RULES — NO EXCEPTIONS:
 *  ✅ Must be logged in (Firebase OR MongoDB token) to access ANY protected page.
 *  ✅ Must have the correct ROLE to access role-specific pages.
 *  ✅ While Firebase is still resolving → show spinner (no flash to login).
 *  ✅ Unauthenticated → redirect to /login (students) or /admin/login (admin paths).
 *  ✅ Wrong role → redirect to own correct dashboard.
 *  ✅ Browser back button CANNOT skip login — every render re-checks auth state.
 */
const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // ── STEP 1: Wait for Firebase to finish resolving ──────────────────────
  // This prevents the "flash" where the page briefly shows then redirects.
  if (loading) {
    return (
      <div style={{
        position: "fixed", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        background: "linear-gradient(135deg, #f0f4ff 0%, #faf5ff 100%)",
        fontFamily: "'Inter', sans-serif",
        zIndex: 9999,
      }}>
        <div style={{
          width: 48, height: 48,
          border: "4px solid #e2e8f0",
          borderTop: "4px solid #6366f1",
          borderRadius: "50%",
          animation: "pr-spin 0.7s linear infinite",
          marginBottom: 16,
        }} />
        <p style={{ color: "#94a3b8", fontWeight: 600, margin: 0, fontSize: "0.95rem" }}>
          Verifying session…
        </p>
        <style>{`
          @keyframes pr-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  // ── STEP 2: Strict authentication check ───────────────────────────────
  // user is ONLY non-null if useAuth confirmed a valid Firebase OR local session.
  // We do NOT independently read localStorage here — useAuth is the single source.
  if (!user) {
    const isAdminSection = location.pathname.startsWith("/admin");
    // Preserves where they were trying to go, so we can redirect back after login
    return (
      <Navigate
        to={isAdminSection ? "/admin/login" : "/login"}
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  // ── STEP 3: Role-based access control ─────────────────────────────────
  if (role && user.role !== role) {
    // Logged in, but wrong role — send to their own dashboard
    if (user.role === "admin") return <Navigate to="/admin" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  // ── STEP 4: All checks pass → render the protected page ───────────────
  return children;
};

export default ProtectedRoute;