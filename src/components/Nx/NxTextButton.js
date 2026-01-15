import { forwardRef } from "react";

const NxTextButton = forwardRef(
  (
    { variant = "primary", className = "", children, disabled, ...props },
    ref
  ) => {
    const baseStyles = {
      background: "transparent",
      border: "none",
      padding: 0,
      cursor: disabled ? "not-allowed" : "pointer",
      fontSize: "13px",
      fontWeight: 600,
      fontFamily: "'Public Sans', sans-serif",
      textAlign: "right",
      transition: "opacity 0.2s ease",
      opacity: disabled ? 0.4 : 1,
    };

    const variantStyles = {
      primary: { color: "#0075bf" },
      muted: { color: "#bfbfbf" },
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        style={{ ...baseStyles, ...variantStyles[variant] }}
        className={className}
        onMouseEnter={(e) => {
          if (!disabled) e.target.style.opacity = 0.8;
        }}
        onMouseLeave={(e) => {
          if (!disabled) e.target.style.opacity = 1;
        }}
        onMouseDown={(e) => {
          if (!disabled) e.target.style.opacity = 0.6;
        }}
        onMouseUp={(e) => {
          if (!disabled) e.target.style.opacity = 0.8;
        }}
        {...props}
      >
        {children}
      </button>
    );
  }
);

NxTextButton.displayName = "NxTextButton";

export default NxTextButton;
