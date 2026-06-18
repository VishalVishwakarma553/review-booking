import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Store, Mail, MapPin, Filter } from "lucide-react";
import api from "../../utils/api";
import { useToast } from "../../components/ui/ToastProvider";
import Table from "../../components/ui/Table";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Modal from "../../components/ui/Modal";
import Card from "../../components/ui/Card";
import StarRating from "../../components/ui/StarRating";

const AdminStores = () => {
  const [stores,      setStores]      = useState([]);
  const [users,       setUsers]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [filters,     setFilters]     = useState({ name: "", email: "", address: "" });
  const [sortField,   setSortField]   = useState("name");
  const [sortOrder,   setSortOrder]   = useState("asc");
  const [showModal,   setShowModal]   = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [form,        setForm]        = useState({ name: "", email: "", address: "", ownerId: "" });
  const [formErrors,  setFormErrors]  = useState({});
  const { toast } = useToast();

  const fetchStores = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/stores", { params: { ...filters, sortBy: sortField, sortOrder } });
      setStores(res.data);
    } catch { toast("Failed to fetch stores", "error"); }
    finally { setLoading(false); }
  }, [filters, sortField, sortOrder]);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data);
    } catch {}
  }, []);

  useEffect(() => { fetchStores(); }, [fetchStores]);
  useEffect(() => { fetchUsers();  }, [fetchUsers]);

  const handleSort = (field) => {
    if (sortField === field) setSortOrder((o) => o === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortOrder("asc"); }
  };

  const handleAddStore = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.name)    errs.name    = "Required";
    if (!form.email)   errs.email   = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Invalid email";
    if (!form.address) errs.address = "Required";
    if (Object.keys(errs).length) return setFormErrors(errs);
    setFormErrors({});
    setFormLoading(true);
    try {
      await api.post("/admin/stores", form);
      toast("Store added!", "success");
      setShowModal(false);
      setForm({ name: "", email: "", address: "", ownerId: "" });
      fetchStores();
    } catch (err) { toast(err.response?.data?.message || "Failed", "error"); }
    finally { setFormLoading(false); }
  };

  const selectStyle = {
    width: "100%", padding: "10px 14px", fontSize: 14, fontFamily: "inherit",
    color: "var(--clr-text)", background: "var(--clr-surface)",
    border: "1.5px solid var(--clr-border)", borderRadius: 12, outline: "none",
    transition: "border-color 0.15s", cursor: "pointer", appearance: "auto",
  };

  const columns = [
    { key: "name",      label: "Name",    sortable: true },
    { key: "email",     label: "Email",   sortable: true },
    { key: "address",   label: "Address", sortable: true,
      render: (val) => <span title={val} style={{ maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>{val}</span> },
    { key: "ownerName", label: "Owner",
      render: (val) => val || <span style={{ color: "var(--clr-text-5)", fontSize: 12 }}>Unassigned</span> },
    { key: "avgRating", label: "Rating",
      render: (val, row) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <StarRating value={val || 0} readOnly size="sm" />
          <span style={{ fontSize: 12, color: "var(--clr-text-3)", whiteSpace: "nowrap" }}>
            {val ? `${val} (${row.ratingCount})` : "No ratings"}
          </span>
        </div>
      )},
  ];

  return (
    <div className="page-wrapper">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24, gap: 12, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: "var(--clr-text)" }}>Stores</h1>
          <p style={{ fontSize: 13, color: "var(--clr-text-3)", marginTop: 3 }}>{stores.length} stores found</p>
        </div>
        <Button icon={Plus} onClick={() => setShowModal(true)}>Add Store</Button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} style={{ marginBottom: 20 }}>
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Filter size={14} style={{ color: "var(--clr-text-3)" }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--clr-text-2)" }}>Filters</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
            <Input id="sf-name"    placeholder="Filter by name..."    value={filters.name}    onChange={(e) => setFilters({ ...filters, name: e.target.value })}    icon={Store} />
            <Input id="sf-email"   placeholder="Filter by email..."   value={filters.email}   onChange={(e) => setFilters({ ...filters, email: e.target.value })}   icon={Mail} />
            <Input id="sf-address" placeholder="Filter by address..." value={filters.address} onChange={(e) => setFilters({ ...filters, address: e.target.value })} icon={MapPin} />
          </div>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.16 }}>
        <Table
          columns={columns} data={stores} loading={loading}
          sortField={sortField} sortOrder={sortOrder} onSort={handleSort}
          emptyMessage="No stores found"
        />
      </motion.div>

      {/* Add Store Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Store">
        <form onSubmit={handleAddStore} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Input id="as-name"    label="Store Name" placeholder="Store name"        value={form.name}    onChange={(e) => setForm({ ...form, name: e.target.value })}    error={formErrors.name}    icon={Store} required />
          <Input id="as-email"   label="Store Email" type="email" placeholder="store@example.com" value={form.email}   onChange={(e) => setForm({ ...form, email: e.target.value })}   error={formErrors.email}   icon={Mail}  required />
          <Input id="as-address" label="Address"    placeholder="Store address"     value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} error={formErrors.address} icon={MapPin} required />
          <div>
            <label className="form-label">Assign Owner (optional)</label>
            <select value={form.ownerId} onChange={(e) => setForm({ ...form, ownerId: e.target.value })} style={selectStyle}>
              <option value="">No owner</option>
              {users.map((u) => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
            </select>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)} style={{ flex: 1 }}>Cancel</Button>
            <Button type="submit" loading={formLoading} style={{ flex: 1 }}>Add Store</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminStores;
