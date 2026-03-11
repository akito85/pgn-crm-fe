import { DatePicker } from "antd";
import React from "react";

const NxDate = ({
  picker = "date",
  label,
  onChange = () => {},
  mandatory,
  value,
  dateDisable,
  disabled = false,
  placeholder = "Select date",
  defaultPickerValue,
  displayFormat = "DD MMM YYYY",
  size = "middle",
  className = "",
  showTime = false,
  allowClear = true,
  showToday = true,
  style = {},
  ...restProps
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);

  const wrapper = "flex flex-col";

  const sizeConfig = {
    small: {
      padding: "2px 8px",
      fontSize: "13px",
      height: "28px",
    },
    middle: {
      padding: "4px 12px",
      fontSize: "14px",
      height: "32px",
    },
    large: {
      padding: "6px 14px",
      fontSize: "15px",
      height: "40px",
    },
  };

  const currentSize = sizeConfig[size] || sizeConfig.middle;

  const getBaseStyle = () => {
    let baseStyle = {
      width: "100%",
      borderRadius: "6px",
      border: "1px solid #d9d9d9",
      boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      transition: "all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)",
      fontSize: currentSize.fontSize,
      ...style,
    };

    if (isHovered && !disabled) {
      baseStyle = {
        ...baseStyle,
        borderColor: "#40a9ff",
        boxShadow: "0 2px 4px 0 rgba(64, 169, 255, 0.1)",
      };
    }

    if (isFocused && !disabled) {
      baseStyle = {
        ...baseStyle,
        borderColor: "#40a9ff",
        boxShadow: "0 0 0 2px rgba(24, 144, 255, 0.1)",
        outline: "none",
      };
    }

    if (disabled) {
      baseStyle = {
        ...baseStyle,
        backgroundColor: "#f5f5f5",
        cursor: "not-allowed",
        opacity: 0.6,
        borderColor: "#d9d9d9",
      };
    }

    return baseStyle;
  };

  const disabledDate = (current) => {
    if (!current) return false;

    if (dateDisable) {
      return dateDisable(current);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return current.toDate() < today;
  };

  const handleChange = (date, dateString) => {
    if (onChange) {
      onChange(date, dateString);
    }
  };

  const getDisplayFormat = () => {
    if (displayFormat) return displayFormat;

    switch (picker) {
      case "year":
        return "YYYY";
      case "month":
        return "MMM YYYY";
      case "quarter":
        return "[Q]Q YYYY";
      case "week":
        return "wo YYYY";
      case "time":
        return "HH:mm:ss";
      default:
        return showTime ? "DD MMM YYYY HH:mm" : "DD MMM YYYY";
    }
  };

  const handleMouseEnter = () => {
    if (!disabled) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleFocus = () => {
    if (!disabled) {
      setIsFocused(true);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div className={wrapper}>
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ position: "relative" }}
      >
        <DatePicker
          picker={picker}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          value={value}
          disabledDate={disabledDate}
          disabled={disabled}
          style={getBaseStyle()}
          placeholder={placeholder}
          allowClear={allowClear}
          format={getDisplayFormat()}
          defaultPickerValue={defaultPickerValue}
          showTime={showTime}
          showToday={showToday}
          size={size}
          className={className}
          {...restProps}
        />
      </div>
    </div>
  );
};

// Static utility methods for formatting
NxDate.formatDate = (dateInput, formatString = "DD MMM YYYY HH:mm:ss") => {
  if (!dateInput) return "-";
  
  try {
    let date;
    
    // Handle moment object (from Ant Design DatePicker)
    if (dateInput && typeof dateInput === 'object' && dateInput._isAMomentObject) {
      date = dateInput.toDate();
    } 
    // Handle Date object
    else if (dateInput instanceof Date) {
      date = dateInput;
    }
    // Handle string
    else if (typeof dateInput === 'string') {
      date = new Date(dateInput);
    }
    else {
      return "-";
    }
    
    // Check if date is valid
    if (isNaN(date.getTime())) return "-";
    
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    const day = String(date.getDate()).padStart(2, "0");
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    
    // Support different format strings
    if (formatString === "DD MMM YYYY") {
      return `${day} ${month} ${year}`;
    } else if (formatString === "DD MMM YYYY HH:mm") {
      return `${day} ${month} ${year} ${hours}:${minutes}`;
    } else {
      // Default with seconds
      return `${day} ${month} ${year} ${hours}:${minutes}:${seconds}`;
    }
  } catch (error) {
    console.error("Date formatting error:", error);
    return "-";
  }
};

// Format for Oracle DB/API
NxDate.formatForAPI = (dateInput, includeTime = true) => {
  if (!dateInput) return null;
  
  try {
    let date;
    
    // Handle moment object (from Ant Design DatePicker)
    if (dateInput && typeof dateInput === 'object' && dateInput._isAMomentObject) {
      date = dateInput.toDate();
    }
    // Handle Date object
    else if (dateInput instanceof Date) {
      date = dateInput;
    }
    // Handle string
    else if (typeof dateInput === 'string') {
      date = new Date(dateInput);
    }
    else {
      return null;
    }
    
    // Check if date is valid
    if (isNaN(date.getTime())) return null;
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    
    if (includeTime) {
      // Oracle TIMESTAMP format: YYYY-MM-DD HH:mm:ss
      return date.toISOString().split('.')[0];
    } else {
      // Oracle DATE format: YYYY-MM-DD
      return `${year}-${month}-${day}`;
    }
  } catch (error) {
    console.error("Date formatting error:", error);
    return null;
  }
};

export default NxDate;
