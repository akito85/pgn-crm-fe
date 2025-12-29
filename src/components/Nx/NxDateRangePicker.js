import React, { useState, useRef, useEffect } from "react";

// Arrow separator icon
const ArrowIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3.75 9H14.25"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.25 6L14.25 9"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Calendar icon
const CalendarIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="1.5"
      y="2.5"
      width="11"
      height="10"
      rx="1.5"
      stroke="currentColor"
      strokeWidth="1.25"
    />
    <line
      x1="1.5"
      y1="5.5"
      x2="12.5"
      y2="5.5"
      stroke="currentColor"
      strokeWidth="1.25"
    />
    <line
      x1="4.5"
      y1="1"
      x2="4.5"
      y2="3.5"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
    />
    <line
      x1="9.5"
      y1="1"
      x2="9.5"
      y2="3.5"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
    />
  </svg>
);

// Chevron icons
const ChevronLeft = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 12L6 8L10 4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChevronRight = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6 12L10 8L6 4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Double chevrons for year navigation
const DoubleChevronLeft = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8 12L4 8L8 4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 12L8 8L12 4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const DoubleChevronRight = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4 12L8 8L4 4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 12L12 8L8 4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const MONTHS_FULL = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const formatDate = (date, format = "DD MMM YYYY") => {
  if (!date) return "";

  const day = String(date.getDate()).padStart(2, "0");
  const month = MONTHS[date.getMonth()];
  const year = date.getFullYear();

  if (format === "DD MMM YYYY") {
    return `${day} ${month} ${year}`;
  }
  return `${day} ${month} ${year}`;
};

const isSameDay = (d1, d2) => {
  if (!d1 || !d2) return false;
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

const isInRange = (date, start, end) => {
  if (!start || !end) return false;
  const time = date.getTime();
  return time > start.getTime() && time < end.getTime();
};

const NxDateRangePicker = ({
  value = [null, null],
  onChange = () => {},
  startPlaceholder = "Start date",
  endPlaceholder = "End date",
  disabled = false,
  disabledDate,
  size = "middle",
  className = "",
  style = {},
  allowClear = true,
  displayFormat = "DD MMM YYYY",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectionMode, setSelectionMode] = useState(null); // 'start' | 'end' | null
  const [startDate, setStartDate] = useState(value[0]);
  const [endDate, setEndDate] = useState(value[1]);
  const [viewDate, setViewDate] = useState(new Date());
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredDate, setHoveredDate] = useState(null);
  const containerRef = useRef(null);

  // Sync with external value
  useEffect(() => {
    setStartDate(value[0]);
    setEndDate(value[1]);
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setSelectionMode(null);
        setHoveredDate(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Size configurations matching NxDatePicker
  const sizeConfig = {
    small: {
      height: "28px",
      fontSize: "13px",
      padding: "2px 8px",
      iconSize: "12px",
    },
    middle: {
      height: "32px",
      fontSize: "14px",
      padding: "4px 12px",
      iconSize: "14px",
    },
    large: {
      height: "40px",
      fontSize: "15px",
      padding: "6px 14px",
      iconSize: "16px",
    },
  };

  const currentSize = sizeConfig[size] || sizeConfig.middle;

  const getInputStyle = () => {
    let baseStyle = {
      display: "flex",
      alignItems: "center",
      gap: "8px",
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
    };

    if (isHovered && !disabled) {
      baseStyle.borderColor = "#40a9ff";
      baseStyle.boxShadow = "0 2px 4px 0 rgba(64, 169, 255, 0.1)";
    }

    if (isOpen && !disabled) {
      baseStyle.borderColor = "#40a9ff";
      baseStyle.boxShadow = "0 0 0 2px rgba(24, 144, 255, 0.1)";
    }

    return baseStyle;
  };

  const handleStartClick = (e) => {
    e.stopPropagation();
    if (disabled) return;
    setIsOpen(true);
    setSelectionMode("start");
    if (startDate) setViewDate(new Date(startDate));
  };

  const handleEndClick = (e) => {
    e.stopPropagation();
    if (disabled) return;
    setIsOpen(true);
    setSelectionMode("end");
    if (endDate) setViewDate(new Date(endDate));
    else if (startDate) setViewDate(new Date(startDate));
  };

  const handleDateSelect = (date) => {
    if (disabledDate && disabledDate(date)) return;

    if (selectionMode === "start") {
      const newEndDate = endDate && date > endDate ? null : endDate;
      setStartDate(date);
      if (newEndDate !== endDate) setEndDate(newEndDate);
      setSelectionMode("end");
      onChange([date, newEndDate]);
    } else if (selectionMode === "end") {
      if (startDate && date < startDate) {
        // Swap if end is before start
        setEndDate(startDate);
        setStartDate(date);
        onChange([date, startDate]);
      } else {
        setEndDate(date);
        onChange([startDate, date]);
      }
      setIsOpen(false);
      setSelectionMode(null);
      setHoveredDate(null);
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setStartDate(null);
    setEndDate(null);
    onChange([null, null]);
  };

  const getDaysInMonth = (year, month) =>
    new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) =>
    new Date(year, month, 1).getDay();

  const prevYear = () =>
    setViewDate(new Date(viewDate.getFullYear() - 1, viewDate.getMonth(), 1));
  const nextYear = () =>
    setViewDate(new Date(viewDate.getFullYear() + 1, viewDate.getMonth(), 1));
  const prevMonth = () =>
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const nextMonth = () =>
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));

  const renderCalendar = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const today = new Date();

    const days = [];

    // Previous month days
    const prevMonthDays = getDaysInMonth(year, month - 1);
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      const date = new Date(year, month - 1, day);
      days.push(
        <div
          key={`prev-${day}`}
          style={{
            height: "28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px",
            color: "#bfbfbf",
          }}
        >
          {day}
        </div>
      );
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isStart = isSameDay(date, startDate);
      const isEnd = isSameDay(date, endDate);
      const isToday = isSameDay(date, today);
      const isDisabled = disabledDate && disabledDate(date);

      // Determine if in range (including hover preview)
      let inRange = isInRange(date, startDate, endDate);
      if (
        selectionMode === "end" &&
        startDate &&
        hoveredDate &&
        !endDate
      ) {
        const hoverEnd = hoveredDate > startDate ? hoveredDate : startDate;
        const hoverStart = hoveredDate > startDate ? startDate : hoveredDate;
        inRange = isInRange(date, hoverStart, hoverEnd);
      }

      const isRangeStart = isStart && endDate;
      const isRangeEnd = isEnd && startDate;

      let dayStyle = {
        height: "28px",
        width: "28px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "14px",
        cursor: isDisabled ? "not-allowed" : "pointer",
        borderRadius: "4px",
        transition: "all 0.2s",
        color: isDisabled ? "#bfbfbf" : "#000000d9",
        opacity: isDisabled ? 0.5 : 1,
        position: "relative",
        outline: "none",
        border: "none",
      };

      if (isStart || isEnd) {
        dayStyle.backgroundColor = "#1890ff";
        dayStyle.color = "#fff";
        dayStyle.fontWeight = 500;
      } else if (inRange) {
        dayStyle.backgroundColor = "#e6f7ff";
      } else if (isToday) {
        dayStyle.border = "1px solid #1890ff";
      }

      days.push(
        <div
          key={day}
          style={dayStyle}
          onClick={() => !isDisabled && handleDateSelect(date)}
          onMouseEnter={() => !isDisabled && setHoveredDate(date)}
          onMouseLeave={() => setHoveredDate(null)}
          onMouseOver={(e) => {
            if (!isDisabled && !isStart && !isEnd && !inRange) {
              e.currentTarget.style.backgroundColor = "#f5f5f5";
            }
          }}
          onMouseOut={(e) => {
            if (!isDisabled && !isStart && !isEnd && !inRange) {
              e.currentTarget.style.backgroundColor = "transparent";
            }
          }}
        >
          {day}
        </div>
      );
    }

    // Next month days
    const remainingCells = 42 - days.length;
    for (let day = 1; day <= remainingCells; day++) {
      days.push(
        <div
          key={`next-${day}`}
          style={{
            height: "28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px",
            color: "#bfbfbf",
          }}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  const showClearButton = allowClear && (startDate || endDate) && isHovered;

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: "relative", width: "100%", ...style }}
    >
      {/* Input */}
      <div
        style={getInputStyle()}
        onMouseEnter={() => !disabled && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => !disabled && !isOpen && handleStartClick({ stopPropagation: () => {} })}
      >
        {/* Start date */}
        <span
          onClick={handleStartClick}
          style={{
            flex: 1,
            color: startDate ? "#000000d9" : "#bfbfbf",
            padding: "0 4px",
            borderRadius: "4px",
            backgroundColor:
              selectionMode === "start" ? "#e6f7ff" : "transparent",
            transition: "background-color 0.2s",
          }}
        >
          {startDate ? formatDate(startDate, displayFormat) : startPlaceholder}
        </span>

        {/* Arrow separator */}
        <span style={{ color: "#bfbfbf", display: "flex", flexShrink: 0 }}>
          <ArrowIcon />
        </span>

        {/* End date */}
        <span
          onClick={handleEndClick}
          style={{
            flex: 1,
            color: endDate ? "#000000d9" : "#bfbfbf",
            padding: "0 4px",
            borderRadius: "4px",
            backgroundColor:
              selectionMode === "end" ? "#e6f7ff" : "transparent",
            transition: "background-color 0.2s",
          }}
        >
          {endDate ? formatDate(endDate, displayFormat) : endPlaceholder}
        </span>

        {/* Clear / Calendar icon */}
        {showClearButton ? (
          <span
            onClick={handleClear}
            style={{
              color: "#bfbfbf",
              display: "flex",
              cursor: "pointer",
              flexShrink: 0,
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = "#8c8c8c")}
            onMouseOut={(e) => (e.currentTarget.style.color = "#bfbfbf")}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="7"
                cy="7"
                r="6"
                fill="currentColor"
                fillOpacity="0.3"
              />
              <path
                d="M4.5 4.5L9.5 9.5M9.5 4.5L4.5 9.5"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
              />
            </svg>
          </span>
        ) : (
          <span style={{ color: "#bfbfbf", display: "flex", flexShrink: 0 }}>
            <CalendarIcon />
          </span>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: selectionMode === "end" ? "auto" : 0,
            right: selectionMode === "end" ? 0 : "auto",
            zIndex: 1060,
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow:
              "0 3px 6px -4px rgba(0,0,0,0.12), 0 6px 16px 0 rgba(0,0,0,0.08), 0 9px 28px 8px rgba(0,0,0,0.05)",
            padding: "12px",
            minWidth: "280px",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "12px",
              padding: "0 4px",
            }}
          >
            {/* Left navigation */}
            <div style={{ display: "flex", gap: "4px" }}>
              <button
                onClick={prevYear}
                style={{
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  padding: "4px",
                  borderRadius: "4px",
                  display: "flex",
                  color: "#00000073",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f5f5f5")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <DoubleChevronLeft />
              </button>
              <button
                onClick={prevMonth}
                style={{
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  padding: "4px",
                  borderRadius: "4px",
                  display: "flex",
                  color: "#00000073",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f5f5f5")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <ChevronLeft />
              </button>
            </div>

            {/* Month/Year */}
            <span style={{ fontWeight: 500, fontSize: "14px", color: "#000000d9" }}>
              {MONTHS_FULL[viewDate.getMonth()]} {viewDate.getFullYear()}
            </span>

            {/* Right navigation */}
            <div style={{ display: "flex", gap: "4px" }}>
              <button
                onClick={nextMonth}
                style={{
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  padding: "4px",
                  borderRadius: "4px",
                  display: "flex",
                  color: "#00000073",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f5f5f5")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <ChevronRight />
              </button>
              <button
                onClick={nextYear}
                style={{
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  padding: "4px",
                  borderRadius: "4px",
                  display: "flex",
                  color: "#00000073",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f5f5f5")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <DoubleChevronRight />
              </button>
            </div>
          </div>

          {/* Selection indicator */}
          <div
            style={{
              textAlign: "center",
              fontSize: "12px",
              color: "#8c8c8c",
              marginBottom: "8px",
            }}
          >
            {selectionMode === "start"
              ? "Select start date"
              : "Select end date"}
          </div>

          {/* Weekday headers */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: "4px",
              marginBottom: "4px",
            }}
          >
            {DAYS.map((day) => (
              <div
                key={day}
                style={{
                  height: "28px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  fontWeight: 500,
                  color: "#8c8c8c",
                }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: "4px",
            }}
          >
            {renderCalendar()}
          </div>

          {/* Footer */}
          <div
            style={{
              marginTop: "12px",
              paddingTop: "12px",
              borderTop: "1px solid #f0f0f0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <button
              onClick={() => {
                const today = new Date();
                setViewDate(today);
              }}
              style={{
                border: "none",
                background: "none",
                cursor: "pointer",
                fontSize: "13px",
                color: "#1890ff",
                padding: "4px 8px",
                borderRadius: "4px",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#e6f7ff")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              Today
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                setSelectionMode(null);
                setHoveredDate(null);
              }}
              style={{
                border: "1px solid #dbdade",
                background: "#fff",
                cursor: "pointer",
                fontSize: "13px",
                color: "#000000d9",
                padding: "4px 12px",
                borderRadius: "4px",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = "#40a9ff";
                e.currentTarget.style.color = "#40a9ff";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = "#dbdade";
                e.currentTarget.style.color = "#000000d9";
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Static utility methods
NxDateRangePicker.formatDate = (dateInput, formatString = "DD MMM YYYY") => {
  if (!dateInput) return "-";

  try {
    let date;

    if (dateInput instanceof Date) {
      date = dateInput;
    } else if (typeof dateInput === "string") {
      date = new Date(dateInput);
    } else {
      return "-";
    }

    if (isNaN(date.getTime())) return "-";

    return formatDate(date, formatString);
  } catch (error) {
    console.error("Date formatting error:", error);
    return "-";
  }
};

NxDateRangePicker.formatForAPI = (dateInput, includeTime = false) => {
  if (!dateInput) return null;

  try {
    let date;

    if (dateInput instanceof Date) {
      date = dateInput;
    } else if (typeof dateInput === "string") {
      date = new Date(dateInput);
    } else {
      return null;
    }

    if (isNaN(date.getTime())) return null;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    if (includeTime) {
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    } else {
      return `${year}-${month}-${day}`;
    }
  } catch (error) {
    console.error("Date formatting error:", error);
    return null;
  }
};

export default NxDateRangePicker;
