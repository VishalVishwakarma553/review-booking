import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";

const config = {
  success: { icon: CheckCircle, color: "var(--clr-success)", cls: "toast toast-success" },
  error:   { icon: XCircle,     color: "var(--clr-danger)",  cls: "toast toast-error"   },
  warning: { icon: AlertCircle, color: "var(--clr-warn)",    cls: "toast toast-warning" },
  info:    { icon: Info,        color: "var(--clr-info)",    cls: "toast toast-info"    },
};

const Toast = ({ id, message, type = "info", onDismiss }) => {
  const timer = useRef(null);
  const { icon: Icon, color, cls } = config[type] || config.info;

  useEffect(() => {
    timer.current = setTimeout(() => onDismiss(id), 4200);
    return () => clearTimeout(timer.current);
  }, [id, onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.95 }}
      animate={{ opacity: 1, x: 0,  scale: 1    }}
      exit={{   opacity: 0, x: 50, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 360, damping: 26 }}
      className={cls}
    >
      <Icon size={18} style={{ color, flexShrink: 0, marginTop: 1 }} />
      <p style={{ fontSize: 13, color: "var(--clr-text)", flex: 1 }}>{message}</p>
      <button
        onClick={() => onDismiss(id)}
        style={{
          background: "none", border: "none", cursor: "pointer", padding: 2,
          color: "var(--clr-text-4)", display: "flex", alignItems: "center", flexShrink: 0,
        }}
      >
        <X size={14} />
      </button>
    </motion.div>
  );
};

export const ToastContainer = ({ toasts, onDismiss }) => (
  <div className="toast-container">
    <AnimatePresence>
      {toasts.map((t) => <Toast key={t.id} {...t} onDismiss={onDismiss} />)}
    </AnimatePresence>
  </div>
);

export default Toast;
