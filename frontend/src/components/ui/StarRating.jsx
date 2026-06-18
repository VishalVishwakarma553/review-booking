import { useState } from "react";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

const labels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

const StarRating = ({
  value = 0,
  onChange,
  readOnly = false,
  size = "md",
  showValue = false,
  className = "",
}) => {
  const [hovered, setHovered] = useState(0);

  const px = { sm: 16, md: 22, lg: 30 }[size] || 22;
  const display = readOnly ? value : (hovered || value);

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 3 }} className={className}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= display;
        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            className="star-btn"
            onMouseEnter={() => !readOnly && setHovered(star)}
            onMouseLeave={() => !readOnly && setHovered(0)}
            onClick={() => !readOnly && onChange?.(star)}
            aria-label={`Rate ${star}`}
          >
            <Star
              size={px}
              style={{
                fill: filled ? "var(--clr-primary)" : "transparent",
                color: filled ? "var(--clr-primary)" : "var(--clr-border)",
                transition: "fill 0.12s, color 0.12s",
              }}
            />
          </button>
        );
      })}

      {showValue && (
        <span style={{ marginLeft: 6, fontSize: 13, fontWeight: 500, color: "var(--clr-text-3)" }}>
          {value > 0 ? (typeof value === "number" ? value.toFixed(1) : value) : "No ratings"}
        </span>
      )}
    </div>
  );
};

export default StarRating;
