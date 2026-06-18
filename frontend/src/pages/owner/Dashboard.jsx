import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Users, TrendingUp, MapPin, Mail, Store } from "lucide-react";
import api from "../../utils/api";
import { useToast } from "../../components/ui/ToastProvider";
import Card from "../../components/ui/Card";
import Table from "../../components/ui/Table";
import StarRating from "../../components/ui/StarRating";

const OwnerDashboard = () => {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    api.get("/owner/dashboard")
      .then((res) => setData(res.data))
      .catch(() => toast("Failed to load dashboard", "error"))
      .finally(() => setLoading(false));
  }, []);

  const avgRating = data?.avgRating;
  const status = avgRating >= 4 ? "Excellent" : avgRating >= 3 ? "Good" : avgRating ? "Needs Work" : "New";
  const statusColor = avgRating >= 4 ? "var(--clr-success)" : avgRating >= 3 ? "var(--clr-info)" : avgRating ? "var(--clr-danger)" : "var(--clr-text-4)";

  const raterColumns = [
    { key: "userName",  label: "Customer",    sortable: false },
    { key: "userEmail", label: "Email",        sortable: false,
      render: (val) => <span style={{ fontSize: 13, color: "var(--clr-text-3)" }}>{val}</span> },
    { key: "value",     label: "Rating",       render: (val) => <StarRating value={val} readOnly size="sm" showValue /> },
    { key: "updatedAt", label: "Date",
      render: (val) => <span style={{ fontSize: 13, color: "var(--clr-text-4)" }}>{new Date(val).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</span> },
  ];

  return (
    <div className="page-wrapper">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "var(--clr-text)" }}>My Store Dashboard</h1>
        <p style={{ fontSize: 14, color: "var(--clr-text-3)", marginTop: 4 }}>Track your store's performance and ratings</p>
      </motion.div>

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="skeleton" style={{ height: 100, borderRadius: 20 }} />
          <div className="stats-grid">
            {[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: 110, borderRadius: 20 }} />)}
          </div>
          <div className="skeleton" style={{ height: 240, borderRadius: 20 }} />
        </div>
      ) : (
        <>
          {/* Store Info Card */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ marginBottom: 20 }}>
            <Card>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
                <div style={{
                  width: 54, height: 54, borderRadius: 16, flexShrink: 0,
                  background: "linear-gradient(135deg, var(--clr-primary), #E8B89A)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Store size={24} color="#fff" />
                </div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--clr-text)", marginBottom: 8 }}>{data?.store?.name}</h2>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--clr-text-3)" }}>
                      <Mail size={13} style={{ color: "var(--clr-text-4)", flexShrink: 0 }} />
                      {data?.store?.email}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--clr-text-3)" }}>
                      <MapPin size={13} style={{ color: "var(--clr-text-4)", flexShrink: 0 }} />
                      {data?.store?.address}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Stats */}
          <div className="stats-grid" style={{ marginBottom: 24 }}>
            {[
              {
                icon: Star, label: "Average Rating",
                color: "var(--clr-primary)",
                children: (
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 500, color: "var(--clr-text-3)", marginBottom: 8 }}>Average Rating</p>
                    <p style={{ fontSize: 36, fontWeight: 800, color: "var(--clr-text)", lineHeight: 1, marginBottom: 8 }}>
                      {avgRating ? avgRating.toFixed(1) : "—"}
                    </p>
                    {avgRating && <StarRating value={avgRating} readOnly size="sm" />}
                  </div>
                ),
              },
              {
                icon: Users, label: "Total Reviews",
                color: "var(--clr-success)",
                children: (
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 500, color: "var(--clr-text-3)", marginBottom: 8 }}>Total Reviews</p>
                    <p style={{ fontSize: 36, fontWeight: 800, color: "var(--clr-text)", lineHeight: 1 }}>{data?.totalRatings ?? 0}</p>
                  </div>
                ),
              },
              {
                icon: TrendingUp, label: "Rating Status",
                color: statusColor,
                children: (
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 500, color: "var(--clr-text-3)", marginBottom: 8 }}>Rating Status</p>
                    <p style={{ fontSize: 28, fontWeight: 800, color: statusColor, lineHeight: 1 }}>{status}</p>
                  </div>
                ),
              },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.08 }}
              >
                <div className="stat-card">
                  <div style={{
                    position: "absolute", top: 0, right: 0, width: 70, height: 70,
                    borderRadius: "0 0 0 100%", background: stat.color, opacity: 0.09,
                  }} />
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", position: "relative" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>{stat.children}</div>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12, flexShrink: 0, marginLeft: 12,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: `${stat.color}20`,
                    }}>
                      <stat.icon size={20} style={{ color: stat.color }} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Raters Table */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--clr-text)" }}>Customer Reviews</h2>
              <span style={{ fontSize: 12, color: "var(--clr-text-4)" }}>{data?.raters?.length || 0} reviews</span>
            </div>
            <Table columns={raterColumns} data={data?.raters || []} emptyMessage="No ratings submitted yet" />
          </motion.div>
        </>
      )}
    </div>
  );
};

export default OwnerDashboard;
