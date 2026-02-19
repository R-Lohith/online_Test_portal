import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { signInWithGoogle, logOut } from "../config/firebase";
import { useAuth } from "../hooks/useAuth";

function Login() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Strict "Start at Login" enforcement:
  // We removed the auto-redirect useEffect so users ALWAYS land on the login page.
  // They are not allowed to "skip" this entry point.

  if (authLoading) return <div style={{ height: "100vh", background: "#fff" }} />;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const username = e.target.username.value;
    const password = e.target.password.value;

    if (!username || !password) {
      setError("Please fill all fields");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Invalid credentials");

      if (data.role === "admin") {
        throw new Error("Admins must use the Admin Login page");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("userId", data.userId);

      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const username = e.target.username?.value;
    const email = e.target.email?.value;
    const password = e.target.password?.value;

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");

      alert("Account created successfully! Please login.");
      setIsSignup(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    setIsSignup(!isSignup);
    setError("");
    setShowPassword(false);
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const user = await signInWithGoogle();
      // Store session for ProtectedRoute
      localStorage.setItem("token", "firebase-google-session");
      localStorage.setItem("role", "student");
      localStorage.setItem("userId", user.uid);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.message || "Google sign-in failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Left Panel – Branding */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1e3a8a 0%, #3730a3 40%, #6d28d9 100%)",
        }}
      >
        {/* Decorative blobs */}
        <div
          style={{
            position: "absolute", top: "-80px", right: "-80px",
            width: "320px", height: "320px",
            background: "rgba(255,255,255,0.07)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute", bottom: "-100px", left: "-60px",
            width: "280px", height: "280px",
            background: "rgba(255,255,255,0.05)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute", top: "40%", left: "60%",
            width: "180px", height: "180px",
            background: "rgba(255,255,255,0.04)",
            borderRadius: "50%",
          }}
        />

        <div className="relative z-10 text-center text-white space-y-6 max-w-md">
          {/* Logo */}
          <div
            style={{
              width: "80px", height: "80px",
              background: "rgba(255,255,255,0.15)",
              borderRadius: "24px",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.2)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
            }}
          >
            <svg width="40" height="40" fill="none" stroke="white" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>

          <div>
            <h1 style={{ fontSize: "2.8rem", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
              BIT Test Portal
            </h1>
            <p style={{ fontSize: "1.1rem", opacity: 0.8, marginTop: "12px", lineHeight: 1.6 }}>
              Your gateway to smarter learning. Practice, compete, and excel.
            </p>
          </div>
          {/* <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "8px" }}>
            {[
              { icon: "🎯", text: "Level-based MCQ Tests" },
              { icon: "💻", text: "Live Code Editor" },
              { icon: "📊", text: "Detailed Performance Analytics" },
            ].map((f, i) => (
              <div
                key={i}
                style={{
                  display: "flex", alignItems: "center", gap: "12px",
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: "12px", padding: "12px 16px",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
              >
                <span style={{ fontSize: "1.3rem" }}>{f.icon}</span>
                <span style={{ fontWeight: 500, opacity: 0.95 }}>{f.text}</span>
              </div>
            ))}
          </div>*/}
        </div>
      </div>
      <div
        className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12"
        style={{ background: "#f8fafc" }}
      >
        <div style={{ width: "100%", maxWidth: "420px" }}>
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <h1 style={{
              fontSize: "1.8rem", fontWeight: 800,
              background: "linear-gradient(135deg, #1e3a8a, #6d28d9)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              BIT Test Portal
            </h1>
          </div>

          {/* Card */}
          <div
            style={{
              background: "white",
              borderRadius: "24px",
              padding: "40px",
              boxShadow: "0 4px 40px rgba(0,0,0,0.08)",
              border: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ marginBottom: "28px" }}>
              <h2 style={{ fontSize: "1.7rem", fontWeight: 700, color: "#0f172a", marginBottom: "6px" }}>
                {isSignup ? "Create Account" : "Welcome back"}
              </h2>
              <p style={{ color: "#64748b", fontSize: "0.95rem" }}>
                {isSignup
                  ? "Sign up to start your learning journey"
                  : "Sign in to your student account"}
              </p>
            </div>

            {/* Toggle tabs */}
            <div
              style={{
                display: "flex", background: "#f1f5f9",
                borderRadius: "12px", padding: "4px", marginBottom: "24px",
              }}
            >
              {["Login", "Sign Up"].map((tab, i) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => { setIsSignup(i === 1); setError(""); setShowPassword(false); }}
                  style={{
                    flex: 1, padding: "8px 0", borderRadius: "10px",
                    border: "none", cursor: "pointer", fontWeight: 600,
                    fontSize: "0.9rem", transition: "all 0.2s",
                    background: isSignup === (i === 1) ? "white" : "transparent",
                    color: isSignup === (i === 1) ? "#1e3a8a" : "#64748b",
                    boxShadow: isSignup === (i === 1) ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            <form onSubmit={isSignup ? handleSignupSubmit : handleLoginSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {error && (
                <div
                  style={{
                    background: "#fef2f2", border: "1px solid #fecaca",
                    color: "#dc2626", padding: "12px 16px",
                    borderRadius: "12px", fontSize: "0.875rem",
                    display: "flex", alignItems: "center", gap: "8px",
                  }}
                >
                  <span>⚠️</span> {error}
                </div>
              )}

              {/* Username */}
              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  placeholder="Enter your username"
                  required
                  style={{
                    width: "100%", padding: "12px 16px",
                    border: "2px solid #e2e8f0", borderRadius: "12px",
                    fontSize: "0.95rem", outline: "none",
                    transition: "border-color 0.2s",
                    boxSizing: "border-box",
                  }}
                  onFocus={e => e.target.style.borderColor = "#3730a3"}
                  onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                />
              </div>

              {/* Email (signup only) */}
              {isSignup && (
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    required
                    style={{
                      width: "100%", padding: "12px 16px",
                      border: "2px solid #e2e8f0", borderRadius: "12px",
                      fontSize: "0.95rem", outline: "none",
                      transition: "border-color 0.2s",
                      boxSizing: "border-box",
                    }}
                    onFocus={e => e.target.style.borderColor = "#3730a3"}
                    onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                  />
                </div>
              )}

              {/* Password */}
              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    required
                    style={{
                      width: "100%", padding: "12px 48px 12px 16px",
                      border: "2px solid #e2e8f0", borderRadius: "12px",
                      fontSize: "0.95rem", outline: "none",
                      transition: "border-color 0.2s",
                      boxSizing: "border-box",
                    }}
                    onFocus={e => e.target.style.borderColor = "#3730a3"}
                    onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute", right: "14px", top: "50%",
                      transform: "translateY(-50%)",
                      background: "none", border: "none", cursor: "pointer",
                      color: "#94a3b8", fontSize: "1.1rem",
                    }}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%", padding: "13px",
                  background: loading
                    ? "#94a3b8"
                    : "linear-gradient(135deg, #1e3a8a 0%, #3730a3 50%, #6d28d9 100%)",
                  color: "white", border: "none", borderRadius: "12px",
                  fontSize: "1rem", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                  boxShadow: loading ? "none" : "0 4px 20px rgba(55,48,163,0.35)",
                  marginTop: "4px",
                }}
                onMouseEnter={e => { if (!loading) e.target.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.target.style.transform = "translateY(0)"; }}
              >
                {loading
                  ? (isSignup ? "Creating account..." : "Signing in...")
                  : (isSignup ? "Create Account" : "Sign In")}
              </button>

              {/* OR Divider */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "4px 0" }}>
                <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
                <span style={{ color: "#94a3b8", fontSize: "0.8rem", fontWeight: 500 }}>OR</span>
                <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
              </div>

              {/* Google Sign-In */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                style={{
                  width: "100%", padding: "12px",
                  background: "white",
                  border: "2px solid #e2e8f0", borderRadius: "12px",
                  fontSize: "0.95rem", fontWeight: 600,
                  cursor: loading ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                  color: "#374151",
                  transition: "all 0.2s",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                  opacity: loading ? 0.6 : 1,
                }}
                onMouseEnter={e => { if (!loading) { e.target.style.borderColor = "#3730a3"; e.target.style.boxShadow = "0 4px 12px rgba(55,48,163,0.15)"; } }}
                onMouseLeave={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)"; }}
              >
                <FcGoogle size={22} />
                Continue with Google
              </button>
            </form>


            {/* Admin link */}
            <div style={{ textAlign: "center", marginTop: "24px" }}>
              <button
                type="button"
                onClick={() => navigate("/admin/login")}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: "#94a3b8", fontSize: "0.8rem",
                  textDecoration: "underline",
                  transition: "color 0.2s",
                }}
                onMouseEnter={e => e.target.style.color = "#475569"}
                onMouseLeave={e => e.target.style.color = "#94a3b8"}
              >
                🔐 Admin Access
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;