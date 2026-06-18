import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const sizeMap = { sm: 420, md: 520, lg: 700, xl: 900 };

const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
  const maxW = sizeMap[size] || 520;

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === "Escape") onClose(); };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="modal-backdrop"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 18 }}
            animate={{ opacity: 1, scale: 1,    y: 0 }}
            exit={{   opacity: 0, scale: 0.94, y: 18 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className="modal-panel"
            style={{ maxWidth: maxW }}
            onClick={(e) => e.stopPropagation()}
          >
            {title && (
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "16px 20px", borderBottom: "1px solid var(--clr-border-light)",
              }}>
                <h2 style={{ fontSize: 16, fontWeight: 600, color: "var(--clr-text)" }}>{title}</h2>
                <button
                  onClick={onClose}
                  style={{
                    background: "none", border: "none", cursor: "pointer", padding: 6,
                    borderRadius: 8, color: "var(--clr-text-4)",
                    display: "flex", alignItems: "center",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "var(--clr-surface-2)"; e.currentTarget.style.color = "var(--clr-text)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "var(--clr-text-4)"; }}
                >
                  <X size={16} />
                </button>
              </div>
            )}
            <div style={{ padding: "20px" }}>{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
