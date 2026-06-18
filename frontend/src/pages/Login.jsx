import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, BookOpen, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ui/ToastProvider";
import api from "../utils/api";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.email) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email format";
    if (!form.password) e.password = "Password is required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    setErrors({});
    setLoading(true);
    try {
      const res = await api.post("/auth/login", form);
      login(res.data.token, res.data.user);
      toast("Welcome back! 👋", "success");
      const role = res.data.user.role;
      if (role === "ADMIN") navigate("/admin/dashboard");
      else if (role === "OWNER") navigate("/owner/dashboard");
      else navigate("/stores");
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      toast(msg, "error");
      setErrors({ password: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left panel */}
      <div className="auth-panel-left">
        {/* Decorative blobs */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: "absolute",
              width: 80 + i * 40, height: 80 + i * 40,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.12)",
              left: `${10 + i * 15}%`,
              top: `${5 + i * 12}%`,
            }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.6 }}
          />
        ))}

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.15 }}
          style={{ textAlign: "center", position: "relative", zIndex: 1, maxWidth: 360 }}
        >
          <div style={{
            width: 80, height: 80, borderRadius: 20, margin: "0 auto 24px",
            background: "rgba(255,255,255,0.20)", backdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <BookOpen size={38} color="#fff" />
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: "#fff", marginBottom: 16 }}>Review Book</h1>
          <p style={{ color: "rgba(255,255,255,0.82)", fontSize: 16, lineHeight: 1.7 }}>
            Discover and rate the best stores in your area. Your opinion matters.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 32, flexWrap: "wrap" }}>
            {["Trusted Ratings", "Real Reviews", "All Stores"].map((tag) => (
              <div key={tag} style={{
                background: "rgba(255,255,255,0.18)", backdropFilter: "blur(6px)",
                padding: "6px 16px", borderRadius: 999, color: "#fff", fontSize: 12, fontWeight: 500,
              }}>
                {tag}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right form */}
      <div className="auth-form-right">
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          style={{ width: "100%", maxWidth: 420 }}
        >
          {/* Mobile logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: "linear-gradient(135deg, var(--clr-primary), #E8B89A)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <BookOpen size={20} color="#fff" />
            </div>
            <span style={{ fontSize: 18, fontWeight: 700, color: "var(--clr-text)" }}>Review Book</span>
          </div>

          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: "var(--clr-text)", marginBottom: 6 }}>Welcome back</h2>
            <p style={{ fontSize: 14, color: "var(--clr-text-3)" }}>Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <Input
              label="Email Address" id="login-email" type="email"
              placeholder="you@example.com"
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              error={errors.email} icon={Mail} required
            />
            <Input
              label="Password" id="login-password" type="password"
              placeholder="Enter your password"
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
              error={errors.password} icon={Lock} required
            />
            <Button type="submit" size="lg" loading={loading} icon={ArrowRight} iconPosition="right" style={{ width: "100%", marginTop: 4 }}>
              Sign In
            </Button>
          </form>

          <p style={{ textAlign: "center", marginTop: 24, fontSize: 13, color: "var(--clr-text-3)" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "var(--clr-primary)", fontWeight: 600, textDecoration: "none" }}>
              Create one
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
