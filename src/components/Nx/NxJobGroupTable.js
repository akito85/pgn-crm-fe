import React, { useState } from "react";

// ── Icons ──────────────────────────────────────────────────────────────────

// + spins 45° → × on expand; spins back on collapse
const ExpandIcon = ({ expanded }) => (
  <svg
    width="8" height="8" viewBox="0 0 8 8" fill="none"
    style={{
      transition:      "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      transform:       expanded ? "rotate(45deg)" : "rotate(0deg)",
      transformOrigin: "center",
    }}
  >
    <line x1="0.5" y1="4" x2="7.5" y2="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="4"   y1="0.5" x2="4" y2="7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const SortIcon = () => (
  <svg width="11" height="20" viewBox="0 0 11 20" fill="none">
    <path d="M5.5 4.5L8.5 8H2.5L5.5 4.5Z" fill="white" opacity="0.7" />
    <path d="M5.5 15.5L2.5 12H8.5L5.5 15.5Z" fill="white" opacity="0.7" />
  </svg>
);

// ── Constants ──────────────────────────────────────────────────────────────
const HEADER_BG        = "#2C6FAD";
const BORDER_COL       = "#C8CDD4";
const ROW_WHITE        = "#FFFFFF";
const ROW_HOVER        = "#EBF2FA";
const FONT_FAMILY      = "'PlusJakartaSans', 'PublicSans', sans-serif";
const EXPAND_COL_WIDTH = 50;

// Child column widths — NO/NAME/CODE match parent column widths exactly
const CHILD_WIDTHS = { no: 60, name: 150, code: 180 };
const DEFAULT_CHILD_COL_WIDTH = 120;
const resolveChildWidth = (key, defWidth) =>
  CHILD_WIDTHS[key] ?? defWidth ?? DEFAULT_CHILD_COL_WIDTH;

// ── Child Table ───────────────────────────────────────────────────────────
const ChildTable = ({ children: jobs, isHovered, columns = [], nameColWidth = 150, isLoading = false }) => {
  const bg = isHovered ? ROW_HOVER : ROW_WHITE;

  if (isLoading) {
    return (
      <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 8, color: "#999", fontFamily: FONT_FAMILY, fontSize: 12 }}>
        <span className="nx-child-spinner" />
        Loading jobs...
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "#999", fontFamily: FONT_FAMILY, fontSize: 12 }}>
        No jobs
      </div>
    );
  }

  // NO/NAME/CODE are fixed-width; handlerClass gets flex:2; everything else is flex:1
  const displayColumns = columns.length > 0
    ? columns.map((col) => {
        const key = col.key || col.dataIndex || col.title;
        if (key === "no")   return { ...col, key, width: 60,           fixed: true };
        if (key === "name") return { ...col, key, width: nameColWidth,  fixed: true };
        if (key === "code") return { ...col, key, width: 180,           fixed: true };
        return { ...col, key, fixed: false, flexWeight: key === "handlerClass" ? 2 : 1 };
      })
    : [
        { key: "no",   title: "NO",   width: 60,          fixed: true },
        { key: "name", title: "NAME", dataIndex: "name", width: nameColWidth, fixed: true },
      ];

  const lastIdx = displayColumns.length - 1;

  return (
    // overflowX: auto enables horizontal scroll when child columns exceed container width
    <div className="nx-child-scroll" style={{ overflowX: "auto", width: "100%" }}>
      {/* No explicit width here — natural width = sum of fixed column widths, triggers scroll */}
      <div style={{ display: "flex" }}>
      {displayColumns.map((col, colIdx) => (
        <div
          key={col.key || colIdx}
          style={{
            width:       col.fixed ? col.width : undefined,
            flex:        col.fixed ? "none" : col.flexWeight ?? 1,
            minWidth:    col.fixed ? col.width : 0,
            flexShrink:  0,
            borderRight: colIdx < lastIdx ? `1px solid ${BORDER_COL}` : "none",
            display:        "flex",
            flexDirection:  "column",
          }}
        >
          {/* header */}
          <div
            style={{
              background:     HEADER_BG,
              height:         30,
              display:        "flex",
              alignItems:     "center",
              justifyContent: col.align === "center" ? "center" : "flex-start",
              borderBottom:   `1px solid ${BORDER_COL}`,
              padding:        "4px 8px",
              overflow:       "hidden",
            }}
          >
            <span
              style={{
                color:          "#fff",
                fontSize:       10,
                fontWeight:     600,
                fontFamily:     FONT_FAMILY,
                letterSpacing:  "0.05em",
                textTransform:  "uppercase",
                overflow:       "hidden",
                textOverflow:   "ellipsis",
                whiteSpace:     "nowrap",
              }}
            >
              {col.title}
            </span>
          </div>
          {/* rows */}
          {jobs.map((job, rowIdx) => {
            let cellValue = "—";
            if (col.key === "no") {
              cellValue = rowIdx + 1;
            } else if (col.render) {
              cellValue = col.render(job[col.dataIndex ?? col.key], job, rowIdx);
            } else if (col.dataIndex) {
              cellValue = job[col.dataIndex] ?? "—";
            } else {
              cellValue = job[col.key] ?? "—";
            }

            return (
              <div
                key={rowIdx}
                style={{
                  height:         30,
                  display:        "flex",
                  alignItems:     "center",
                  justifyContent: col.align === "center" ? "center" : "flex-start",
                  borderBottom:   `1px solid ${BORDER_COL}`,
                  padding:        "4px 8px",
                  background:     rowIdx % 2 === 0 ? ROW_WHITE : ROW_HOVER,
                  fontSize:       12,
                  fontFamily:     FONT_FAMILY,
                  color:          "#111827",
                  overflow:       "hidden",
                  textOverflow:   "ellipsis",
                  whiteSpace:     "nowrap",
                }}
              >
                {cellValue}
              </div>
            );
          })}
        </div>
      ))}
      </div>
    </div>
  );
};

// ── Parent Row ────────────────────────────────────────────────────────────
const ParentRow = ({
  no,
  name,
  code,
  accessGroup,
  jobs,
  isEven,
  isExpanded,
  onToggleExpand,
  onExpand,
  childColumns,
  record,
  actionColumn,
  nameColWidth = 150,
  isChildLoading = false,
}) => {
  const bg = isEven ? ROW_HOVER : ROW_WHITE;

  const handleToggle = () => {
    if (!isExpanded && jobs.length === 0) {
      onExpand?.();
    }
    onToggleExpand?.();
  };

  const cellBase = {
    display:    "flex",
    alignItems: "center",
    borderBottom: `1px solid ${BORDER_COL}`,
    fontSize:   12,
    fontFamily: FONT_FAMILY,
    color:      "#111827",
    padding:    "4px 8px",
    minHeight:  30,
    height:     30,
    boxSizing:  "border-box",
  };

  return (
    <>
      {/* Parent row */}
      <div style={{ display: "flex", alignItems: "stretch", background: bg }}>
        {/* Toggle cell */}
        <div
          style={{
            width:          EXPAND_COL_WIDTH,
            flexShrink:     0,
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            borderRight:    `1px solid ${BORDER_COL}`,
            borderBottom:   `1px solid ${BORDER_COL}`,
            minHeight:      30,
            height:         30,
            cursor:         "pointer",
            boxSizing:      "border-box",
          }}
          onClick={handleToggle}
        >
          {/* +/- expand icon — morphs + ↔ − via SVG animation */}
          <span
            style={{
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              color:          "#1976D2",
              pointerEvents:  "none",
            }}
          >
            <ExpandIcon expanded={isExpanded} />
          </span>
        </div>

        {/* NO */}
        <div style={{ ...cellBase, width: 60, flexShrink: 0, justifyContent: "center", borderRight: `1px solid ${BORDER_COL}` }}>
          {no}
        </div>

        {/* NAME */}
        <div style={{ ...cellBase, width: nameColWidth, flexShrink: 0, borderRight: `1px solid ${BORDER_COL}`, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {name}
        </div>

        {/* CODE */}
        <div style={{ ...cellBase, width: 180, flexShrink: 0, borderRight: `1px solid ${BORDER_COL}` }}>
          {code}
        </div>

        {/* ACCESS GROUP */}
        <div style={{ ...cellBase, flex: 1, borderRight: actionColumn ? `1px solid ${BORDER_COL}` : "none", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {accessGroup || "—"}
        </div>

        {/* ACTIONS */}
        {actionColumn && (
          <div style={{ ...cellBase, width: actionColumn.width || 120, flexShrink: 0, justifyContent: "center", background: bg }}>
            {actionColumn.render ? actionColumn.render(null, record) : "—"}
          </div>
        )}
      </div>

      {/* Child table — shown when expanded */}
      {isExpanded && (
        <div style={{ display: "flex", alignItems: "stretch", animation: "slideDown 0.2s ease-out" }}>
          {/* Blank spacer under toggle — its borderRight IS the left edge of the child table */}
          <div
            style={{
              width:        EXPAND_COL_WIDTH,
              flexShrink:   0,
              borderRight:  `1px solid ${BORDER_COL}`,
              borderBottom: `1px solid ${BORDER_COL}`,
              background:   bg,
              boxSizing:    "border-box",
            }}
          />
          {/* Child table — no extra left border; last column skips borderRight */}
          <div style={{ flex: 1, borderBottom: `1px solid ${BORDER_COL}`, minWidth: 0 }}>
            <ChildTable children={jobs} isHovered={isEven} columns={childColumns} nameColWidth={nameColWidth} isLoading={isChildLoading} />
          </div>
        </div>
      )}
    </>
  );
};

// ── Main Component ────────────────────────────────────────────────────────
const NxJobGroupTable = ({
  dataSource    = [],
  loading       = false,
  onExpand      = () => {},
  childColumns  = [],
  actionColumn  = null,
  loadingKeys   = new Set(),
}) => {
  const [expandedKeys, setExpandedKeys] = React.useState(new Set());

  // Measure the widest name text across all parent rows and their loaded child jobs.
  // Recalculates whenever dataSource changes (i.e. when child jobs are lazy-loaded).
  const nameColWidth = React.useMemo(() => {
    const MIN = 150;
    const PAD = 32; // 8px padding each side + 16px buffer
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      ctx.font = "12px PlusJakartaSans, PublicSans, sans-serif";
      let maxW = MIN;
      dataSource.forEach((row) => {
        maxW = Math.max(maxW, ctx.measureText(row.name || "").width + PAD);
        (row.jobs || []).forEach((job) => {
          maxW = Math.max(maxW, ctx.measureText(job.name || "").width + PAD);
        });
      });
      return Math.ceil(maxW);
    } catch {
      return MIN;
    }
  }, [dataSource]);

  const toggleExpand = (rowId) => {
    const newSet = new Set(expandedKeys);
    if (newSet.has(rowId)) {
      newSet.delete(rowId);
    } else {
      newSet.add(rowId);
    }
    setExpandedKeys(newSet);
  };

  const headerSpanBase = {
    color:         "#fff",
    fontSize:      10,
    fontWeight:    600,
    fontFamily:    FONT_FAMILY,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  };

  const headerCellBase = {
    background:   HEADER_BG,
    display:      "flex",
    alignItems:   "center",
    borderBottom: `1px solid ${BORDER_COL}`,
    padding:      "4px 8px",
    minHeight:    30,
    height:       30,
    boxSizing:    "border-box",
    flexShrink:   0,
  };

  return (
    <div
      style={{
        borderRadius: 8,
        border:       `1px solid ${BORDER_COL}`,
        overflow:     "hidden",
        display:      "flex",
        flexDirection: "column",
        background:   "#fff",
        fontFamily:   FONT_FAMILY,
      }}
    >
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; max-height: 0; }
          to   { opacity: 1; max-height: 2000px; }
        }

        @keyframes nxSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        .nx-child-spinner {
          display: inline-block;
          width: 14px;
          height: 14px;
          border: 2px solid #e0e7ef;
          border-top-color: #1976D2;
          border-radius: 50%;
          animation: nxSpin 0.65s linear infinite;
          flex-shrink: 0;
        }

        .nx-child-scroll::-webkit-scrollbar        { height: 6px; }
        .nx-child-scroll::-webkit-scrollbar-track  { background: #f1f1f1; }
        .nx-child-scroll::-webkit-scrollbar-thumb  { background: #888; border-radius: 3px; }
        .nx-child-scroll::-webkit-scrollbar-thumb:hover { background: #555; }
        .nx-child-scroll { scrollbar-width: thin; scrollbar-color: #888 #f1f1f1; }
      `}</style>

      {/* Header row */}
      <div style={{ display: "flex", alignItems: "stretch" }}>
        {/* Toggle header (blank) */}
        <div style={{ ...headerCellBase, width: EXPAND_COL_WIDTH, borderRight: `1px solid rgba(255,255,255,0.2)` }} />

        {/* NO header */}
        <div style={{ ...headerCellBase, width: 60, justifyContent: "center", borderRight: `1px solid rgba(255,255,255,0.2)` }}>
          <span style={headerSpanBase}>NO</span>
        </div>

        {/* NAME header */}
        <div style={{ ...headerCellBase, width: nameColWidth, justifyContent: "space-between", borderRight: `1px solid rgba(255,255,255,0.2)` }}>
          <span style={headerSpanBase}>JOB GROUP NAME</span>
          <SortIcon />
        </div>

        {/* CODE header */}
        <div style={{ ...headerCellBase, width: 180, justifyContent: "space-between", borderRight: `1px solid rgba(255,255,255,0.2)` }}>
          <span style={headerSpanBase}>CODE</span>
          <SortIcon />
        </div>

        {/* ACCESS GROUP header */}
        <div style={{ ...headerCellBase, flex: 1, justifyContent: "space-between", borderRight: actionColumn ? `1px solid rgba(255,255,255,0.2)` : "none" }}>
          <span style={headerSpanBase}>ACCESS GROUP</span>
        </div>

        {/* ACTIONS header */}
        {actionColumn && (
          <div style={{ ...headerCellBase, width: actionColumn.width || 120, justifyContent: "center" }}>
            <span style={headerSpanBase}>{actionColumn.title || "ACTIONS"}</span>
          </div>
        )}
      </div>

      {/* Data rows */}
      {loading ? (
        <div style={{ padding: "40px 20px", textAlign: "center", color: "#999", fontFamily: FONT_FAMILY, fontSize: 12 }}>
          Loading...
        </div>
      ) : dataSource.length === 0 ? (
        <div style={{ padding: "40px 20px", textAlign: "center", color: "#999", fontFamily: FONT_FAMILY, fontSize: 12 }}>
          No data
        </div>
      ) : (
        dataSource.map((row, i) => (
          <ParentRow
            key={row.id || i}
            no={i + 1}
            name={row.name}
            code={row.code}
            accessGroup={row.accessGroup}
            desc={row.desc}
            jobs={row.jobs || []}
            isEven={i % 2 !== 0}
            index={i}
            isExpanded={expandedKeys.has(row.id)}
            onToggleExpand={() => toggleExpand(row.id)}
            onExpand={() => onExpand(row.id)}
            childColumns={childColumns}
            record={row}
            actionColumn={actionColumn}
            nameColWidth={nameColWidth}
            isChildLoading={loadingKeys.has(row.id)}
          />
        ))
      )}

      {/* Footer */}
      <div
        style={{
          padding:        "6px 12px",
          background:     "#fff",
          display:        "flex",
          justifyContent: "flex-end",
          alignItems:     "center",
          gap:            8,
          borderTop:      `1px solid ${BORDER_COL}`,
          fontFamily:     FONT_FAMILY,
        }}
      >
        <span style={{ fontSize: 12, color: "#6B7280" }}>
          Showing {dataSource.length} of {dataSource.length} entries
        </span>
        {dataSource.length > 0 && (
          <>
            <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#D1D5DB", display: "inline-block" }} />
            <span style={{ fontSize: 12, color: "#22c55e", fontWeight: 500 }}>All data showed</span>
          </>
        )}
      </div>
    </div>
  );
};

export default NxJobGroupTable;
