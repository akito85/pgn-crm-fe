import React, { useState, useMemo } from "react";
import PropTypes from 'prop-types';

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

// ── Constants ──────────────────────────────────────────────────────────────
const HEADER_BG        = "#2C6FAD";
const BORDER_COL       = "#C8CDD4";
const ROW_WHITE        = "#FFFFFF";
const ROW_HOVER        = "#EBF2FA";
const FONT_FAMILY      = "'PlusJakartaSans', 'PublicSans', sans-serif";
const EXPAND_COL_WIDTH = 50;
const DEFAULT_COL_WIDTH = 120;

// ── Helper Functions ───────────────────────────────────────────────────────

// Wrap column render functions to handle intelligent NO column
const wrapColumnRender = (column, index) => {
  const { key, dataIndex, render } = column;
  const fieldKey = key || dataIndex;

  if (fieldKey === "no") {
    return {
      ...column,
      render: (value, record, rowIndex) => {
        // If data has NO field, use it; otherwise auto-number
        if (value !== undefined && value !== null) {
          return value;
        }
        return rowIndex + 1;
      },
    };
  }

  // For non-NO columns, preserve the render function if it exists
  if (render) {
    return column;
  }

  // For plain dataIndex/key columns without custom render, return as-is
  return column;
};

// Measure text width using canvas context
const measureTextWidth = (text, fontSize = 12) => {
  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    ctx.font = `${fontSize}px ${FONT_FAMILY}`;
    return ctx.measureText(String(text || "")).width;
  } catch {
    return 0;
  }
};

// Calculate max width for first 3 columns across parent and child rows
const calculateFirst3ColumnWidths = (parentColumns, childColumns, dataSource) => {
  const first3Parent = parentColumns.slice(0, 3);
  const first3Child = childColumns.slice(0, 3);
  const numCols = Math.min(3, first3Parent.length);

  const widths = {};
  const PAD = 32; // 8px padding each side + 16px buffer
  const MIN_WIDTH = 60;

  // Measure each of the first 3 columns
  for (let i = 0; i < numCols; i++) {
    const parentCol = first3Parent[i];
    const childCol = first3Child[i];
    const fieldKey = parentCol?.key || parentCol?.dataIndex;

    let maxWidth = MIN_WIDTH;

    // Measure parent rows (sample first 10 for performance)
    dataSource.slice(0, 10).forEach((row, rowIdx) => {
      let value = row[fieldKey];
      if (parentCol?.render) {
        value = parentCol.render(value, row, rowIdx);
      }
      const w = measureTextWidth(value);
      maxWidth = Math.max(maxWidth, w);

      // Measure child rows if already loaded
      if (row.children && Array.isArray(row.children)) {
        row.children.slice(0, 10).forEach((child, childIdx) => {
          let childValue = child[fieldKey];
          if (childCol?.render) {
            childValue = childCol.render(childValue, child, childIdx);
          }
          const childW = measureTextWidth(childValue);
          maxWidth = Math.max(maxWidth, childW);
        });
      }
    });

    widths[fieldKey] = Math.ceil(maxWidth + PAD);
  }

  return widths;
};

// ── ChildTable Component ───────────────────────────────────────────────────

const ChildTable = ({ children: rows, columns = [], isLoading = false }) => {
  if (isLoading) {
    return (
      <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 8, color: "#999", fontFamily: FONT_FAMILY, fontSize: 12 }}>
        <span className="nx-child-spinner" />
        Loading...
      </div>
    );
  }

  if (!rows || rows.length === 0) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "#999", fontFamily: FONT_FAMILY, fontSize: 12 }}>
        No data
      </div>
    );
  }

  const displayColumns = columns.length > 0
    ? columns.map((col) => {
        const key = col.key || col.dataIndex || col.title;
        const wrappedCol = wrapColumnRender(col);
        return { ...wrappedCol, key, width: col.width ?? DEFAULT_COL_WIDTH };
      })
    : [];

  const lastIdx = displayColumns.length - 1;

  return (
    <div className="nx-child-scroll" style={{ overflowX: "auto", width: "100%" }}>
      <div style={{ display: "flex", minWidth: "max-content" }}>
        {displayColumns.map((col, colIdx) => (
          <div
            key={col.key || colIdx}
            style={{
              width:      colIdx === lastIdx ? undefined : col.width,
              minWidth:   colIdx === lastIdx ? undefined : col.width,
              flexShrink: colIdx === lastIdx ? 1 : 0,
              flex:       colIdx === lastIdx ? 1 : "none",
              borderRight: colIdx < lastIdx ? `1px solid ${BORDER_COL}` : "none",
              display:       "flex",
              flexDirection: "column",
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
            {rows.map((row, rowIdx) => {
              let cellValue = "—";
              if (col.render) {
                cellValue = col.render(row[col.dataIndex ?? col.key], row, rowIdx);
              } else if (col.dataIndex) {
                cellValue = row[col.dataIndex] ?? "—";
              } else {
                cellValue = row[col.key] ?? "—";
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

// ── ParentRow Component ────────────────────────────────────────────────────

// Security Note: The render functions in parentColumns and childColumns must return
// React elements or strings. Never pass raw HTML strings. If you need to render HTML,
// use dangerouslySetInnerHTML only with sanitized content.
const ParentRow = ({
  no,
  record,
  parentColumns,
  childColumns,
  isEven,
  isExpanded,
  onToggleExpand,
  onExpand,
  actionColumn,
  first3Widths,
  isChildLoading = false,
}) => {
  const bg = isEven ? ROW_HOVER : ROW_WHITE;

  const handleToggle = () => {
    if (!isExpanded && (!record.children || record.children.length === 0)) {
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
          role="button"
          tabIndex={0}
          aria-expanded={isExpanded}
          aria-label={`Toggle details for ${record.name || 'row'}`}
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
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleToggle();
            }
          }}
        >
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

        {/* Data cells */}
        {parentColumns.map((col, colIdx) => {
          const fieldKey = col.key || col.dataIndex;
          let value = record[fieldKey];

          if (col.render) {
            value = col.render(value, record, no - 1);
          }

          const width = first3Widths[fieldKey] || col.width || DEFAULT_COL_WIDTH;
          const isLastDataCol = colIdx === parentColumns.length - 1;
          const showActionBorder = actionColumn && isLastDataCol;

          return (
            <div
              key={fieldKey || colIdx}
              style={{
                ...cellBase,
                width,
                flexShrink: 0,
                borderRight: showActionBorder ? `1px solid ${BORDER_COL}` : (colIdx < parentColumns.length - 1 ? `1px solid ${BORDER_COL}` : "none"),
                flex: colIdx < parentColumns.length - 1 ? "0 0 auto" : "1",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {value || "—"}
            </div>
          );
        })}

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
          {/* Blank spacer under toggle */}
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
          {/* Child table */}
          <div style={{ flex: 1, borderBottom: `1px solid ${BORDER_COL}`, minWidth: 0 }}>
            <ChildTable
              children={record.children || []}
              columns={childColumns.map((col) => {
                const fieldKey = col.key || col.dataIndex;
                const wrappedCol = wrapColumnRender(col);
                const width = first3Widths[fieldKey] || col.width || DEFAULT_COL_WIDTH;
                return { ...wrappedCol, width };
              })}
              isLoading={isChildLoading}
            />
          </div>
        </div>
      )}
    </>
  );
};

// ── Main NxTableNested Component ───────────────────────────────────────────

const NxTableNested = ({
  parentColumns    = [],
  childColumns     = [],
  dataSource       = [],
  loading          = false,
  onExpand         = () => {},
  actionColumn     = null,
  loadingKeys      = new Set(),
}) => {
  const [expandedKeys, setExpandedKeys] = useState(new Set());

  // Calculate first 3 column widths
  const first3Widths = useMemo(() => {
    return calculateFirst3ColumnWidths(parentColumns, childColumns, dataSource);
  }, [parentColumns, childColumns, dataSource]);

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
        width:        "100%",
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
      <div style={{ display: "flex", alignItems: "stretch", width: "100%" }}>
        {/* Toggle header (blank) */}
        <div style={{ ...headerCellBase, width: EXPAND_COL_WIDTH, borderRight: `1px solid rgba(255,255,255,0.2)` }} />

        {/* Parent column headers */}
        {parentColumns.map((col, colIdx) => {
          const fieldKey = col.key || col.dataIndex;
          const width = first3Widths[fieldKey] || col.width || DEFAULT_COL_WIDTH;
          const isLastCol = colIdx === parentColumns.length - 1;

          return (
            <div
              key={fieldKey || colIdx}
              style={{
                ...headerCellBase,
                width,
                flex: isLastCol && !actionColumn ? 1 : 0,
                justifyContent: "space-between",
                borderRight: isLastCol ? (actionColumn ? `1px solid rgba(255,255,255,0.2)` : "none") : `1px solid rgba(255,255,255,0.2)`,
              }}
            >
              <span style={headerSpanBase}>{col.title}</span>
            </div>
          );
        })}

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
            key={row.id}
            no={i + 1}
            record={row}
            parentColumns={parentColumns}
            childColumns={childColumns}
            isEven={i % 2 !== 0}
            isExpanded={expandedKeys.has(row.id)}
            onToggleExpand={() => toggleExpand(row.id)}
            onExpand={() => onExpand(row.id)}
            actionColumn={actionColumn}
            first3Widths={first3Widths}
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

NxTableNested.propTypes = {
  parentColumns: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string,
    dataIndex: PropTypes.string,
    title: PropTypes.string.isRequired,
    render: PropTypes.func,
    width: PropTypes.number,
    align: PropTypes.oneOf(['left', 'center']),
  })).isRequired,
  childColumns: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string,
    dataIndex: PropTypes.string,
    title: PropTypes.string.isRequired,
    render: PropTypes.func,
    width: PropTypes.number,
    align: PropTypes.oneOf(['left', 'center']),
  })).isRequired,
  dataSource: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    children: PropTypes.array,
  })).isRequired,
  loading: PropTypes.bool,
  onExpand: PropTypes.func,
  actionColumn: PropTypes.shape({
    title: PropTypes.string,
    width: PropTypes.number,
    render: PropTypes.func,
  }),
  loadingKeys: PropTypes.instanceOf(Set),
};

NxTableNested.defaultProps = {
  loading: false,
  onExpand: () => {},
  actionColumn: null,
  loadingKeys: new Set(),
};

export default NxTableNested;
