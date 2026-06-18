import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, User, Mail, MapPin, Shield, Star } from "lucide-react";
import api from "../../utils/api";
import { useToast } from "../../components/ui/ToastProvider";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import StarRating from "../../components/ui/StarRating";

const InfoRow = ({ icon: Icon, label, value }) => (
  <div style={{
    display: "flex", alignItems: "flex-start", gap: 12,
    padding: "14px 0", borderBottom: "1px solid var(--clr-border-light)",
  }}>
    <div style={{
      width: 34, height: 34, borderRadius: 10, flexShrink: 0, marginTop: 2,
      background: "var(--clr-surface-2)", display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <Icon size={15} style={{ color: "var(--clr-text-3)" }} />
    </div>
    <div>
      <p style={{ fontSize: 11, fontWeight: 600, color: "var(--clr-text-4)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>{label}</p>
      <p style={{ fontSize: 14, color: "var(--clr-text)", fontWeight: 500 }}>{value || "—"}</p>
    </div>
  </div>
);

const AdminUserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/admin/users/${id}`)
      .then((res) => setUser(res.data))
      .catch(() => { toast("User not found", "error"); navigate("/admin/users"); })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="skeleton" style={{ height: 36, width: 180, marginBottom: 28, borderRadius: 10 }} />
        <div className="skeleton" style={{ height: 240, borderRadius: 20 }} />
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
        <Button variant="ghost" icon={ArrowLeft} onClick={() => navigate("/admin/users")} style={{ marginBottom: 18, marginLeft: -8 }}>
          Back to Users
        </Button>
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div style={{
            width: 60, height: 60, borderRadius: 18, flexShrink: 0,
            background: "linear-gradient(135deg, var(--clr-primary), #E8B89A)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <User size={26} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--clr-text)", marginBottom: 6 }}>{user?.name}</h1>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <Badge label={user?.role} variant={user?.role} />
              <span style={{ fontSize: 12, color: "var(--clr-text-4)" }}>
                Joined {new Date(user?.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      <div style={{ maxWidth: 600, display: "flex", flexDirection: "column", gap: 20 }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--clr-text)", marginBottom: 4 }}>User Information</h3>
            <div style={{ borderTop: "1px solid var(--clr-border-light)", marginTop: 12 }}>
              <InfoRow icon={User}   label="Full Name"     value={user?.name} />
              <InfoRow icon={Mail}   label="Email Address" value={user?.email} />
              <InfoRow icon={MapPin} label="Address"       value={user?.address} />
              <InfoRow icon={Shield} label="Role"          value={user?.role === "ADMIN" ? "Administrator" : user?.role === "OWNER" ? "Store Owner" : "Normal User"} />
            </div>
          </Card>
        </motion.div>

        {user?.role === "OWNER" && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 10,
                  background: "var(--clr-primary-bg)", display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Star size={16} style={{ color: "var(--clr-primary)" }} />
                </div>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--clr-text)" }}>Store Rating</h3>
              </div>
              <StarRating value={user?.avgRating || 0} readOnly showValue size="lg" />
              {!user?.avgRating && (
                <p style={{ fontSize: 13, color: "var(--clr-text-4)", marginTop: 8 }}>No ratings submitted yet</p>
              )}
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminUserDetail;
