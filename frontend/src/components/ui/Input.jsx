import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

const Input = ({
  label,
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  hint,
  icon: Icon,
  required,
  disabled,
  className = "",
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType  = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div style={{ display: "flex", flexDirection: "column" }} className={className}>
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
          {required && <span style={{ color: "var(--clr-danger)", marginLeft: 4 }}>*</span>}
        </label>
      )}

      <div style={{ position: "relative" }}>
        {Icon && (
          <span style={{
            position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
            color: "var(--clr-text-4)", display: "flex", alignItems: "center", pointerEvents: "none",
          }}>
            <Icon size={15} />
          </span>
        )}

        <input
          id={id}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`form-input${Icon ? " has-icon-left" : ""}${isPassword ? " has-icon-right" : ""}${error ? " error" : ""}`}
          style={{ opacity: disabled ? 0.55 : 1, cursor: disabled ? "not-allowed" : undefined }}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", cursor: "pointer", padding: 0,
              color: "var(--clr-text-4)", display: "flex", alignItems: "center",
            }}
          >
            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          className="form-error"
        >
          {error}
        </motion.p>
      )}
      {hint && !error && (
        <p className="form-hint">{hint}</p>
      )}
    </div>
  );
};

export default Input;
