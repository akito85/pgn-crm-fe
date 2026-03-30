import { DatePicker } from "antd";
import React, { useEffect, useRef, useState } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

const DT_MONTHS_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DT_MONTHS_FULL  = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DT_DAYS         = ["Su","Mo","Tu","We","Th","Fr","Sa"];
const DT_ITEM_H       = 28;

// ─── Micro SVG icons ──────────────────────────────────────────────────────────

const DtChevL  = () => <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M8 10L4 6.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const DtChevR  = () => <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M5 10L9 6.5L5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const DtDblL   = () => <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M7 10L3 6.5L7 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 10L6 6.5L10 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const DtDblR   = () => <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M3 10L7 6.5L3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 10L10 6.5L6 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const DtCalIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1.5" y="2.5" width="11" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.25"/><line x1="1.5" y1="5.5" x2="12.5" y2="5.5" stroke="currentColor" strokeWidth="1.25"/><line x1="4.5" y1="1" x2="4.5" y2="3.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/><line x1="9.5" y1="1" x2="9.5" y2="3.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/></svg>;
const DtClrIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" fill="currentColor" fillOpacity="0.3"/><path d="M4.5 4.5L9.5 9.5M9.5 4.5L4.5 9.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/></svg>;

// ─── TimeColumn ───────────────────────────────────────────────────────────────

const TimeColumn = ({ max, value, onChange, label }) => {
  const colRef = useRef(null);

  useEffect(() => {
    if (colRef.current) {
      colRef.current.scrollTop = Math.max(0, (value - 2) * DT_ITEM_H);
    }
  }, [value]);

  useEffect(() => {
    const el = colRef.current;
    if (!el) return;
    const handler = (e) => {
      e.preventDefault();
      onChange(Math.max(0, Math.min(max, value + (e.deltaY > 0 ? 1 : -1))));
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, [max, value, onChange]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 38 }}>
      <div style={{ fontSize: 10, fontWeight: 600, color: "#aaa", marginBottom: 5, letterSpacing: "0.05em" }}>
        {label}
      </div>
      <div
        ref={colRef}
        style={{ height: DT_ITEM_H * 5, overflowY: "hidden", scrollBehavior: "smooth", borderRadius: 6, background: "#f8fafc" }}
      >
        {Array.from({ length: max + 1 }, (_, i) => (
          <div
            key={i}
            onClick={() => onChange(i)}
            style={{
              height: DT_ITEM_H, width: 34,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", borderRadius: 4,
              background: i === value ? "#1976D2" : "transparent",
              color: i === value ? "#fff" : "#555",
              fontWeight: i === value ? 600 : 400,
              fontSize: 13, transition: "background 0.1s",
            }}
            onMouseOver={(e) => { if (i !== value) e.currentTarget.style.background = "#e3f0fb"; }}
            onMouseOut={(e) => { if (i !== value) e.currentTarget.style.background = "transparent"; }}
          >
            {String(i).padStart(2, "0")}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Calendar helpers ─────────────────────────────────────────────────────────

const dtDaysInMonth  = (yr, mo) => new Date(yr, mo + 1, 0).getDate();
const dtFirstDay     = (yr, mo) => new Date(yr, mo, 1).getDay();

// ─── NxDateTimeCustom ─────────────────────────────────────────────────────────
// Renders when showTime={true}. value/onChange use plain ISO strings. No moment/dayjs.

const NxDateTimeCustom = ({
  value, onChange = () => {}, disabled = false,
  placeholder = "Select date & time",
  allowClear = true, dateDisable,
  size = "middle", style = {}, className = "",
}) => {
  const parseISO = (v) => {
    if (!v) return null;
    const d = new Date(v);
    return isNaN(d.getTime()) ? null : d;
  };

  const init = parseISO(value);

  const [isOpen,    setIsOpen]    = useState(false);
  const [isHov,     setIsHov]     = useState(false);
  const [viewYear,  setViewYear]  = useState(() => init ? init.getFullYear()  : new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(() => init ? init.getMonth()     : new Date().getMonth());
  const [selDay,    setSelDay]    = useState(() => init ? init.getDate()       : null);
  const [selMonth,  setSelMonth]  = useState(() => init ? init.getMonth()      : null);
  const [selYear,   setSelYear]   = useState(() => init ? init.getFullYear()   : null);
  const [hrs,       setHrs]       = useState(() => init ? init.getHours()      : 0);
  const [mins,      setMins]      = useState(() => init ? init.getMinutes()    : 0);
  const [secs,      setSecs]      = useState(() => init ? init.getSeconds()    : 0);
  const containerRef = useRef(null);

  // Sync controlled value
  useEffect(() => {
    const d = parseISO(value);
    if (d) {
      setViewYear(d.getFullYear()); setViewMonth(d.getMonth());
      setSelYear(d.getFullYear());  setSelMonth(d.getMonth()); setSelDay(d.getDate());
      setHrs(d.getHours()); setMins(d.getMinutes()); setSecs(d.getSeconds());
    } else {
      setSelDay(null); setSelMonth(null); setSelYear(null);
      setHrs(0); setMins(0); setSecs(0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const hasValue = selDay !== null;

  const fmtDisplay = () => {
    if (!hasValue) return "";
    const d = new Date(selYear, selMonth, selDay, hrs, mins, secs, 0);
    const dd = String(d.getDate()).padStart(2,"0");
    const mo = DT_MONTHS_SHORT[d.getMonth()];
    const hh = String(d.getHours()).padStart(2,"0");
    const mm = String(d.getMinutes()).padStart(2,"0");
    const ss = String(d.getSeconds()).padStart(2,"0");
    const ms = String(d.getMilliseconds()).padStart(3,"0");
    return `${dd}-${mo}-${d.getFullYear()} ${hh}:${mm}:${ss}.${ms}`;
  };

  const emit = (yr, mo, day, h, m, s) => onChange(new Date(yr, mo, day, h, m, s, 0).toISOString());

  const defaultDisabledDate = (date) => {
    const today = new Date(); today.setHours(0,0,0,0);
    return date < today;
  };
  const isDateDisabled = dateDisable !== undefined ? (dateDisable || (() => false)) : defaultDisabledDate;

  const handleDayClick = (day) => {
    const date = new Date(viewYear, viewMonth, day);
    if (isDateDisabled(date)) return;
    setSelDay(day); setSelMonth(viewMonth); setSelYear(viewYear);
    emit(viewYear, viewMonth, day, hrs, mins, secs);
  };

  const handleNow = () => {
    const now = new Date();
    setViewYear(now.getFullYear()); setViewMonth(now.getMonth());
    setSelDay(now.getDate()); setSelMonth(now.getMonth()); setSelYear(now.getFullYear());
    setHrs(now.getHours()); setMins(now.getMinutes()); setSecs(now.getSeconds());
    onChange(new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds(), 0).toISOString());
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setSelDay(null); setSelMonth(null); setSelYear(null);
    setHrs(0); setMins(0); setSecs(0);
    onChange(null);
  };

  const prevYear  = () => setViewYear(y  => y - 1);
  const nextYear  = () => setViewYear(y  => y + 1);
  const prevMonth = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y-1); } else setViewMonth(m => m-1); };
  const nextMonth = () => { if (viewMonth === 11) { setViewMonth(0);  setViewYear(y => y+1); } else setViewMonth(m => m+1); };

  const navBtn = (onClick, Icon) => (
    <button onClick={onClick} style={{ border:"none", background:"none", cursor:"pointer", padding:4, borderRadius:4, display:"flex", color:"#888" }}
      onMouseOver={(e) => (e.currentTarget.style.background = "#f0f0f0")}
      onMouseOut={(e)  => (e.currentTarget.style.background = "none")}>
      <Icon />
    </button>
  );

  const renderDays = () => {
    const dim   = dtDaysInMonth(viewYear, viewMonth);
    const first = dtFirstDay(viewYear, viewMonth);
    const today = new Date();
    const prevDim = dtDaysInMonth(viewYear, viewMonth === 0 ? 11 : viewMonth - 1);
    const cells = [];

    for (let i = first - 1; i >= 0; i--) {
      cells.push(<div key={`p${i}`} style={{ height:28, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, color:"#ccc" }}>{prevDim - i}</div>);
    }
    for (let day = 1; day <= dim; day++) {
      const date = new Date(viewYear, viewMonth, day);
      const isSel  = day === selDay && viewMonth === selMonth && viewYear === selYear;
      const isToday = day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
      const isDis  = isDateDisabled(date);
      cells.push(
        <div key={day} onClick={() => !isDis && handleDayClick(day)}
          style={{ height:28, width:28, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, borderRadius:4,
            cursor: isDis ? "not-allowed" : "pointer",
            background: isSel ? "#1976D2" : "transparent",
            color: isDis ? "#ccc" : isSel ? "#fff" : "#333",
            fontWeight: isSel ? 600 : 400,
            border: isToday && !isSel ? "1.5px solid #1976D2" : "none",
            opacity: isDis ? 0.45 : 1, transition:"background 0.12s",
          }}
          onMouseOver={(e) => { if (!isDis && !isSel) e.currentTarget.style.background = "#e3f0fb"; }}
          onMouseOut={(e)  => { if (!isDis && !isSel) e.currentTarget.style.background = "transparent"; }}
        >{day}</div>
      );
    }
    const rem = 42 - cells.length;
    for (let d = 1; d <= rem; d++) {
      cells.push(<div key={`n${d}`} style={{ height:28, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, color:"#ccc" }}>{d}</div>);
    }
    return cells;
  };

  const szMap = { small:{ h:"28px", fs:"13px", p:"2px 8px" }, middle:{ h:"32px", fs:"14px", p:"4px 12px" }, large:{ h:"40px", fs:"15px", p:"6px 14px" } };
  const sz = szMap[size] || szMap.middle;

  return (
    <div ref={containerRef} className={className} style={{ position:"relative", width:"100%", ...style }}>
      {/* Trigger input */}
      <div
        onClick={() => !disabled && setIsOpen(o => !o)}
        onMouseEnter={() => !disabled && setIsHov(true)}
        onMouseLeave={() => setIsHov(false)}
        style={{
          display:"flex", alignItems:"center", gap:8, width:"100%",
          height:sz.h, padding:sz.p, fontSize:sz.fs, borderRadius:6,
          border:`1px solid ${isOpen ? "#40a9ff" : isHov && !disabled ? "#40a9ff" : "#d9d9d9"}`,
          background: disabled ? "#f5f5f5" : "#fff",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.6 : 1,
          boxShadow: isOpen ? "0 0 0 2px rgba(24,144,255,0.1)" : "0 1px 2px 0 rgb(0 0 0 / 0.05)",
          transition:"all 0.3s ease", userSelect:"none",
        }}
      >
        <span style={{ flex:1, color: hasValue ? "#000000d9" : "#bfbfbf", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
          {hasValue ? fmtDisplay() : placeholder}
        </span>
        {allowClear && hasValue && isHov && !disabled
          ? <span onClick={handleClear} style={{ color:"#bfbfbf", cursor:"pointer", display:"flex", flexShrink:0 }}><DtClrIcon /></span>
          : <span style={{ color:"#bfbfbf", display:"flex", flexShrink:0 }}><DtCalIcon /></span>
        }
      </div>

      {/* Dropdown */}
      {isOpen && !disabled && (
        <div style={{
          position:"absolute", top:"calc(100% + 4px)", left:0, zIndex:1060,
          background:"#fff", borderRadius:10, border:"1px solid #f0f0f0",
          boxShadow:"0 4px 16px rgba(0,0,0,0.12)", display:"flex", overflow:"hidden",
        }}>
          {/* Calendar panel */}
          <div style={{ padding:"14px 14px 10px", minWidth:272 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
              <div style={{ display:"flex", gap:2 }}>
                {navBtn(prevYear, DtDblL)}
                {navBtn(prevMonth, DtChevL)}
              </div>
              <span style={{ fontWeight:600, fontSize:13, color:"#1a1a1a" }}>
                {DT_MONTHS_FULL[viewMonth]} {viewYear}
              </span>
              <div style={{ display:"flex", gap:2 }}>
                {navBtn(nextMonth, DtChevR)}
                {navBtn(nextYear, DtDblR)}
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2, marginBottom:4 }}>
              {DT_DAYS.map(d => (
                <div key={d} style={{ height:24, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:600, color:"#aaa" }}>
                  {d}
                </div>
              ))}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2 }}>
              {renderDays()}
            </div>
            <div style={{ marginTop:10, paddingTop:10, borderTop:"1px solid #f5f5f5" }}>
              <button
                onClick={() => {
                  const now = new Date();
                  setViewYear(now.getFullYear());
                  setViewMonth(now.getMonth());
                }}
                style={{ border:"none", background:"none", cursor:"pointer", fontSize:12, color:"#1976D2", padding:"3px 6px", borderRadius:4 }}
                onMouseOver={(e) => (e.currentTarget.style.background = "#e3f0fb")}
                onMouseOut={(e)  => (e.currentTarget.style.background = "none")}>
                Today
              </button>
            </div>
          </div>

          {/* Divider */}
          <div style={{ width:1, background:"#f0f0f0", margin:"10px 0" }} />

          {/* Time panel */}
          <div style={{ padding:"14px 14px 10px", display:"flex", flexDirection:"column" }}>
            <div style={{ fontSize:11, fontWeight:600, color:"#aaa", textAlign:"center", marginBottom:10, letterSpacing:"0.05em", textTransform:"uppercase" }}>
              Time
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:5 }}>
              <TimeColumn max={23} value={hrs}  onChange={(h) => { setHrs(h);  if (hasValue) emit(selYear, selMonth, selDay, h, mins, secs); }} label="HH" />
              <span style={{ color:"#ccc", fontWeight:700, fontSize:18, paddingBottom: DT_ITEM_H / 2 }}>:</span>
              <TimeColumn max={59} value={mins} onChange={(m) => { setMins(m); if (hasValue) emit(selYear, selMonth, selDay, hrs, m, secs); }} label="MM" />
              <span style={{ color:"#ccc", fontWeight:700, fontSize:18, paddingBottom: DT_ITEM_H / 2 }}>:</span>
              <TimeColumn max={59} value={secs} onChange={(s) => { setSecs(s); if (hasValue) emit(selYear, selMonth, selDay, hrs, mins, s); }} label="SS" />
            </div>
            <div style={{ marginTop:10, display:"flex", gap:6 }}>
              <button onClick={handleNow}
                style={{ flex:1, fontSize:12, color:"#1976D2", border:"1px solid #c5dcf5", background:"#f0f7ff", cursor:"pointer", borderRadius:5, padding:"5px 0" }}
                onMouseOver={(e) => (e.currentTarget.style.background = "#daeeff")}
                onMouseOut={(e)  => (e.currentTarget.style.background = "#f0f7ff")}>
                Now
              </button>
              <button onClick={() => setIsOpen(false)}
                style={{ flex:1, fontSize:12, color:"#fff", background:"#1976D2", border:"none", cursor:"pointer", borderRadius:5, padding:"5px 0", fontWeight:600 }}
                onMouseOver={(e) => (e.currentTarget.style.background = "#1565C0")}
                onMouseOut={(e)  => (e.currentTarget.style.background = "#1976D2")}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── NxDatePickerOriginal ─────────────────────────────────────────────────────
// Original Ant Design DatePicker wrapper. Extracted to avoid React hooks ordering
// issues caused by the early-return in NxDate when showTime=true.

const NxDatePickerOriginal = ({
  picker = "date", onChange = () => {}, value, dateDisable,
  disabled = false, placeholder = "Select date", defaultPickerValue,
  displayFormat = "DD MMM YYYY", size = "middle", className = "",
  allowClear = true, showToday = true, style = {}, ...restProps
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const sizeConfig = {
    small:  { padding:"2px 8px",   fontSize:"13px", height:"28px" },
    middle: { padding:"4px 12px",  fontSize:"14px", height:"32px" },
    large:  { padding:"6px 14px",  fontSize:"15px", height:"40px" },
  };
  const currentSize = sizeConfig[size] || sizeConfig.middle;

  const getBaseStyle = () => {
    let s = { width:"100%", borderRadius:"6px", border:"1px solid #d9d9d9",
      boxShadow:"0 1px 2px 0 rgb(0 0 0/0.05)",
      transition:"all 0.3s cubic-bezier(0.645,0.045,0.355,1)",
      fontSize:currentSize.fontSize, ...style };
    if (isHovered && !disabled) s = { ...s, borderColor:"#40a9ff", boxShadow:"0 2px 4px 0 rgba(64,169,255,0.1)" };
    if (isFocused  && !disabled) s = { ...s, borderColor:"#40a9ff", boxShadow:"0 0 0 2px rgba(24,144,255,0.1)", outline:"none" };
    if (disabled)                s = { ...s, backgroundColor:"#f5f5f5", cursor:"not-allowed", opacity:0.6, borderColor:"#d9d9d9" };
    return s;
  };

  const disabledDate = (current) => {
    if (!current) return false;
    if (dateDisable) return dateDisable(current);
    const today = new Date(); today.setHours(0,0,0,0);
    return current.toDate() < today;
  };

  const getDisplayFormat = () => {
    if (displayFormat) return displayFormat;
    switch (picker) {
      case "year":    return "YYYY";
      case "month":   return "MMM YYYY";
      case "quarter": return "[Q]Q YYYY";
      case "week":    return "wo YYYY";
      case "time":    return "HH:mm:ss";
      default:        return "DD MMM YYYY";
    }
  };

  return (
    <div className="flex flex-col">
      <div onMouseEnter={() => { if (!disabled) setIsHovered(true); }} onMouseLeave={() => setIsHovered(false)} style={{ position:"relative" }}>
        <DatePicker
          picker={picker}
          onChange={(date, dateString) => onChange(date, dateString)}
          onFocus={() => { if (!disabled) setIsFocused(true); }}
          onBlur={() => setIsFocused(false)}
          value={value}
          disabledDate={disabledDate}
          disabled={disabled}
          style={getBaseStyle()}
          placeholder={placeholder}
          allowClear={allowClear}
          format={getDisplayFormat()}
          defaultPickerValue={defaultPickerValue}
          showTime={false}
          showToday={showToday}
          size={size}
          className={className}
          {...restProps}
        />
      </div>
    </div>
  );
};

// ─── NxDate ────────────────────────────────────────────────────────────────────
// Routes to NxDateTimeCustom when showTime=true, otherwise NxDatePickerOriginal.

const NxDate = ({
  showTime = false,
  picker = "date", label, onChange = () => {}, mandatory,
  value, dateDisable, disabled = false,
  placeholder, defaultPickerValue,
  displayFormat = "DD MMM YYYY", size = "middle",
  className = "", allowClear = true, showToday = true, style = {},
  ...restProps
}) => {
  if (showTime) {
    return (
      <NxDateTimeCustom
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder || "Select date & time"}
        allowClear={allowClear}
        dateDisable={dateDisable}
        size={size}
        style={style}
        className={className}
      />
    );
  }
  return (
    <NxDatePickerOriginal
      picker={picker} onChange={onChange} value={value} dateDisable={dateDisable}
      disabled={disabled} placeholder={placeholder || "Select date"}
      defaultPickerValue={defaultPickerValue} displayFormat={displayFormat}
      size={size} className={className} allowClear={allowClear}
      showToday={showToday} style={style} {...restProps}
    />
  );
};

// ─── Static utility methods (unchanged) ───────────────────────────────────────

NxDate.formatDate = (dateInput, formatString = "DD MMM YYYY HH:mm:ss") => {
  if (!dateInput) return "-";
  try {
    let date;
    if (dateInput && typeof dateInput === "object" && dateInput._isAMomentObject) {
      date = dateInput.toDate();
    } else if (dateInput instanceof Date) {
      date = dateInput;
    } else if (typeof dateInput === "string") {
      date = new Date(dateInput);
    } else {
      return "-";
    }
    if (isNaN(date.getTime())) return "-";
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const day     = String(date.getDate()).padStart(2,"0");
    const month   = months[date.getMonth()];
    const year    = date.getFullYear();
    const hours   = String(date.getHours()).padStart(2,"0");
    const minutes = String(date.getMinutes()).padStart(2,"0");
    const seconds = String(date.getSeconds()).padStart(2,"0");
    if (formatString === "DD MMM YYYY")       return `${day} ${month} ${year}`;
    if (formatString === "DD MMM YYYY HH:mm") return `${day} ${month} ${year} ${hours}:${minutes}`;
    return `${day} ${month} ${year} ${hours}:${minutes}:${seconds}`;
  } catch { return "-"; }
};

NxDate.formatForAPI = (dateInput, includeTime = true) => {
  if (!dateInput) return null;
  try {
    let date;
    if (dateInput && typeof dateInput === "object" && dateInput._isAMomentObject) {
      date = dateInput.toDate();
    } else if (dateInput instanceof Date) {
      date = dateInput;
    } else if (typeof dateInput === "string") {
      date = new Date(dateInput);
    } else {
      return null;
    }
    if (isNaN(date.getTime())) return null;
    if (includeTime) return date.toISOString().split(".")[0];
    const yr = date.getFullYear();
    const mo = String(date.getMonth() + 1).padStart(2,"0");
    const dy = String(date.getDate()).padStart(2,"0");
    return `${yr}-${mo}-${dy}`;
  } catch { return null; }
};

export default NxDate;
