import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Eye, EyeOff } from "lucide-react";


function AdminLogin() {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [isSignup, setIsSignup] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Strict "Start at Login" enforcement:
    // We removed the auto-redirect useEffect so users ALWAYS land on the login page.
    // They are not allowed to "skip" this entry point.

    if (authLoading) return <div style={{ height: "100vh", background: "#0f0c29" }} />;

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const username = e.target.username.value;
        const password = e.target.password.value;

        try {
            const apiUrl = import.meta.env.VITE_API_URL;
            if (!apiUrl) throw new Error("API URL is not configured. Check VITE_API_URL env variable.");

            const endpoint = `${apiUrl}/api/auth/login`;
            console.log("[AdminLogin] POST", endpoint);

            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (res.status === 404) {
                throw new Error("API endpoint not found (404). Please contact support.");
            }

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Invalid credentials");

            if (data.role !== "admin") {
                throw new Error("Access denied: Not an administrator");
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);
            localStorage.setItem("userId", String(data.userId || ""));
            localStorage.setItem("username", data.username || username);

            navigate("/admin");
        } catch (err) {
            console.error("[AdminLogin] Error:", err.message);
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
        const role = "admin";

        try {
            const apiUrl = import.meta.env.VITE_API_URL;
            if (!apiUrl) throw new Error("API URL is not configured. Check VITE_API_URL env variable.");

            const endpoint = `${apiUrl}/api/auth/register`;
            console.log("[AdminSignup] POST", endpoint);

            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password, role: "admin" }),
            });

            if (res.status === 404) {
                throw new Error("API endpoint not found (404). Please contact support.");
            }

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Signup failed");

            alert("Admin account created successfully! Please login.");
            setIsSignup(false);
        } catch (err) {
            console.error("[AdminSignup] Error:", err.message);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
            style={{
                fontFamily: "'Inter', sans-serif",
                background: "linear-gradient(135deg, #0f0c29 0%, #1a1040 40%, #24243e 100%)",
            }}
        >
            {/* Animated background orbs */}
            <div style={{
                position: "absolute", top: "-120px", right: "-120px",
                width: "400px", height: "400px",
                background: "radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)",
                borderRadius: "50%",
                animation: "pulse 4s ease-in-out infinite",
            }} />
            <div style={{
                position: "absolute", bottom: "-100px", left: "-100px",
                width: "350px", height: "350px",
                background: "radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)",
                borderRadius: "50%",
                animation: "pulse 5s ease-in-out infinite 1s",
            }} />
            <div style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%, -50%)",
                width: "600px", height: "600px",
                background: "radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 60%)",
                borderRadius: "50%",
                pointerEvents: "none",
            }} />

            <div style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: "440px" }}>
                {/* Header badge */}
                <div style={{ textAlign: "center", marginBottom: "28px" }}>
                    <div style={{
                        display: "inline-flex", alignItems: "center", gap: "8px",
                        background: "rgba(139,92,246,0.15)",
                        border: "1px solid rgba(139,92,246,0.3)",
                        borderRadius: "100px", padding: "6px 16px",
                        color: "#c4b5fd", fontSize: "0.8rem", fontWeight: 600,
                        letterSpacing: "0.05em", textTransform: "uppercase",
                        marginBottom: "16px",
                    }}>
                        <span>🛡️</span> Admin Portal
                    </div>
                    <h1 style={{
                        fontSize: "2rem", fontWeight: 800, color: "white",
                        letterSpacing: "-0.02em", lineHeight: 1.2,
                    }}>
                        {isSignup ? "Create Admin Account" : "Administrator Login"}
                    </h1>
                    <p style={{ color: "rgba(255,255,255,0.5)", marginTop: "8px", fontSize: "0.9rem" }}>
                        {isSignup ? "Register a new administrator" : "Secure access for administrators only"}
                    </p>
                </div>

                {/* Card */}
                <div style={{
                    background: "rgba(255,255,255,0.05)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "24px",
                    padding: "36px",
                    boxShadow: "0 25px 50px rgba(0,0,0,0.4)",
                }}>
                    {/* Toggle tabs */}
                    <div style={{
                        display: "flex", background: "rgba(0,0,0,0.3)",
                        borderRadius: "12px", padding: "4px", marginBottom: "24px",
                    }}>
                        {["Login", "Register"].map((tab, i) => (
                            <button
                                key={tab}
                                type="button"
                                onClick={() => { setIsSignup(i === 1); setError(""); setShowPassword(false); }}
                                style={{
                                    flex: 1, padding: "8px 0", borderRadius: "10px",
                                    border: "none", cursor: "pointer", fontWeight: 600,
                                    fontSize: "0.875rem", transition: "all 0.2s",
                                    background: isSignup === (i === 1)
                                        ? "linear-gradient(135deg, #7c3aed, #6d28d9)"
                                        : "transparent",
                                    color: isSignup === (i === 1) ? "white" : "rgba(255,255,255,0.4)",
                                    boxShadow: isSignup === (i === 1) ? "0 4px 12px rgba(124,58,237,0.4)" : "none",
                                }}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <form
                        onSubmit={isSignup ? handleSignupSubmit : handleLoginSubmit}
                        style={{ display: "flex", flexDirection: "column", gap: "16px" }}
                    >
                        {error && (
                            <div style={{
                                background: "rgba(239,68,68,0.15)",
                                border: "1px solid rgba(239,68,68,0.4)",
                                color: "#fca5a5", padding: "12px 16px",
                                borderRadius: "12px", fontSize: "0.875rem",
                                display: "flex", alignItems: "center", gap: "8px",
                            }}>
                                <span>⚠️</span> {error}
                            </div>
                        )}

                        {/* Username */}
                        <div>
                            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "rgba(255,255,255,0.6)", marginBottom: "6px", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                                Username
                            </label>
                            <input
                                type="text"
                                name="username"
                                placeholder="Admin username"
                                required
                                style={{
                                    width: "100%", padding: "12px 16px",
                                    background: "rgba(255,255,255,0.07)",
                                    border: "1px solid rgba(255,255,255,0.12)",
                                    borderRadius: "12px", color: "white",
                                    fontSize: "0.95rem", outline: "none",
                                    transition: "border-color 0.2s, background 0.2s",
                                    boxSizing: "border-box",
                                }}
                                onFocus={e => { e.target.style.borderColor = "rgba(139,92,246,0.7)"; e.target.style.background = "rgba(255,255,255,0.1)"; }}
                                onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; e.target.style.background = "rgba(255,255,255,0.07)"; }}
                            />
                        </div>

                        {/* Email (signup only) */}
                        {isSignup && (
                            <div>
                                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "rgba(255,255,255,0.6)", marginBottom: "6px", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="admin@example.com"
                                    required
                                    style={{
                                        width: "100%", padding: "12px 16px",
                                        background: "rgba(255,255,255,0.07)",
                                        border: "1px solid rgba(255,255,255,0.12)",
                                        borderRadius: "12px", color: "white",
                                        fontSize: "0.95rem", outline: "none",
                                        transition: "border-color 0.2s, background 0.2s",
                                        boxSizing: "border-box",
                                    }}
                                    onFocus={e => { e.target.style.borderColor = "rgba(139,92,246,0.7)"; e.target.style.background = "rgba(255,255,255,0.1)"; }}
                                    onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; e.target.style.background = "rgba(255,255,255,0.07)"; }}
                                />
                            </div>
                        )}

                        {/* Password */}
                        <div>
                            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "rgba(255,255,255,0.6)", marginBottom: "6px", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                                Password
                            </label>
                            <div style={{ position: "relative" }}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Enter password"
                                    required
                                    style={{
                                        width: "100%", padding: "12px 48px 12px 16px",
                                        background: "rgba(255,255,255,0.07)",
                                        border: "1px solid rgba(255,255,255,0.12)",
                                        borderRadius: "12px", color: "white",
                                        fontSize: "0.95rem", outline: "none",
                                        transition: "border-color 0.2s, background 0.2s",
                                        boxSizing: "border-box",
                                    }}
                                    onFocus={e => { e.target.style.borderColor = "rgba(139,92,246,0.7)"; e.target.style.background = "rgba(255,255,255,0.1)"; }}
                                    onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; e.target.style.background = "rgba(255,255,255,0.07)"; }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: "absolute", right: "14px", top: "50%",
                                        transform: "translateY(-50%)",
                                        background: "none", border: "none", cursor: "pointer",
                                        color: "rgba(255,255,255,0.4)", fontSize: "1.1rem",
                                    }}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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
                                    ? "rgba(124,58,237,0.4)"
                                    : "linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #5b21b6 100%)",
                                color: "white", border: "none", borderRadius: "12px",
                                fontSize: "1rem", fontWeight: 700,
                                cursor: loading ? "not-allowed" : "pointer",
                                transition: "all 0.2s",
                                boxShadow: loading ? "none" : "0 4px 20px rgba(124,58,237,0.5)",
                                marginTop: "4px",
                            }}
                            onMouseEnter={e => { if (!loading) e.target.style.transform = "translateY(-1px)"; }}
                            onMouseLeave={e => { e.target.style.transform = "translateY(0)"; }}
                        >
                            {loading
                                ? (isSignup ? "Creating account..." : "Signing in...")
                                : (isSignup ? "Register Admin" : "Login as Admin")}
                        </button>
                    </form>

                    {/* Student portal link */}
                    <div style={{ textAlign: "center", marginTop: "24px" }}>
                        <button
                            type="button"
                            onClick={() => navigate("/login")}
                            style={{
                                background: "none", border: "none", cursor: "pointer",
                                color: "rgba(255,255,255,0.35)", fontSize: "0.8rem",
                                textDecoration: "underline", transition: "color 0.2s",
                            }}
                            onMouseEnter={e => e.target.style.color = "rgba(255,255,255,0.7)"}
                            onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.35)"}
                        >
                            🎓 Go to Student Portal
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminLogin;
