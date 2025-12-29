import React, { useState } from "react";

const SearchIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="7.5"
      cy="7.5"
      r="5.25"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15.75 15.75L11.25 11.25"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ClearIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="7" cy="7" r="6" fill="currentColor" />
    <path
      d="M4.5 4.5L9.5 9.5M9.5 4.5L4.5 9.5"
      stroke="white"
      strokeWidth="1.25"
      strokeLinecap="round"
    />
  </svg>
);

const NxSearchInput = ({
  value = "",
  onChange,
  onSearch,
  onClear,
  placeholder = "Search",
  disabled = false,
  size = "middle",
  allowClear = true,
  className = "",
  style = {},
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Size configurations matching NxDateRangePicker
  const sizeConfig = {
    small: {
      height: "28px",
      fontSize: "13px",
      padding: "2px 8px",
      iconSize: "14px",
      gap: "6px",
    },
    middle: {
      height: "32px",
      fontSize: "14px",
      padding: "4px 12px",
      iconSize: "16px",
      gap: "8px",
    },
    large: {
      height: "40px",
      fontSize: "15px",
      padding: "6px 14px",
      iconSize: "18px",
      gap: "10px",
    },
  };

  const currentSize = sizeConfig[size] || sizeConfig.middle;

  const getContainerStyle = () => {
    let baseStyle = {
      display: "flex",
      alignItems: "center",
      gap: currentSize.gap,
      width: "100%",
      height: currentSize.height,
      padding: currentSize.padding,
      fontSize: currentSize.fontSize,
      borderRadius: "6px",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "#dbdade",
      backgroundColor: disabled ? "#f5f5f5" : "#fff",
      boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      transition: "all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)",
      cursor: disabled ? "not-allowed" : "text",
      opacity: disabled ? 0.6 : 1,
      outline: "none",
      ...style,
    };

    if (isHovered && !disabled) {
      baseStyle.borderColor = "#40a9ff";
      baseStyle.boxShadow = "0 2px 4px 0 rgba(64, 169, 255, 0.1)";
    }

    if (isFocused && !disabled) {
      baseStyle.borderColor = "#40a9ff";
      baseStyle.boxShadow = "0 0 0 2px rgba(24, 144, 255, 0.1)";
    }

    return baseStyle;
  };

  const handleChange = (e) => {
    if (onChange) {
      onChange(e);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && onSearch) {
      onSearch(value);
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    if (onChange) {
      onChange({ target: { value: "" } });
    }
    if (onClear) {
      onClear();
    }
  };

  const showClearButton = allowClear && value && !disabled;

  return (
    <div
      className={className}
      style={getContainerStyle()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Search Icon */}
      <span
        style={{
          color: "#bfbfbf",
          display: "flex",
          flexShrink: 0,
          width: currentSize.iconSize,
          height: currentSize.iconSize,
        }}
      >
        <SearchIcon />
      </span>

      {/* Input */}
      <style>
        {`
          .nx-search-input::placeholder {
            color: #bfbfbf;
            opacity: 1;
          }
        `}
      </style>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        disabled={disabled}
        className="nx-search-input"
        style={{
          flex: 1,
          border: "none",
          outline: "none",
          backgroundColor: "transparent",
          fontSize: currentSize.fontSize,
          color: "#4B465C",
          lineHeight: "1.5",
          cursor: disabled ? "not-allowed" : "text",
        }}
      />

      {/* Clear Button */}
      {showClearButton && (
        <span
          onClick={handleClear}
          style={{
            color: "#bfbfbf",
            display: "flex",
            flexShrink: 0,
            cursor: "pointer",
            transition: "color 0.2s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.color = "#8c8c8c")}
          onMouseOut={(e) => (e.currentTarget.style.color = "#bfbfbf")}
        >
          <ClearIcon />
        </span>
      )}
    </div>
  );
};

export default NxSearchInput;
