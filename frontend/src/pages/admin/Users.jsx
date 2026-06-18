import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, User, Mail, MapPin, Filter } from "lucide-react";
import api from "../../utils/api";
import { useToast } from "../../components/ui/ToastProvider";
import Table from "../../components/ui/Table";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Modal from "../../components/ui/Modal";
import Card from "../../components/ui/Card";

const AdminUsers = () => {
  const [users,       setUsers]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [filters,     setFilters]     = useState({ name: "", email: "", address: "", role: "" });
  const [sortField,   setSortField]   = useState("name");
  const [sortOrder,   setSortOrder]   = useState("asc");
  const [showModal,   setShowModal]   = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [form,        setForm]        = useState({ name: "", email: "", password: "", address: "", role: "USER" });
  const [formErrors,  setFormErrors]  = useState({});
  const { toast } = useToast();
  const navigate  = useNavigate();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/users", { params: { ...filters, sortBy: sortField, sortOrder } });
      setUsers(res.data);
    } catch { toast("Failed to fetch users", "error"); }
    finally { setLoading(false); }
  }, [filters, sortField, sortOrder]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleSort = (field) => {
    if (sortField === field) setSortOrder((o) => o === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortOrder("asc"); }
  };

  const validateForm = () => {
    const e = {};
    if (!form.name) e.name = "Required";
    else if (form.name.length < 20) e.name = "Min 20 characters";
    else if (form.name.length > 60) e.name = "Max 60 characters";
    if (!form.email) e.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    if (!form.address) e.address = "Required";
    else if (form.address.length > 400) e.address = "Max 400 chars";
    if (!form.password) e.password = "Required";
    else if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,16}$/.test(form.password))
      e.password = "8–16 chars, uppercase & special char";
    return e;
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    const errs = validateForm();
    if (Object.keys(errs).length) return setFormErrors(errs);
    setFormErrors({});
    setFormLoading(true);
    try {
      await api.post("/admin/users", form);
      toast("User added!", "success");
      setShowModal(false);
      setForm({ name: "", email: "", password: "", address: "", role: "USER" });
      fetchUsers();
    } catch (err) { toast(err.response?.data?.message || "Failed", "error"); }
    finally { setFormLoading(false); }
  };

  const selectStyle = {
    width: "100%", padding: "10px 14px", fontSize: 14, fontFamily: "inherit",
    color: "var(--clr-text)", background: "var(--clr-surface)",
    border: "1.5px solid var(--clr-border)", borderRadius: 12, outline: "none",
    transition: "border-color 0.15s", cursor: "pointer",
    appearance: "auto",
  };

  const columns = [
    { key: "name",    label: "Name",    sortable: true },
    { key: "email",   label: "Email",   sortable: true },
    { key: "address", label: "Address", sortable: true,
      render: (val) => <span title={val} style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>{val}</span> },
    { key: "role", label: "Role", sortable: true,
      render: (val) => <Badge label={val} variant={val} /> },
  ];

  return (
    <div className="page-wrapper">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24, gap: 12, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: "var(--clr-text)" }}>Users</h1>
          <p style={{ fontSize: 13, color: "var(--clr-text-3)", marginTop: 3 }}>{users.length} users found</p>
        </div>
        <Button icon={Plus} onClick={() => setShowModal(true)}>Add User</Button>
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} style={{ marginBottom: 20 }}>
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Filter size={14} style={{ color: "var(--clr-text-3)" }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--clr-text-2)" }}>Filters</span>
          </div>
          <div className="filters-grid">
            <Input id="f-name"    placeholder="Filter by name..."    value={filters.name}    onChange={(e) => setFilters({ ...filters, name: e.target.value })}    icon={User} />
            <Input id="f-email"   placeholder="Filter by email..."   value={filters.email}   onChange={(e) => setFilters({ ...filters, email: e.target.value })}   icon={Mail} />
            <Input id="f-address" placeholder="Filter by address..." value={filters.address} onChange={(e) => setFilters({ ...filters, address: e.target.value })} icon={MapPin} />
            <div>
              <label className="form-label">Role</label>
              <select value={filters.role} onChange={(e) => setFilters({ ...filters, role: e.target.value })} style={selectStyle}>
                <option value="">All Roles</option>
                <option value="ADMIN">Admin</option>
                <option value="USER">User</option>
                <option value="OWNER">Store Owner</option>
              </select>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.16 }}>
        <Table
          columns={columns} data={users} loading={loading}
          sortField={sortField} sortOrder={sortOrder} onSort={handleSort}
          onRowClick={(row) => navigate(`/admin/users/${row.id}`)}
          emptyMessage="No users found"
        />
      </motion.div>

      {/* Add User Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New User">
        <form onSubmit={handleAddUser} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Input id="a-name"    label="Full Name"  placeholder="Min. 20 characters" value={form.name}    onChange={(e) => setForm({ ...form, name: e.target.value })}    error={formErrors.name}    icon={User}   required hint={`${form.name.length}/60`} />
          <Input id="a-email"   label="Email"      type="email" placeholder="user@example.com"  value={form.email}   onChange={(e) => setForm({ ...form, email: e.target.value })}   error={formErrors.email}   icon={Mail}   required />
          <Input id="a-address" label="Address"    placeholder="Full address"        value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} error={formErrors.address} icon={MapPin} required />
          <Input id="a-pass"    label="Password"   type="password" placeholder="Strong password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} error={formErrors.password} required />
          <div>
            <label className="form-label">Role <span style={{ color: "var(--clr-danger)" }}>*</span></label>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} style={selectStyle}>
              <option value="USER">Normal User</option>
              <option value="ADMIN">Admin</option>
              <option value="OWNER">Store Owner</option>
            </select>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)} style={{ flex: 1 }}>Cancel</Button>
            <Button type="submit" loading={formLoading} style={{ flex: 1 }}>Add User</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminUsers;
