import { motion } from "framer-motion";

const Card = ({
  children,
  className = "",
  hover = false,
  padding,
  onClick,
  style,
  ...props
}) => {
  return (
    <motion.div
      whileHover={hover ? { y: -2, boxShadow: "0 8px 28px rgba(200,149,108,0.15)" } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      onClick={onClick}
      className={`card ${className}`}
      style={{ cursor: hover || onClick ? "pointer" : undefined, padding, ...style }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const CardHeader = ({ children, className = "", style }) => (
  <div style={{ marginBottom: 20, ...style }} className={className}>{children}</div>
);

export const CardTitle = ({ children, style }) => (
  <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--clr-text)", ...style }}>{children}</h3>
);

export const CardDescription = ({ children }) => (
  <p style={{ fontSize: 13, color: "var(--clr-text-3)", marginTop: 4 }}>{children}</p>
);

export default Card;
