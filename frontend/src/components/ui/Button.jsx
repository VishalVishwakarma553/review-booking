import { motion } from "framer-motion";

const variantStyles = {
  primary:   "btn btn-primary",
  secondary: "btn btn-secondary",
  danger:    "btn btn-danger",
  ghost:     "btn btn-ghost",
};

const sizeStyles = {
  sm: "btn-sm",
  md: "btn-md",
  lg: "btn-lg",
  icon: "btn-icon",
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = "left",
  onClick,
  type = "button",
  style,
  ...props
}) => {
  const cls = `${variantStyles[variant] || "btn btn-primary"} ${sizeStyles[size] || "btn-md"} ${className}`.trim();

  return (
    <motion.button
      type={type}
      whileHover={disabled || loading ? {} : { scale: 1.015 }}
      whileTap={disabled || loading ? {} : { scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      onClick={onClick}
      disabled={disabled || loading}
      className={cls}
      style={style}
      {...props}
    >
      {loading ? (
        <span
          className="spin"
          style={{
            width: 15, height: 15, display: "inline-block",
            border: "2px solid currentColor", borderTopColor: "transparent",
            borderRadius: "50%",
          }}
        />
      ) : (
        Icon && iconPosition === "left" && <Icon size={15} />
      )}
      {children}
      {!loading && Icon && iconPosition === "right" && <Icon size={15} />}
    </motion.button>
  );
};

export default Button;
