import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, CheckCircle, ShieldCheck } from "lucide-react";
import { useToast } from "../../components/ui/ToastProvider";
import api from "../../utils/api";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

const reqs = (pw) => [
  { label: "At least 8 characters",  met: pw.length >= 8 },
  { label: "Maximum 16 characters",  met: pw.length > 0 && pw.length <= 16 },
  { label: "One uppercase letter",   met: /[A-Z]/.test(pw) },
  { label: "One special character",  met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pw) },
];

const ChangePassword = () => {
  const [form,    setForm]    = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const validate = () => {
    const e = {};
    if (!form.currentPassword) e.currentPassword = "Current password is required";
    if (!form.newPassword) e.newPassword = "New password is required";
    else if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,16}$/.test(form.newPassword))
      e.newPassword = "8–16 chars, one uppercase & one special character";
    if (!form.confirmPassword) e.confirmPassword = "Please confirm your password";
    else if (form.newPassword !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    setErrors({});
    setLoading(true);
    try {
      await api.post("/auth/change-password", { currentPassword: form.currentPassword, newPassword: form.newPassword });
      setSuccess(true);
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast("Password changed! 🔒", "success");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to change password";
      toast(msg, "error");
      setErrors({ currentPassword: msg });
    } finally { setLoading(false); }
  };

  const requirements = reqs(form.newPassword);

  return (
    <div className="page-wrapper">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "var(--clr-text)" }}>Change Password</h1>
        <p style={{ fontSize: 14, color: "var(--clr-text-3)", marginTop: 4 }}>Update your account security</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        style={{ maxWidth: 500 }}>
        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            style={{
              display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", marginBottom: 20,
              borderRadius: 12, background: "var(--clr-success-bg)", border: "1px solid rgba(107,158,120,0.30)",
            }}
          >
            <CheckCircle size={18} style={{ color: "var(--clr-success)", flexShrink: 0 }} />
            <p style={{ fontSize: 13, color: "var(--clr-success)", fontWeight: 500 }}>Password changed successfully!</p>
          </motion.div>
        )}

        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 12,
              background: "var(--clr-primary-bg)", display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <ShieldCheck size={20} style={{ color: "var(--clr-primary)" }} />
            </div>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--clr-text)" }}>Security Settings</h3>
              <p style={{ fontSize: 12, color: "var(--clr-text-4)" }}>Keep your account secure</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Input
              id="cur-pw" label="Current Password" type="password"
              placeholder="Enter current password"
              value={form.currentPassword}
              onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
              error={errors.currentPassword} icon={Lock} required
            />

            <div>
              <Input
                id="new-pw" label="New Password" type="password"
                placeholder="Create a strong password"
                value={form.newPassword}
                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                error={errors.newPassword} icon={Lock} required
              />
              {form.newPassword && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                  style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 12px" }}
                >
                  {requirements.map((req) => (
                    <div key={req.label} style={{
                      display: "flex", alignItems: "center", gap: 6,
                      fontSize: 11, color: req.met ? "var(--clr-success)" : "var(--clr-text-4)",
                    }}>
                      <CheckCircle size={11} style={{ color: req.met ? "var(--clr-success)" : "var(--clr-border)", flexShrink: 0 }} />
                      {req.label}
                    </div>
                  ))}
                </motion.div>
              )}
            </div>

            <Input
              id="con-pw" label="Confirm New Password" type="password"
              placeholder="Confirm your new password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              error={errors.confirmPassword} icon={Lock} required
            />

            <Button type="submit" size="lg" loading={loading} style={{ width: "100%", marginTop: 6 }}>
              Update Password
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default ChangePassword;
