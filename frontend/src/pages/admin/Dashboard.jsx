import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Store, Star, TrendingUp, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import Card from "../../components/ui/Card";
import { useToast } from "../../components/ui/ToastProvider";

const StatCard = ({ icon: Icon, label, value, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.38, ease: "easeOut" }}
  >
    <div className="stat-card">
      {/* Background accent */}
      <div style={{
        position: "absolute", top: 0, right: 0, width: 80, height: 80,
        borderRadius: "0 0 0 100%", background: color, opacity: 0.07,
      }} />
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", position: "relative" }}>
        <div>
          <p style={{ fontSize: 13, fontWeight: 500, color: "var(--clr-text-3)", marginBottom: 8 }}>{label}</p>
          <motion.p
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.15, type: "spring" }}
            style={{ fontSize: 38, fontWeight: 800, color: "var(--clr-text)", lineHeight: 1 }}
          >
            {value ?? "—"}
          </motion.p>
        </div>
        <div style={{
          width: 48, height: 48, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center",
          background: `${color}22`,
        }}>
          <Icon size={22} style={{ color }} />
        </div>
      </div>
    </div>
  </motion.div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    api.get("/admin/dashboard")
      .then((res) => setStats(res.data))
      .catch(() => toast("Failed to load dashboard", "error"))
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { icon: Users, label: "Total Users",   value: stats?.totalUsers,   color: "var(--clr-primary)" },
    { icon: Store, label: "Total Stores",  value: stats?.totalStores,  color: "var(--clr-success)" },
    { icon: Star,  label: "Total Ratings", value: stats?.totalRatings, color: "var(--clr-info)" },
  ];

  const quickActions = [
    { title: "Manage Users",  desc: "Add, view and manage all platform users",  href: "/admin/users" },
    { title: "Manage Stores", desc: "Add new stores and view all store listings", href: "/admin/stores" },
  ];

  return (
    <div className="page-wrapper">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "var(--clr-text)" }}>Dashboard</h1>
        <p style={{ fontSize: 14, color: "var(--clr-text-3)", marginTop: 4 }}>Overview of platform activity</p>
      </motion.div>

      <div className="stats-grid" style={{ marginBottom: 24 }}>
        {loading
          ? [...Array(3)].map((_, i) => (
              <div key={i} className="stat-card skeleton" style={{ height: 110 }} />
            ))
          : statCards.map((card, i) => (
              <StatCard key={card.label} {...card} delay={i * 0.08} />
            ))
        }
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: "var(--clr-primary-bg)", display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <TrendingUp size={16} style={{ color: "var(--clr-primary)" }} />
            </div>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--clr-text)" }}>Quick Actions</h3>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
            {quickActions.map((action) => (
              <Link
                key={action.title}
                to={action.href}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "16px 18px", borderRadius: 14,
                  border: "1.5px solid var(--clr-border)", textDecoration: "none",
                  transition: "all 0.18s ease",
                  background: "var(--clr-bg)",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--clr-primary)"; e.currentTarget.style.background = "var(--clr-surface-2)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--clr-border)"; e.currentTarget.style.background = "var(--clr-bg)"; }}
              >
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "var(--clr-text)", marginBottom: 3 }}>{action.title}</p>
                  <p style={{ fontSize: 12, color: "var(--clr-text-4)" }}>{action.desc}</p>
                </div>
                <ArrowRight size={16} style={{ color: "var(--clr-primary)", flexShrink: 0 }} />
              </Link>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
