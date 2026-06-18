import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Lock, MapPin, BookOpen, ArrowRight, CheckCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ui/ToastProvider";
import api from "../utils/api";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

const pwRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,16}$/;

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", address: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const requirements = [
    { label: "At least 8 characters",  met: form.password.length >= 8 },
    { label: "Maximum 16 characters",  met: form.password.length > 0 && form.password.length <= 16 },
    { label: "One uppercase letter",   met: /[A-Z]/.test(form.password) },
    { label: "One special character",  met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(form.password) },
  ];

  const validate = () => {
    const e = {};
    if (!form.name) e.name = "Required";
    else if (form.name.length < 20) e.name = "Min 20 characters";
    else if (form.name.length > 60) e.name = "Max 60 characters";
    if (!form.email) e.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    if (!form.address) e.address = "Required";
    else if (form.address.length > 400) e.address = "Max 400 characters";
    if (!form.password) e.password = "Required";
    else if (!pwRegex.test(form.password)) e.password = "8–16 chars, one uppercase & special char";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    setErrors({});
    setLoading(true);
    try {
      const res = await api.post("/auth/register", form);
      login(res.data.token, res.data.user);
      toast("Account created! 🎉", "success");
      navigate("/stores");
    } catch (err) {
      toast(err.response?.data?.message || "Registration failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left panel */}
      <div className="auth-panel-left" style={{ background: "linear-gradient(135deg, #8B5E38 0%, #C8956C 55%, #E8C5A0 100%)" }}>
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: "absolute", width: 60 + i * 50, height: 60 + i * 50,
              borderRadius: "50%", background: "rgba(255,255,255,0.10)",
              left: `${8 + i * 18}%`, top: `${8 + i * 14}%`,
            }}
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ duration: 5 + i, repeat: Infinity, delay: i * 0.7 }}
          />
        ))}
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.15 }}
          style={{ textAlign: "center", position: "relative", zIndex: 1, maxWidth: 340 }}
        >
          <div style={{
            width: 80, height: 80, borderRadius: 20, margin: "0 auto 24px",
            background: "rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <BookOpen size={38} color="#fff" />
          </div>
          <h1 style={{ fontSize: 34, fontWeight: 800, color: "#fff", marginBottom: 14 }}>Join Review Book</h1>
          <p style={{ color: "rgba(255,255,255,0.82)", fontSize: 15, lineHeight: 1.7 }}>
            Create an account and start sharing your experiences with stores.
          </p>
        </motion.div>
      </div>

      {/* Right form */}
      <div className="auth-form-right">
        <motion.div
          initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          style={{ width: "100%", maxWidth: 440 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: "linear-gradient(135deg, var(--clr-primary), #E8B89A)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <BookOpen size={20} color="#fff" />
            </div>
            <span style={{ fontSize: 18, fontWeight: 700, color: "var(--clr-text)" }}>Review Book</span>
          </div>

          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 26, fontWeight: 700, color: "var(--clr-text)", marginBottom: 6 }}>Create account</h2>
            <p style={{ fontSize: 14, color: "var(--clr-text-3)" }}>Fill in your details to get started</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Input
              label="Full Name" id="reg-name"
              placeholder="Enter full name (min. 20 chars)"
              value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              error={errors.name} hint={`${form.name.length}/60 characters`}
              icon={User} required
            />
            <Input
              label="Email Address" id="reg-email" type="email"
              placeholder="you@example.com"
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              error={errors.email} icon={Mail} required
            />
            <Input
              label="Address" id="reg-address"
              placeholder="Your full address"
              value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
              error={errors.address} hint={`${form.address.length}/400`}
              icon={MapPin} required
            />
            <div>
              <Input
                label="Password" id="reg-password" type="password"
                placeholder="Create a strong password"
                value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                error={errors.password} icon={Lock} required
              />
              {form.password && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                  style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 12px" }}
                >
                  {requirements.map((req) => (
                    <div key={req.label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: req.met ? "var(--clr-success)" : "var(--clr-text-4)" }}>
                      <CheckCircle size={11} style={{ color: req.met ? "var(--clr-success)" : "var(--clr-border)" }} />
                      {req.label}
                    </div>
                  ))}
                </motion.div>
              )}
            </div>

            <Button type="submit" size="lg" loading={loading} icon={ArrowRight} iconPosition="right" style={{ width: "100%", marginTop: 6 }}>
              Create Account
            </Button>
          </form>

          <p style={{ textAlign: "center", marginTop: 22, fontSize: 13, color: "var(--clr-text-3)" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "var(--clr-primary)", fontWeight: 600, textDecoration: "none" }}>
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
