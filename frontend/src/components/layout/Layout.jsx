import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, BookOpen } from "lucide-react";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <main className="app-main">
        {/* Mobile Top Bar */}
        <div className="mobile-topbar">
          <button
            className="hamburger"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: "linear-gradient(135deg, var(--clr-primary), #E8B89A)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <BookOpen size={14} color="#fff" />
            </div>
            <span style={{ fontSize: 15, fontWeight: 700, color: "var(--clr-text)" }}>Review Book</span>
          </div>
          {/* spacer */}
          <div style={{ width: 38 }} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          style={{ minHeight: "100%" }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default Layout;
