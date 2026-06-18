import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, Store, KeyRound, LogOut,
  BookOpen, ChevronLeft, ChevronRight, ShieldCheck, UserCircle, X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const adminNav = [
  { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/admin/users", icon: Users, label: "Users" },
  { to: "/admin/stores", icon: Store, label: "Stores" },
];

const userNav = [
  { to: "/stores", icon: Store, label: "Browse Stores" },
  { to: "/change-password", icon: KeyRound, label: "Change Password" },
];

const ownerNav = [
  { to: "/owner/dashboard", icon: LayoutDashboard, label: "My Store" },
  { to: "/change-password", icon: KeyRound, label: "Change Password" },
];

const roleNavMap = { ADMIN: adminNav, USER: userNav, OWNER: ownerNav };
const roleIcons = { ADMIN: ShieldCheck, USER: UserCircle, OWNER: Store };
const roleLabels = { ADMIN: "Administrator", USER: "Normal User", OWNER: "Store Owner" };

// Exported so Layout can control it
const Sidebar = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = roleNavMap[user?.role] || [];
  const RoleIcon = roleIcons[user?.role] || UserCircle;
  const isDesktopCollapsed = collapsed;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Auto-close sidebar on mobile when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const logoSection = (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "18px 16px", borderBottom: "1px solid var(--clr-border-light)", flexShrink: 0 }}>
      <div style={{
        width: 36, height: 36, borderRadius: 12, flexShrink: 0,
        background: "linear-gradient(135deg, var(--clr-primary) 0%, #E8B89A 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <BookOpen size={18} color="#fff" />
      </div>
      <AnimatePresence>
        {(!isDesktopCollapsed || mobileOpen) && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.18 }}
            style={{ overflow: "hidden", whiteSpace: "nowrap" }}
          >
            <div style={{ fontSize: 15, fontWeight: 700, color: "var(--clr-text)", lineHeight: 1.2 }}>Review Book</div>
            <div style={{ fontSize: 11, color: "var(--clr-text-4)", marginTop: 2 }}>Store Platform</div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Mobile close button */}
      <button
        onClick={() => setMobileOpen(false)}
        className="hamburger"
        style={{ marginLeft: "auto", display: "none" }}
        id="sidebar-close-btn"
      >
        <X size={16} />
      </button>
    </div>
  );

  const profileSection = (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: "12px 14px", borderBottom: "1px solid var(--clr-border-light)",
      justifyContent: (isDesktopCollapsed && !mobileOpen) ? "center" : "flex-start",
      flexShrink: 0,
    }}>
      <div style={{
        width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
        background: "var(--clr-surface-3)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <RoleIcon size={16} color="var(--clr-primary-dark)" />
      </div>
      <AnimatePresence>
        {(!isDesktopCollapsed || mobileOpen) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{ minWidth: 0, overflow: "hidden" }}
          >
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--clr-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 140 }}>
              {user?.name?.split(" ")[0] || "User"}
            </div>
            <div style={{ fontSize: 11, color: "var(--clr-text-4)" }}>
              {roleLabels[user?.role]}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const navSection = (
    <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          title={(isDesktopCollapsed && !mobileOpen) ? item.label : ""}
          style={({ isActive }) => ({
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 12px",
            borderRadius: 12,
            fontSize: 13,
            fontWeight: 500,
            textDecoration: "none",
            transition: "all 0.15s ease",
            justifyContent: (isDesktopCollapsed && !mobileOpen) ? "center" : "flex-start",
            background: isActive ? "var(--clr-primary-bg)" : "transparent",
            color: isActive ? "var(--clr-primary-dark)" : "var(--clr-text-3)",
            border: isActive ? "1px solid rgba(200,149,108,0.20)" : "1px solid transparent",
          })}
        >
          {({ isActive }) => (
            <>
              <item.icon size={18} style={{ flexShrink: 0, color: isActive ? "var(--clr-primary)" : "currentColor" }} />
              <AnimatePresence>
                {(!isDesktopCollapsed || mobileOpen) && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.12 }}
                    style={{ whiteSpace: "nowrap" }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );

  const bottomSection = (
    <div style={{ padding: "8px 8px 12px", borderTop: "1px solid var(--clr-border-light)", flexShrink: 0, display: "flex", flexDirection: "column", gap: 2 }}>
      <button
        onClick={handleLogout}
        style={{
          display: "flex", alignItems: "center", gap: 10,
          width: "100%", padding: "10px 12px", borderRadius: 12,
          background: "transparent", border: "1px solid transparent",
          fontSize: 13, fontWeight: 500, cursor: "pointer",
          color: "var(--clr-danger)",
          justifyContent: (isDesktopCollapsed && !mobileOpen) ? "center" : "flex-start",
          transition: "all 0.15s ease",
          fontFamily: "inherit",
        }}
        onMouseEnter={e => e.currentTarget.style.background = "var(--clr-danger-bg)"}
        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        title={(isDesktopCollapsed && !mobileOpen) ? "Logout" : ""}
      >
        <LogOut size={18} style={{ flexShrink: 0 }} />
        <AnimatePresence>
          {(!isDesktopCollapsed || mobileOpen) && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }} style={{ whiteSpace: "nowrap" }}>
              Logout
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      <button
        className="collapse-btn"
        onClick={() => setCollapsed(!collapsed)}
        style={{
          display: "flex", alignItems: "center", gap: 10,
          width: "100%", padding: "10px 12px", borderRadius: 12,
          background: "transparent", border: "1px solid transparent",
          fontSize: 13, fontWeight: 500, cursor: "pointer",
          color: "var(--clr-text-4)",
          justifyContent: (isDesktopCollapsed && !mobileOpen) ? "center" : "flex-start",
          transition: "all 0.15s ease",
          fontFamily: "inherit",
        }}
        onMouseEnter={e => e.currentTarget.style.background = "var(--clr-surface-2)"}
        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
      >
        {collapsed ? <ChevronRight size={18} style={{ flexShrink: 0 }} /> : <ChevronLeft size={18} style={{ flexShrink: 0 }} />}
        <AnimatePresence>
          {!isDesktopCollapsed && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }} style={{ whiteSpace: "nowrap" }}>
              Collapse
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="sidebar-overlay active"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`app-sidebar ${collapsed ? "collapsed" : "expanded"} ${mobileOpen ? "mobile-open" : ""}`}
      >
        {logoSection}
        {profileSection}
        {navSection}
        {bottomSection}
      </aside>
    </>
  );
};

export default Sidebar;
