import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Plus, Edit3 } from "lucide-react";
import api from "../../utils/api";
import { useToast } from "../../components/ui/ToastProvider";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import StarRating from "../../components/ui/StarRating";

const labels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

const StoreCard = ({ store, onRate }) => {
  const [showModal,       setShowModal]       = useState(false);
  const [selectedRating,  setSelectedRating]  = useState(store.userRating || 0);
  const [loading,         setLoading]         = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!selectedRating) return toast("Please select a rating", "warning");
    setLoading(true);
    try {
      await onRate(store.id, selectedRating, !!store.userRating);
      setShowModal(false);
      toast(store.userRating ? "Rating updated! ✨" : "Rating submitted! ⭐", "success");
    } catch {
      toast("Failed to submit rating", "error");
    } finally { setLoading(false); }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -3, boxShadow: "0 10px 32px rgba(200,149,108,0.14)" }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
        style={{ height: "100%" }}
      >
        <Card style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 16 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12, flexShrink: 0,
              background: "linear-gradient(135deg, rgba(200,149,108,0.18), rgba(232,184,154,0.18))",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: "var(--clr-primary)" }}>
                {store.name[0].toUpperCase()}
              </span>
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--clr-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {store.name}
              </h3>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 4 }}>
                <MapPin size={11} style={{ color: "var(--clr-text-4)", flexShrink: 0 }} />
                <p style={{ fontSize: 12, color: "var(--clr-text-4)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {store.address}
                </p>
              </div>
            </div>
          </div>

          {/* Overall Rating */}
          <div style={{
            padding: "10px 14px", borderRadius: 12, background: "var(--clr-surface-2)", marginBottom: 10,
          }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: "var(--clr-text-3)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Overall Rating
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <StarRating value={store.avgRating || 0} readOnly size="sm" />
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--clr-text)" }}>
                {store.avgRating ? store.avgRating.toFixed(1) : "—"}
              </span>
              {store.ratingCount > 0 && (
                <span style={{ fontSize: 11, color: "var(--clr-text-4)" }}>({store.ratingCount} reviews)</span>
              )}
            </div>
          </div>

          {/* Your Rating */}
          <div style={{
            padding: "10px 14px", borderRadius: 12,
            border: "1.5px solid var(--clr-border)", marginBottom: 14,
          }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: "var(--clr-text-3)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Your Rating
            </p>
            {store.userRating ? (
              <StarRating value={store.userRating} readOnly size="sm" showValue />
            ) : (
              <p style={{ fontSize: 12, color: "var(--clr-text-5)", fontStyle: "italic" }}>Not rated yet</p>
            )}
          </div>

          {/* Action */}
          <div style={{ marginTop: "auto" }}>
            <Button
              variant={store.userRating ? "secondary" : "primary"}
              size="sm"
              icon={store.userRating ? Edit3 : Plus}
              onClick={() => { setSelectedRating(store.userRating || 0); setShowModal(true); }}
              style={{ width: "100%" }}
            >
              {store.userRating ? "Modify Rating" : "Submit Rating"}
            </Button>
          </div>
        </Card>
      </motion.div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={store.userRating ? "Modify Your Rating" : "Rate This Store"}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 64, height: 64, borderRadius: 18, margin: "0 auto 14px",
            background: "linear-gradient(135deg, rgba(200,149,108,0.18), rgba(232,184,154,0.18))",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontSize: 24, fontWeight: 800, color: "var(--clr-primary)" }}>
              {store.name[0].toUpperCase()}
            </span>
          </div>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--clr-text)", marginBottom: 4 }}>{store.name}</h3>
          <p style={{ fontSize: 13, color: "var(--clr-text-4)", marginBottom: 24 }}>How would you rate this store?</p>

          <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
            <StarRating value={selectedRating} onChange={setSelectedRating} size="lg" />
          </div>

          {selectedRating > 0 && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ fontSize: 14, fontWeight: 600, color: "var(--clr-primary)", marginBottom: 20 }}>
              {labels[selectedRating]}
            </motion.p>
          )}
          {selectedRating === 0 && <div style={{ height: 30 }} />}

          <div style={{ display: "flex", gap: 10 }}>
            <Button variant="secondary" onClick={() => setShowModal(false)} style={{ flex: 1 }}>Cancel</Button>
            <Button loading={loading} onClick={handleSubmit} style={{ flex: 1 }}>
              {store.userRating ? "Update" : "Submit"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

const UserStores = () => {
  const [stores,  setStores]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState({ name: "", address: "" });
  const { toast } = useToast();

  const fetchStores = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.name)    params.name    = search.name;
      if (search.address) params.address = search.address;
      const res = await api.get("/stores", { params });
      setStores(res.data);
    } catch { toast("Failed to load stores", "error"); }
    finally { setLoading(false); }
  }, [search]);

  useEffect(() => { fetchStores(); }, [fetchStores]);

  const handleRate = async (storeId, value, isUpdate) => {
    if (isUpdate) await api.put(`/stores/${storeId}/rate`, { value });
    else          await api.post(`/stores/${storeId}/rate`, { value });
    fetchStores();
  };

  return (
    <div className="page-wrapper">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "var(--clr-text)" }}>Browse Stores</h1>
        <p style={{ fontSize: 14, color: "var(--clr-text-3)", marginTop: 4 }}>Discover and rate stores on our platform</p>
      </motion.div>

      {/* Search */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} style={{ marginBottom: 22 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, maxWidth: 600 }}>
          <Input id="s-name"    placeholder="Search by store name..."  value={search.name}    onChange={(e) => setSearch({ ...search, name: e.target.value })}    icon={Search} />
          <Input id="s-address" placeholder="Search by address..."     value={search.address} onChange={(e) => setSearch({ ...search, address: e.target.value })} icon={MapPin} />
        </div>
      </motion.div>

      <p style={{ fontSize: 13, color: "var(--clr-text-4)", marginBottom: 18 }}>
        {loading ? "Loading..." : `${stores.length} store${stores.length !== 1 ? "s" : ""} found`}
      </p>

      {loading ? (
        <div className="store-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 280, borderRadius: 20 }} />
          ))}
        </div>
      ) : stores.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <div style={{
            width: 64, height: 64, borderRadius: 18, margin: "0 auto 16px",
            background: "var(--clr-surface-2)", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Search size={28} style={{ color: "var(--clr-text-5)" }} />
          </div>
          <p style={{ fontWeight: 600, color: "var(--clr-text-3)" }}>No stores found</p>
          <p style={{ fontSize: 13, color: "var(--clr-text-4)", marginTop: 6 }}>Try adjusting your search</p>
        </div>
      ) : (
        <div className="store-grid">
          {stores.map((store) => (
            <StoreCard key={store.id} store={store} onRate={handleRate} />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserStores;
