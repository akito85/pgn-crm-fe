import React, { useState, useRef, useEffect, useCallback } from "react";

const ChevronDownIcon = ({ isOpen }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      transition: "transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)",
      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
    }}
  >
    <path
      d="M4.5 6.75L9 11.25L13.5 6.75"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CheckIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3.5 8.5L6.5 11.5L12.5 4.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const NxDropdownBase = ({
  value,
  onChange,
  options = [],
  placeholder = "Select",
  disabled = false,
  size = "middle",
  allowClear = false,
  showSearch = false,
  loading = false,
  notFoundContent = "No options found",
  className = "",
  style = {},
  dropdownStyle = {},
  optionLabelProp = "label", // 'label' or 'value' - what to display when selected
  labelInValue = false, // if true, onChange receives { value, label } instead of just value
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  
  const containerRef = useRef(null);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Size configurations matching NxSearchInput
  const sizeConfig = {
    small: {
      height: "28px",
      fontSize: "13px",
      padding: "2px 8px",
      iconSize: "14px",
      gap: "6px",
      optionPadding: "6px 8px",
    },
    middle: {
      height: "32px",
      fontSize: "14px",
      padding: "4px 12px",
      iconSize: "16px",
      gap: "8px",
      optionPadding: "8px 12px",
    },
    large: {
      height: "40px",
      fontSize: "15px",
      padding: "6px 14px",
      iconSize: "18px",
      gap: "10px",
      optionPadding: "10px 14px",
    },
  };

  const currentSize = sizeConfig[size] || sizeConfig.middle;

  // Normalize options to always have { value, label } format
  const normalizedOptions = options.map((opt) => {
    if (typeof opt === "string" || typeof opt === "number") {
      return { value: opt, label: String(opt) };
    }
    return {
      value: opt.value,
      label: opt.label ?? opt.value,
      disabled: opt.disabled ?? false,
      ...opt,
    };
  });

  // Filter options based on search
  const filteredOptions = showSearch && searchValue
    ? normalizedOptions.filter((opt) =>
        String(opt.label).toLowerCase().includes(searchValue.toLowerCase())
      )
    : normalizedOptions;

  // Find selected option
  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setSearchValue("");
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, showSearch]);

  // Reset highlighted index when options change
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [searchValue]);

  const getContainerStyle = () => {
    let baseStyle = {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
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
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.6 : 1,
      outline: "none",
      userSelect: "none",
      position: "relative",
      ...style,
    };

    if (isHovered && !disabled) {
      baseStyle.borderColor = "#40a9ff";
      baseStyle.boxShadow = "0 2px 4px 0 rgba(64, 169, 255, 0.1)";
    }

    if ((isFocused || isOpen) && !disabled) {
      baseStyle.borderColor = "#40a9ff";
      baseStyle.boxShadow = "0 0 0 2px rgba(24, 144, 255, 0.1)";
    }

    return baseStyle;
  };

  const getDropdownStyle = () => ({
    position: "absolute",
    top: "calc(100% + 4px)",
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: "6px",
    border: "1px solid #dbdade",
    boxShadow: "0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12)",
    zIndex: 1050,
    maxHeight: "256px",
    overflowY: "auto",
    overflowX: "hidden",
    padding: "4px 0",
    opacity: isOpen ? 1 : 0,
    visibility: isOpen ? "visible" : "hidden",
    transform: isOpen ? "translateY(0)" : "translateY(-8px)",
    transition: "all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1)",
    ...dropdownStyle,
  });

  const getOptionStyle = (opt, index) => {
    const isSelected = opt.value === value;
    const isHighlighted = index === highlightedIndex;
    const isDisabled = opt.disabled;

    return {
      padding: currentSize.optionPadding,
      fontSize: currentSize.fontSize,
      color: isDisabled ? "#bfbfbf" : isSelected ? "#1890ff" : "#4B465C",
      backgroundColor: isHighlighted && !isDisabled ? "#f5f5f5" : "transparent",
      cursor: isDisabled ? "not-allowed" : "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "8px",
      transition: "background-color 0.15s",
      opacity: isDisabled ? 0.5 : 1,
    };
  };

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (isOpen) {
        setSearchValue("");
        setHighlightedIndex(-1);
      }
    }
  };

  const handleSelect = useCallback(
    (opt) => {
      if (opt.disabled) return;

      const newValue = labelInValue ? { value: opt.value, label: opt.label } : opt.value;
      
      if (onChange) {
        onChange(newValue, opt);
      }
      
      setIsOpen(false);
      setSearchValue("");
      setHighlightedIndex(-1);
    },
    [onChange, labelInValue]
  );

  const handleClear = (e) => {
    e.stopPropagation();
    if (onChange) {
      onChange(labelInValue ? null : undefined, null);
    }
  };

  const handleKeyDown = (e) => {
    if (disabled) return;

    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleSelect(filteredOptions[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setSearchValue("");
        setHighlightedIndex(-1);
        break;
      case "ArrowDown":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex((prev) => {
            const nextIndex = prev + 1;
            // Skip disabled options
            let newIndex = nextIndex;
            while (newIndex < filteredOptions.length && filteredOptions[newIndex]?.disabled) {
              newIndex++;
            }
            return newIndex < filteredOptions.length ? newIndex : prev;
          });
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (isOpen) {
          setHighlightedIndex((prev) => {
            const nextIndex = prev - 1;
            // Skip disabled options
            let newIndex = nextIndex;
            while (newIndex >= 0 && filteredOptions[newIndex]?.disabled) {
              newIndex--;
            }
            return newIndex >= 0 ? newIndex : prev;
          });
        }
        break;
      default:
        break;
    }
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const displayValue = selectedOption
    ? optionLabelProp === "label"
      ? selectedOption.label
      : selectedOption.value
    : null;

  const hasValue = displayValue !== null && displayValue !== undefined;
  const showClearButton = allowClear && hasValue && !disabled && isHovered;

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: "relative", width: "100%" }}
    >
      {/* Trigger */}
      <div
        style={getContainerStyle()}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-disabled={disabled}
      >
        {/* Value or Placeholder */}
        <span
          style={{
            flex: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            color: hasValue ? "#4B465C" : "#bfbfbf",
            lineHeight: "1.5",
          }}
        >
          {hasValue ? displayValue : placeholder}
        </span>

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
              width: "14px",
              height: "14px",
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = "#8c8c8c")}
            onMouseOut={(e) => (e.currentTarget.style.color = "#bfbfbf")}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="6" fill="currentColor" />
              <path d="M4.5 4.5L9.5 9.5M9.5 4.5L4.5 9.5" stroke="white" strokeWidth="1.25" strokeLinecap="round" />
            </svg>
          </span>
        )}

        {/* Loading Spinner or Chevron */}
        {loading ? (
          <span
            style={{
              width: currentSize.iconSize,
              height: currentSize.iconSize,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              style={{
                animation: "nxDropdownSpin 1s linear infinite",
              }}
            >
              <circle
                cx="8"
                cy="8"
                r="6"
                stroke="#bfbfbf"
                strokeWidth="2"
                fill="none"
                strokeDasharray="28"
                strokeDashoffset="8"
                strokeLinecap="round"
              />
            </svg>
          </span>
        ) : (
          <span
            style={{
              color: "#bfbfbf",
              display: "flex",
              flexShrink: 0,
              width: currentSize.iconSize,
              height: currentSize.iconSize,
              transition: "color 0.2s",
            }}
          >
            <ChevronDownIcon isOpen={isOpen} />
          </span>
        )}
      </div>

      {/* Dropdown Menu */}
      <div ref={dropdownRef} style={getDropdownStyle()} role="listbox">
        {/* Search Input */}
        {showSearch && (
          <div style={{ padding: "8px 12px", borderBottom: "1px solid #f0f0f0" }}>
            <input
              ref={searchInputRef}
              type="text"
              value={searchValue}
              onChange={handleSearchChange}
              placeholder="Search..."
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                padding: "4px 8px",
                fontSize: currentSize.fontSize,
                border: "1px solid #dbdade",
                borderRadius: "4px",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#40a9ff")}
              onBlur={(e) => (e.target.style.borderColor = "#dbdade")}
            />
          </div>
        )}

        {/* Options */}
        {filteredOptions.length > 0 ? (
          filteredOptions.map((opt, index) => (
            <div
              key={opt.value}
              style={getOptionStyle(opt, index)}
              onClick={() => handleSelect(opt)}
              onMouseEnter={() => !opt.disabled && setHighlightedIndex(index)}
              role="option"
              aria-selected={opt.value === value}
              aria-disabled={opt.disabled}
            >
              <span
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {opt.label}
              </span>
              {opt.value === value && (
                <span style={{ color: "#1890ff", flexShrink: 0 }}>
                  <CheckIcon />
                </span>
              )}
            </div>
          ))
        ) : (
          <div
            style={{
              padding: currentSize.optionPadding,
              color: "#bfbfbf",
              textAlign: "center",
              fontSize: currentSize.fontSize,
            }}
          >
            {notFoundContent}
          </div>
        )}
      </div>

      {/* Keyframe animation for loading spinner */}
      <style>
        {`
          @keyframes nxDropdownSpin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default NxDropdownBase;
