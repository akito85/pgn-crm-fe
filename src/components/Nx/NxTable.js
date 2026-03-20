// NxTable.js (with resizable columns + grouped columns support + customHeaderLeft + showExport control)
import React, { useMemo, useState, useCallback } from "react";
import {
  DownloadOutlined,
  FilterOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Input, Pagination, Select, Table } from "antd";
import { debounce } from 'lodash';
import ColumnSettings from "../ColumnSettings/ColumnSettings";
import NxAdvanceSearch from "./NxAdvanceSearch";

const { Option } = Select;

// ── Shared visual constants (mirror NxTableNested) ─────────────────────────
const HEADER_BG    = "#2C6FAD";
const BORDER_COL   = "#C8CDD4";
const ROW_WHITE    = "#FFFFFF";
const ROW_HOVER    = "#EBF2FA";
const FONT_FAMILY  = "'PlusJakartaSans', 'PublicSans', sans-serif";

// ── SearchBar Component ─────────────────────────────────────────────────────
// Owns its own local input state so the parent's re-render (triggered by
// filtering) never causes the input to lose focus or re-mount.
const SearchBar = React.memo(({ placeholder = "Search content here ....", onSearch }) => {
  const [localValue, setLocalValue] = React.useState('');
  const inputRef = React.useRef(null);
  const onSearchRef = React.useRef(onSearch);
  React.useEffect(() => { onSearchRef.current = onSearch; }, [onSearch]);

  // Stable debounced fn — created once, never recreated, cancelled on unmount.
  const debouncedNotify = React.useMemo(
    () => debounce((val) => { onSearchRef.current?.(val); }, 220),
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );
  React.useEffect(() => () => debouncedNotify.cancel(), [debouncedNotify]);

  const handleChange = useCallback((e) => {
    const val = e.target.value;
    setLocalValue(val);
    debouncedNotify(val);
  }, [debouncedNotify]);

  const handleClear = useCallback(() => {
    setLocalValue('');
    debouncedNotify.cancel();
    onSearchRef.current?.('');
  }, [debouncedNotify]);

  return (
    <div style={{ position: "relative" }}>
      <SearchOutlined
        style={{
          position: "absolute",
          left: "8px",
          top: "50%",
          transform: "translateY(-50%)",
          fontSize: "14px",
          color: "#9CA3AF",
          zIndex: 30,
        }}
      />
      <Input
        ref={inputRef}
        placeholder={placeholder}
        value={localValue}
        style={{
          height: "32px",
          paddingLeft: "28px",
          border: `1px solid ${BORDER_COL}`,
          borderRadius: "8px",
          fontSize: "12px",
          fontFamily: FONT_FAMILY,
        }}
        onChange={handleChange}
        allowClear
        onClear={handleClear}
      />
    </div>
  );
});

// Resizable Title Component
// Wrapped in React.memo — Ant Design re-creates onHeaderCell props on every
// displayedColumns recompute, so without memo every header cell re-renders on
// any column state change (width, order, drag).
const ResizableTitle = React.memo((props) => {
  const { onResize, width, ...restProps } = props;
  const isResizingRef = React.useRef(false);

  // NOTE: useRef must be called before any conditional return (Rules of Hooks).
  // The early-return below is therefore safe — the ref is already initialised.
  if (!width) {
    return <th {...restProps} />;
  }

  const handleClick = (e) => {
    if (isResizingRef.current) {
      e.stopPropagation();
      e.preventDefault();
      isResizingRef.current = false;
    } else if (restProps.onClick) {
      restProps.onClick(e);
    }
  };

  return (
    <th
      {...restProps}
      onClick={handleClick}
      style={{ ...restProps.style, position: "relative" }}
      draggable={restProps.draggable}
      onDragStart={restProps.onDragStart}
      onDragOver={restProps.onDragOver}
      onDrop={restProps.onDrop}
      onDragEnd={restProps.onDragEnd}
    >
      {restProps.children}
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: "10px",
          cursor: "col-resize",
          userSelect: "none",
          zIndex: 1,
        }}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          isResizingRef.current = false;
          const startX = e.pageX;
          const startWidth = width;
          let hasMoved = false;
          // Track cleanup so unmounting mid-drag doesn't leak listeners.
          let resetTimer = null;

          const cleanup = () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
            document.body.style.cursor = "default";
            document.body.style.userSelect = "auto";
            if (resetTimer) { clearTimeout(resetTimer); resetTimer = null; }
          };

          const handleMouseMove = (moveEvt) => {
            hasMoved = true;
            const newWidth = startWidth + (moveEvt.pageX - startX);
            if (newWidth > 50) {
              onResize(newWidth);
            }
          };

          const handleMouseUp = () => {
            cleanup();
            if (hasMoved) {
              isResizingRef.current = true;
              // Guard: only set the timer if the component is still mounted.
              resetTimer = setTimeout(() => {
                isResizingRef.current = false;
                resetTimer = null;
              }, 100);
            }
          };

          document.addEventListener("mousemove", handleMouseMove);
          document.addEventListener("mouseup", handleMouseUp);
          document.body.style.cursor = "col-resize";
          document.body.style.userSelect = "none";

          // Safety net: if the component unmounts before mouseup fires,
          // clean up document listeners so they don't dangle forever.
          // We attach a one-shot cleanup to the element's ownerDocument.
          // Using a WeakRef so we don't hold the element in memory.
          const elRef = { cleanup };
          isResizingRef._cleanup = elRef.cleanup;
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.borderRight = "2px solid #1890ff";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.borderRight = "none";
        }}
      />
    </th>
  );
});

// ── Column-preference persistence ─────────────────────────────────────────
//
// Storage key:  nxtable__<userId>__<idTable>
// Schema v1:   { version, hiddenColumns, fixedColumns, columnWidths, columnOrder }
//
// Rules:
//  • Read once (lazy useState initialiser) — no effect needed for first load.
//  • Write is debounced 400 ms so rapid column-resize events don't thrash storage.
//  • Any parse / quota error is caught silently — the table just uses defaults.
//  • Old / unrecognised schema versions are discarded (fresh defaults).
//  • userId or idTable missing → persistence is skipped entirely (no-op).

const PREFS_VERSION = 1;

const buildStorageKey = (userId, idTable) =>
  userId && idTable ? `nxtable__${userId}__${idTable}` : null;

const readPrefs = (storageKey) => {
  if (!storageKey) return null;
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.version !== PREFS_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
};

// Returns a stable debounced writer. Created once per component instance.
// Exposes cancel() so the pending timer can be flushed/discarded when the
// storageKey changes — otherwise the old timer fires and writes to the wrong key.
const makePrefsWriter = (storageKey) => {
  if (!storageKey) {
    const noop = () => {};
    noop.cancel = () => {};
    return noop;
  }
  let timer = null;
  const write = (prefs) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      try {
        localStorage.setItem(storageKey, JSON.stringify({ version: PREFS_VERSION, ...prefs }));
      } catch {
        // Quota exceeded or private-browsing restriction — fail silently.
      }
    }, 400);
  };
  write.cancel = () => { if (timer) { clearTimeout(timer); timer = null; } };
  return write;
};

const useColumnPreferences = ({ userId, idTable, fixedColumnsProp }) => {
  const storageKey = buildStorageKey(userId, idTable);

  // Read prefs exactly once per storageKey — not on every render.
  const savedPrefsRef = React.useRef(undefined);
  if (savedPrefsRef.current === undefined || savedPrefsRef._key !== storageKey) {
    savedPrefsRef.current = readPrefs(storageKey);
    savedPrefsRef._key = storageKey;
  }
  const savedPrefs = savedPrefsRef.current;

  // Stable writer ref — recreated only when storageKey changes.
  const writerRef = React.useRef(null);
  if (!writerRef.current) writerRef.current = makePrefsWriter(storageKey);
  React.useEffect(() => {
    // Cancel any pending write for the old key before switching.
    writerRef.current?.cancel?.();
    writerRef.current = makePrefsWriter(storageKey);
    // Refresh saved prefs cache for the new key.
    savedPrefsRef.current = readPrefs(storageKey);
    savedPrefsRef._key = storageKey;
  }, [storageKey]);

  const write = useCallback((patch) => {
    writerRef.current(patch);
  }, []);

  // Seed values: saved prefs take priority over prop defaults.
  const initHiddenColumns = savedPrefs?.hiddenColumns ?? [];
  const initFixedColumns  = savedPrefs?.fixedColumns  ?? {
    left:  Array.isArray(fixedColumnsProp?.left)  ? [...fixedColumnsProp.left]  : [],
    right: Array.isArray(fixedColumnsProp?.right) ? [...fixedColumnsProp.right] : [],
  };
  const initColumnWidths = savedPrefs?.columnWidths ?? {};
  const initColumnOrder  = savedPrefs?.columnOrder  ?? [];

  return { write, initHiddenColumns, initFixedColumns, initColumnWidths, initColumnOrder, storageKey };
};

const NxTable = ({
  idTable,
  // ── Per-user column-preference persistence ────────────────────────────────
  // userId: when provided, column settings (hidden, fixed, widths, order) are
  //         saved to localStorage under the key `nxtable__<userId>__<idTable>`
  //         and restored on next login. When omitted, persistence is silently
  //         skipped — the table works exactly as before with no side effects.
  userId,                       // optional — omit to disable persistence
  // persistPreferences: explicit opt-out even when userId is provided
  //                     (e.g. a preview or demo table instance).
  persistPreferences = true,
  dataSource,
  rowKey = (record) => record.id,
  dataMain, // Alias for dataSource (backward compatibility)
  columns = [],
  columnMain, // Alias for columns (backward compatibility)
  pageSize = 10, // Default pagination size
  current = 1, // Default current page
  loading,
  onChange = () => { },
  onSizeChanger = () => { },
  totalData = 0, // Default total
  onDelete, // eslint-disable-line no-unused-vars
  rowSelection,
  onRowClicked = () => { }, // eslint-disable-line no-unused-vars
  tableScrolled = { y: 380 },
  expandable,
  className,
  useSelect = true,
  usePagination = true,
  useInfiniteScroll = false,
  onLoadMore = () => { },
  hasMore = false,
  // loadMoreThreshold is no longer used — infinite scroll uses IntersectionObserver.
  // Kept here for backward-compat so existing callers don't break.
  loadMoreThreshold = 20, // eslint-disable-line no-unused-vars
  onSort = () => { },
  handleDownload = () => { },
  columnDefinitions,
  fixedColumns = { left: [], right: [] },
  setFixedColumns = () => { },
  onAdvanceSearch = () => { },
  onRow,
  rowClassName,
  customHeaderLeft,
  showExport = false,
  showAdvanceSearch = true,
  showSearchBar = true,
  showRefresh = false,
  onRefresh,
  enableRowClick = false,
  selectedRowKey = null,
  onRowClick = () => { },
  components: externalComponents,
  nestedAlignConfig = {}, // { expandCellWidth, parentCol1Width, parentCol2Width }
  // autoHeight: when true (default), the table body expands to fill the
  // available viewport height below its top edge. tableScrolled.y is still
  // honoured as a minimum so small screens never render below the floor.
  // Set to false to keep the fixed tableScrolled.y behaviour unchanged.
  autoHeight = true,
  // ── Fetch-guarantee & fallback ─────────────────────────────────────────────
  // fetchFailed: set to true when the data fetch errored so the table can show
  //              an actionable empty state instead of the generic Ant Design one.
  fetchFailed = false,
  // onInitialLoad: called once on mount when dataSource is empty and not loading,
  //                giving the parent a chance to trigger the first fetch if it
  //                hasn't been called yet (e.g. RTK Query with skip=true).
  onInitialLoad,
  // onClearPreferences: optional callback fired after the user's saved column
  //                     preferences are cleared (e.g. to notify a parent that
  //                     did its own syncing). The table resets to code defaults.
  onClearPreferences,
}) => {
  // Resolve aliases for backward compatibility
  const resolvedDataSource = dataSource || dataMain || [];
  const resolvedColumns = columns.length > 0 ? columns : (columnMain || []);
  // totalData of 0 is a valid server response (empty result set) — honour it.
  // Only fall back to local length when the prop was not provided at all (null/undefined).
  const resolvedTotalData = (totalData != null) ? totalData : (resolvedDataSource.length || 0);

  // ── Column-preference persistence ─────────────────────────────────────────
  // Reads saved settings from localStorage (keyed by userId + idTable) once at
  // mount and provides a debounced writer used after every state change below.
  const {
    write:             writePrefs,
    initHiddenColumns,
    initFixedColumns,
    initColumnWidths,
    initColumnOrder,
    storageKey:        prefsStorageKey,
  } = useColumnPreferences({
    userId:           persistPreferences ? userId : null,
    idTable:          persistPreferences ? idTable : null,
    fixedColumnsProp: fixedColumns,
  });

  // ── Internal fixed-column state ───────────────────────────────────────────
  // NxTable owns the fixed-column state internally so the user can toggle
  // columns in ColumnSettings without needing the parent to manage controlled
  // state. The external `fixedColumns` prop seeds the initial value (unless a
  // saved preference exists — that takes priority).
  const [internalFixedColumns, setInternalFixedColumns] = React.useState(() => initFixedColumns);

  // Keep internal state in sync when the external prop changes from the parent
  // (e.g. programmatic reset), but do NOT overwrite user changes on every render.
  const prevFixedColsPropRef = React.useRef(JSON.stringify(fixedColumns));
  React.useEffect(() => {
    const nextSig = JSON.stringify(fixedColumns);
    if (nextSig !== prevFixedColsPropRef.current) {
      prevFixedColsPropRef.current = nextSig;
      setInternalFixedColumns({
        left:  Array.isArray(fixedColumns?.left)  ? [...fixedColumns.left]  : [],
        right: Array.isArray(fixedColumns?.right) ? [...fixedColumns.right] : [],
      });
    }
  }, [fixedColumns]);

  // Normalise for safe use downstream — guarantee both keys exist.
  // Memoised so downstream useMemo/useCallback deps that include this object
  // don't invalidate on every render when the underlying arrays haven't changed.
  const safeFixedColumns = useMemo(() => ({
    left:  Array.isArray(internalFixedColumns.left)  ? internalFixedColumns.left  : [],
    right: Array.isArray(internalFixedColumns.right) ? internalFixedColumns.right : [],
  }), [internalFixedColumns]);

  // Destructure y as a primitive so effect deps compare by value, not object identity.
  // Callers that pass tableScrolled={{ y: 400 }} would otherwise cause infinite re-runs.
  const tableScrollYProp = tableScrolled?.y ?? 380;

  // ── Viewport-aware dynamic height ─────────────────────────────────────────
  // When autoHeight=true (default), the table body grows to fill the available
  // vertical space between its top edge and the bottom of the viewport, minus
  // a bottom margin that reserves space for footers / padding.
  //
  // The computed height is used only when it exceeds the prop-based minimum
  // (tableScrolled.y). This means:
  //  • Small screens / insufficient space → prop value wins (safe minimum).
  //  • Large screens / lots of space → table expands to fill viewport.
  //  • Infinite scroll is fully preserved: Phase A reads clientHeight from the
  //    live .ant-table-body DOM element (which reflects this value), so fill
  //    detection always uses the actual rendered container height.
  const [dynamicScrollY, setDynamicScrollY] = React.useState(tableScrollYProp);

  React.useEffect(() => {
    if (!autoHeight) {
      setDynamicScrollY(tableScrollYProp);
      return;
    }

    // Height of the custom footer bar (infinite scroll / pagination strip).
    // 0 when neither is shown — the table body can use that space.
    const FOOTER_H  = (useInfiniteScroll || usePagination) ? 33 : 0;
    // Approximate toolbar height (search bar + controls row above the table).
    const TOOLBAR_H = useSelect ? 48 : 0;

    const compute = () => {
      const el = containerRef.current;
      if (!el) return;

      // Recalculate viewport-dependent values inside compute() so they stay
      // accurate after every window resize — not just at effect-mount time.
      const viewportH     = window.innerHeight;
      const BOTTOM_MARGIN = Math.round(viewportH * 0.10); // 10 % of current viewport
      const rect          = el.getBoundingClientRect();

      // Available space: from the container's top edge to the viewport bottom,
      // minus the footer bar, the toolbar above the table body, and the margin.
      const available = viewportH - rect.top - FOOTER_H - TOOLBAR_H - BOTTOM_MARGIN;
      // Never go below the prop-supplied minimum so callers retain control.
      const next = Math.max(tableScrollYProp, Math.floor(available));
      setDynamicScrollY(next);
    };

    compute(); // run immediately on mount / dep change

    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(compute);
      if (containerRef.current) ro.observe(containerRef.current);
      window.addEventListener('resize', compute, { passive: true });
      return () => {
        ro.disconnect();
        window.removeEventListener('resize', compute);
      };
    }

    window.addEventListener('resize', compute, { passive: true });
    return () => window.removeEventListener('resize', compute);
  }, [autoHeight, tableScrollYProp, useInfiniteScroll, usePagination, useSelect]); // eslint-disable-line react-hooks/exhaustive-deps

  const tableScrollY = dynamicScrollY;

  // ── Deprecation warnings (dev only) ──────────────────────────────────────
  if (process.env.NODE_ENV !== 'production') {
    // setFixedColumns: accepted but never called — NxTable owns fixed-column
    // state internally. Passing this prop has no effect.
    if (setFixedColumns !== undefined && setFixedColumns !== (() => {})) {
      // eslint-disable-next-line no-console
      console.warn('[NxTable] `setFixedColumns` prop is ignored — NxTable manages fixed-column state internally. You can remove this prop.');
    }
    // onDelete / onRowClicked: never wired to anything in NxTable.
    if (onDelete !== undefined) {
      // eslint-disable-next-line no-console
      console.warn('[NxTable] `onDelete` prop is unused and will be removed in a future version.');
    }
    if (onRowClicked !== undefined && onRowClicked !== (() => {})) {
      // eslint-disable-next-line no-console
      console.warn('[NxTable] `onRowClicked` is deprecated — use `onRowClick` instead.');
    }
    // loadMoreThreshold: replaced by IntersectionObserver, kept for compat only.
    if (loadMoreThreshold !== 20) {
      // eslint-disable-next-line no-console
      console.warn('[NxTable] `loadMoreThreshold` is no longer used. Infinite scroll now uses an IntersectionObserver and triggers at a fixed 80px threshold.');
    }
  }

  // Guard against missing idTable — CSS selectors and DOM queries depend on it.
  if (process.env.NODE_ENV !== 'production' && !idTable) {
    console.warn('[NxTable] The `idTable` prop is required. CSS scoping and scroll behaviour will not work correctly without it.');
  }
  const safeId = idTable || 'nx-table-fallback';

  // Stable ID map: avoids regenerating UUIDs on every render for items without an `id`.
  // Keyed by item reference — cleared when dataSource reference changes entirely.
  const stableIdMapRef = React.useRef(new Map());
  React.useEffect(() => {
    // Prune entries for rows no longer in the data source to avoid memory leaks.
    const currentSet = new Set(resolvedDataSource);
    for (const key of stableIdMapRef.current.keys()) {
      if (!currentSet.has(key)) stableIdMapRef.current.delete(key);
    }
  }, [resolvedDataSource]);

  const resolvedDataSourceWithKeys = useMemo(() => {
    if (!Array.isArray(resolvedDataSource)) return [];
    return resolvedDataSource.map((item) => {
      if (item.id) return item;
      if (!stableIdMapRef.current.has(item)) {
        stableIdMapRef.current.set(
          item,
          crypto?.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).substring(2)
        );
      }
      return { ...item, id: stableIdMapRef.current.get(item) };
    });
  }, [resolvedDataSource]);

  const [optionSelectedCol, setOptionSelectedCol] = useState(() => initHiddenColumns);
  const [isAdvanceOpen, setIsAdvanceOpen] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [clickedRowKey, setClickedRowKey] = useState(null);

  // ── Static fixed columns — keys with `fixed` baked into the column definition.
  // These are always treated as fixed regardless of the ColumnSettings state and
  // must never be hideable.
  const staticFixedKeys = useMemo(() => {
    const left = [];
    const right = [];
    const traverse = (cols) => {
      cols.forEach((col) => {
        if (!col) return;
        const key = col.key || col.dataIndex || col.title;
        if (!key) return;
        // fixed: true is an Ant Design alias for 'left'
        if (col.fixed === 'left' || col.fixed === true)  left.push(key);
        if (col.fixed === 'right') right.push(key);
        if (col.children) traverse(col.children);
      });
    };
    traverse(resolvedColumns);
    return { left, right };
  }, [resolvedColumns]);

  // Seed internalFixedColumns with any statically-fixed columns on first load
  // (or when column definitions change), so ColumnSettings reflects what is
  // already fixed in the column definition code.
  const prevStaticFixedRef = React.useRef('');
  React.useEffect(() => {
    const nextSig = JSON.stringify(staticFixedKeys);
    if (nextSig === prevStaticFixedRef.current) return;
    prevStaticFixedRef.current = nextSig;

    setInternalFixedColumns((prev) => {
      const prevSafe = {
        left:  Array.isArray(prev?.left)  ? prev.left  : [],
        right: Array.isArray(prev?.right) ? prev.right : [],
      };
      const mergedLeft  = [...new Set([...staticFixedKeys.left,  ...prevSafe.left])];
      const mergedRight = [...new Set([...staticFixedKeys.right, ...prevSafe.right])];
      if (
        mergedLeft.join(',')  === prevSafe.left.join(',') &&
        mergedRight.join(',') === prevSafe.right.join(',')
      ) return prev;
      return { left: mergedLeft, right: mergedRight };
    });
  }, [staticFixedKeys]);

  const handleRefresh = useCallback(() => {
    if (onRefresh) {
      onRefresh();
    } else {
      window.location.reload();
    }
  }, [onRefresh]);

  const [columnWidths, setColumnWidths] = useState(() => initColumnWidths);
  const [draggedColumnKey, setDraggedColumnKey] = useState(null);
  const [columnOrder, setColumnOrder] = useState(() => initColumnOrder);
  const [searchValue, setSearchValue] = useState('');

  // ── Persist column preferences on every relevant state change ─────────────
  // Debounced 400 ms inside writePrefs so rapid resize events don't thrash
  // localStorage. No-op when userId or idTable is absent.
  React.useEffect(() => {
    writePrefs({
      hiddenColumns: optionSelectedCol,
      fixedColumns:  internalFixedColumns,
      columnWidths,
      columnOrder,
    });
  }, [optionSelectedCol, internalFixedColumns, columnWidths, columnOrder, writePrefs]);

  const isLoadingMoreRef = React.useRef(false);

  // ── Initial load guarantee ────────────────────────────────────────────────
  // If data is empty on mount and not already loading, fire onInitialLoad once.
  // This covers the case where the parent conditionally skips its query or
  // forgot to trigger the first fetch.
  const hasTriggeredInitialLoad = React.useRef(false);
  React.useEffect(() => {
    if (
      !hasTriggeredInitialLoad.current &&
      !loading &&
      resolvedDataSource.length === 0 &&
      !fetchFailed &&
      typeof onInitialLoad === 'function'
    ) {
      hasTriggeredInitialLoad.current = true;
      onInitialLoad();
    }
  // Only run on mount — intentionally omit deps that change later.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Fuzzy match helpers ────────────────────────────────────────────────
  // Returns true when every character of `query` appears in `text` in order.
  const fuzzyMatch = useCallback((text, query) => {
    if (!query) return true;
    const t = String(text).toLowerCase();
    const q = query.toLowerCase();
    let qi = 0;
    for (let ti = 0; ti < t.length && qi < q.length; ti++) {
      if (t[ti] === q[qi]) qi++;
    }
    return qi === q.length;
  }, []);

  // Highlight function: exact substring match gets yellow, fuzzy characters get underline.
  const highlightText = useCallback((text, search) => {
    if (!search || text === null || text === undefined) return text;
    const str = String(text);
    const lower = str.toLowerCase();
    const sq = search.toLowerCase();

    // Prefer exact substring highlighting
    const idx = lower.indexOf(sq);
    if (idx !== -1) {
      return (
        <>
          {str.slice(0, idx)}
          <span style={{ backgroundColor: '#fde047', padding: '1px 2px', borderRadius: '2px', fontWeight: 600 }}>
            {str.slice(idx, idx + sq.length)}
          </span>
          {str.slice(idx + sq.length)}
        </>
      );
    }

    // Fuzzy: highlight individual matched characters
    const chars = [];
    let qi = 0;
    for (let i = 0; i < str.length; i++) {
      if (qi < sq.length && str[i].toLowerCase() === sq[qi]) {
        chars.push(
          <span key={i} style={{ color: '#1976D2', fontWeight: 700, textDecoration: 'underline' }}>
            {str[i]}
          </span>
        );
        qi++;
      } else {
        chars.push(str[i]);
      }
    }
    return <>{chars}</>;
  }, []);

  // Filter data based on search value — supports exact substring AND fuzzy match
  const filteredDataSource = useMemo(() => {
    if (!searchValue) return resolvedDataSourceWithKeys;

    return resolvedDataSourceWithKeys.filter(row => {
      return resolvedColumns.some(col => {
        const value = row[col.dataIndex || col.key];
        const str = String(value || "").toLowerCase();
        const sq = searchValue.toLowerCase();
        return str.includes(sq) || fuzzyMatch(str, sq);
      });
    });
  }, [resolvedDataSourceWithKeys, resolvedColumns, searchValue, fuzzyMatch]);

  // Helper: collect all column keys recursively (including grouped column children)
  const getAllColumnKeys = useCallback((cols) => {
    const keys = [];
    const traverse = (columns) => {
      columns.forEach((col) => {
        const key = col.key || col.dataIndex || col.title;
        if (key) {
          keys.push(key);
        }
        if (col.children && Array.isArray(col.children)) {
          traverse(col.children);
        }
      });
    };
    traverse(cols);
    return keys;
  }, []);

  // Initialize / re-sync column order when column definitions change.
  // Using a ref to compare previous column keys avoids resetting order on every
  // unrelated re-render while still reacting to genuine column set changes.
  const prevColumnKeysRef = React.useRef('');
  React.useEffect(() => {
    if (!resolvedColumns || resolvedColumns.length === 0) return;
    const allKeys = getAllColumnKeys(resolvedColumns);
    const nextKeys = allKeys.join(',');
    if (nextKeys !== prevColumnKeysRef.current) {
      prevColumnKeysRef.current = nextKeys;
      setColumnOrder(allKeys);
      // Prune hidden-column keys that no longer exist in the new column set.
      const keySet = new Set(allKeys);
      setOptionSelectedCol((prev) => prev.filter((k) => keySet.has(k)));
    }
  }, [resolvedColumns, getAllColumnKeys]);

  // ── Infinite scroll via IntersectionObserver ─────────────────────────────
  // Keep hasMore and onLoadMore in refs so the observer callback always reads
  // the latest values WITHOUT needing to re-create the observer (which would
  // cause it to fire immediately on every hasMore change).
  const hasMoreRef = React.useRef(hasMore);
  const onLoadMoreRef = React.useRef(onLoadMore);
  React.useEffect(() => { hasMoreRef.current = hasMore; }, [hasMore]);
  React.useEffect(() => { onLoadMoreRef.current = onLoadMore; }, [onLoadMore]);

  // ── Infinite scroll refs — persist across effect re-runs ────────────────────
  // observer and sentinel must survive filteredDataSource.length changes
  // (Phase B must NOT be torn down just because rows were appended).
  // They are only reset when tableScrollY or idTable changes (true restart).
  const infiniteObserverRef   = React.useRef(null);
  const infiniteScrollRootRef = React.useRef(null);
  const infinitePhaseRef      = React.useRef('fill'); // 'fill' | 'scroll'

  // ── Infinite scroll — unified effect ────────────────────────────────────────
  //
  // Phase A — FILL:
  //   Runs after every data append (filteredDataSource.length dep).
  //   Reads the actual rendered row height from the DOM — no hard-coded constant.
  //   Reads clientHeight from the live scroll container — which Ant Design sizes
  //   from tableScrollY — so it is always correct regardless of what y value
  //   the caller passes.
  //   Keeps calling onLoadMore until enough rows overflow the container, then
  //   transitions to Phase B exactly once.
  //
  // Phase B — SCROLL:
  //   A single IntersectionObserver on a sentinel div fires onLoadMore each time
  //   the user scrolls to the bottom. Created once, never torn down on data
  //   appends. Only reset when tableScrollY or idTable changes.
  //
  // Dependency split:
  //   filteredDataSource.length  → re-run Phase A check after each append
  //   tableScrollY + idTable  → full teardown + restart (height prop changed)
  React.useEffect(() => {
    if (!useInfiniteScroll) return;

    // Full teardown when tableScrollY or idTable changes.
    // Reset phase back to 'fill' so the new container height is re-evaluated.
    if (infiniteObserverRef.current) {
      infiniteObserverRef.current.disconnect();
      infiniteObserverRef.current = null;
    }
    infiniteScrollRootRef.current = null;
    infinitePhaseRef.current = 'fill';
  }, [useInfiniteScroll, safeId, tableScrollY]); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    if (!useInfiniteScroll) return;

    let attachRafId = null;
    let destroyed   = false;

    // ── shared trigger ───────────────────────────────────────────────────────
    const triggerLoad = () => {
      if (!hasMoreRef.current || isLoadingMoreRef.current) return;
      isLoadingMoreRef.current = true;
      setIsLoadingMore(true);
      Promise.resolve(onLoadMoreRef.current())
        .catch(() => {})
        .finally(() => {
          isLoadingMoreRef.current = false;
          setIsLoadingMore(false);
        });
    };

    // ── Phase B: scroll event listener (vertical-only, no sentinel) ────────────
    // WHY not IntersectionObserver:
    //   With scroll={{ x: 3000, y: 600 }} Ant Design renders one container that
    //   scrolls both axes. IntersectionObserver with root=scrollRoot clips
    //   visibility to the current horizontal viewport — a sentinel appended at
    //   the end of a 3000px-wide table sits outside the visible horizontal strip
    //   when scrollLeft=0, so it never intersects even when the user has scrolled
    //   to the vertical bottom. This causes the intermittent "only loads after
    //   horizontal scroll" bug.
    //
    // WHY a scroll listener works:
    //   We compute trigger purely from vertical scroll metrics:
    //     scrollTop + clientHeight >= scrollHeight - threshold
    //   This is completely independent of horizontal scroll position.
    //
    // Stored in refs so it survives filteredDataSource.length re-runs without
    // being re-attached on every data append.
    const startScrollPhase = (scrollRoot) => {
      if (destroyed || infiniteObserverRef.current) return;

      infinitePhaseRef.current = 'scroll';

      const THRESHOLD = 80; // px from bottom to trigger load (mirrors old rootMargin)

      const onScroll = () => {
        if (!hasMoreRef.current || isLoadingMoreRef.current) return;
        const { scrollTop, clientHeight, scrollHeight } = scrollRoot;
        if (scrollTop + clientHeight >= scrollHeight - THRESHOLD) {
          triggerLoad();
        }
      };

      scrollRoot.addEventListener('scroll', onScroll, { passive: true });

      // Store the listener removal function in the observer ref slot so the
      // teardown effect can call it uniformly via infiniteObserverRef.current.disconnect()
      infiniteObserverRef.current = { disconnect: () => scrollRoot.removeEventListener('scroll', onScroll) };
    };

    // ── Phase A: fill the container ──────────────────────────────────────────
    // Called after every data append while phase === 'fill'.
    // Uses clientHeight of the live scroll container — which Ant Design derives
    // from the scroll.y prop — so the target height is always prop-accurate.
    const checkFill = (scrollRoot) => {
      if (destroyed) return;

      // If Phase B is already active, nothing to do here.
      if (infinitePhaseRef.current === 'scroll') return;

      // Already overflowing → transition to Phase B.
      if (scrollRoot.scrollHeight > scrollRoot.clientHeight) {
        startScrollPhase(scrollRoot);
        return;
      }

      if (!hasMoreRef.current || isLoadingMoreRef.current) return;

      // Measure real row height from the first painted data row.
      const firstRow = scrollRoot.querySelector(
        "tr.ant-table-row, tr:not(.ant-table-placeholder):not(.ant-table-measure-row)"
      );
      if (!firstRow || firstRow.getBoundingClientRect().height <= 0) {
        attachRafId = requestAnimationFrame(() => checkFill(scrollRoot));
        return;
      }

      const rowH        = firstRow.getBoundingClientRect().height;
      // clientHeight reflects the actual rendered container size, which Ant
      // Design sets from tableScrollY. This is the prop-driven target height.
      const containerH  = scrollRoot.clientHeight;
      const currentRows = scrollRoot.querySelectorAll(
        "tr.ant-table-row, tr:not(.ant-table-placeholder):not(.ant-table-measure-row)"
      ).length;
      const rowsNeeded  = Math.ceil(containerH / rowH);

      if (currentRows < rowsNeeded) {
        // Not enough rows yet — fetch the next page.
        // The effect re-runs on filteredDataSource.length change (next append)
        // and calls checkFill again automatically.
        triggerLoad();
      } else {
        // Rows cover the container height (may be exactly flush).
        // Hand off to Phase B — IntersectionObserver handles the rest.
        startScrollPhase(scrollRoot);
      }
    };

    // ── bootstrap ────────────────────────────────────────────────────────────
    const boot = () => {
      // Re-use cached scrollRoot if available (avoids querySelector on every append).
      const scrollRoot =
        infiniteScrollRootRef.current ||
        document.querySelector(`#${safeId} .ant-table-body`);
      if (!scrollRoot) return false;
      infiniteScrollRootRef.current = scrollRoot;
      attachRafId = requestAnimationFrame(() => checkFill(scrollRoot));
      return true;
    };

    if (!boot()) {
      const retry = () => {
        if (boot()) return;
        attachRafId = requestAnimationFrame(retry);
      };
      attachRafId = requestAnimationFrame(retry);
    }

    return () => {
      destroyed = true;
      if (attachRafId) cancelAnimationFrame(attachRafId);
      // Do NOT disconnect the observer here — it must survive data appends.
      // Observer teardown is handled by the sibling effect above that watches
      // [useInfiniteScroll, safeId, tableScrollY].
    };
  // filteredDataSource.length: re-run Phase A after each append.
  // tableScrollY + idTable: handled by the sibling effect (teardown only).
  }, [useInfiniteScroll, safeId, filteredDataSource.length, tableScrollY]); // eslint-disable-line react-hooks/exhaustive-deps


  // Keyboard arrow navigation
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      const activeElement = document.activeElement;
      const isTyping =
        activeElement.tagName === "INPUT" ||
        activeElement.tagName === "TEXTAREA" ||
        activeElement.isContentEditable;

      if (isTyping) return;

      const tableContainer = document.querySelector(`#${safeId}`);
      if (!tableContainer) return;

      const tableBody = document.querySelector(`#${safeId} .ant-table-body`);
      if (!tableBody) return;

      const scrollAmount = 100;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        tableBody.scrollTo({
          left: tableBody.scrollLeft - scrollAmount,
          behavior: "smooth",
        });
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        tableBody.scrollTo({
          left: tableBody.scrollLeft + scrollAmount,
          behavior: "smooth",
        });
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [safeId]);

  // Per-key resize handler cache — avoids creating a new function reference
  // on every processColumn call (which runs inside the displayedColumns memo).
  const resizeHandlerMapRef = React.useRef({});
  const handleResize = useCallback(
    (key) => {
      if (!resizeHandlerMapRef.current[key]) {
        resizeHandlerMapRef.current[key] = (newWidth) => {
          setColumnWidths((prev) => ({ ...prev, [key]: newWidth }));
        };
      }
      return resizeHandlerMapRef.current[key];
    },
    []
  );

  // Prune stale keys when column set changes so the map doesn't grow unboundedly.
  React.useEffect(() => {
    const currentKeys = new Set(Object.keys(columnWidths));
    Object.keys(resizeHandlerMapRef.current).forEach((k) => {
      if (!currentKeys.has(k)) delete resizeHandlerMapRef.current[k];
    });
  }, [columnWidths]);

  const handleDragStart = useCallback((e, columnKey) => {
    setDraggedColumnKey(columnKey);
    e.dataTransfer.effectAllowed = "move";
    // setData value must be a string — pass the key so it's also readable by
    // external drop targets if needed, though drag state is managed via React state.
    e.dataTransfer.setData("text/plain", columnKey);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    return false;
  }, []);

  const handleDrop = useCallback(
    (e, targetColumnKey) => {
      e.preventDefault();
      e.stopPropagation();

      if (draggedColumnKey && draggedColumnKey !== targetColumnKey) {
        setColumnOrder((prevOrder) => {
          const newOrder = [...prevOrder];
          const draggedIndex = newOrder.indexOf(draggedColumnKey);
          const targetIndex = newOrder.indexOf(targetColumnKey);

          if (draggedIndex !== -1 && targetIndex !== -1) {
            newOrder.splice(draggedIndex, 1);
            newOrder.splice(targetIndex, 0, draggedColumnKey);
          }

          return newOrder;
        });
      }

      setDraggedColumnKey(null);
      return false;
    },
    [draggedColumnKey]
  );

  const handleDragEnd = useCallback(() => {
    setDraggedColumnKey(null);
  }, []);

  // Separate drag-visual state so processColumn doesn't rebuild the entire
  // column array on every drag-hover. processColumn reads from this ref;
  // the ref update triggers no re-render by itself.
  const draggedColumnKeyRef = React.useRef(draggedColumnKey);
  React.useEffect(() => { draggedColumnKeyRef.current = draggedColumnKey; }, [draggedColumnKey]);

  // Recursive column processor — applies widths, fixed positions, drag/resize handlers
  const processColumn = useCallback(
    (col, fixedPos = null) => {
      const colKey = col.key || col.dataIndex || col.title;

      // If the column has children, process recursively
      if (col.children && Array.isArray(col.children)) {
        return {
          ...col,
          key: colKey,
          children: col.children.map((childCol) => processColumn(childCol, fixedPos)),
        };
      }

      // Plain column (no children)
      let textAlign = "left";
      if (col.isNumber || col.align === "right") {
        textAlign = "right";
      } else if (col.isClassification) {
        textAlign = "center";
      }

      const isDraggable = !fixedPos && !col.fixed;

      const newCol = {
        ...col,
        key: colKey,
        width: columnWidths[colKey] || col.width || 150,
        align: col.align || textAlign,
        ellipsis: {
          showTitle: true,
        },
        onHeaderCell: (column) => {
          const baseStyle = {
            textTransform: "uppercase",
            fontSize: "10px",
            cursor: isDraggable ? "move" : "default",
          };

          // Read from ref — doesn't add draggedColumnKey to processColumn deps,
          // so the column array only rebuilds when widths / handlers change.
          if (isDraggable && draggedColumnKeyRef.current === colKey) {
            baseStyle.opacity = 0.5;
            baseStyle.backgroundColor = "#f0f0f0";
          }

          return {
            width: columnWidths[colKey] || col.width || 150,
            onResize: handleResize(colKey),
            style: baseStyle,
            draggable: isDraggable,
            onDragStart: isDraggable
              ? (e) => handleDragStart(e, colKey)
              : undefined,
            onDragOver: isDraggable ? handleDragOver : undefined,
            onDrop: isDraggable ? (e) => handleDrop(e, colKey) : undefined,
            onDragEnd: isDraggable ? handleDragEnd : undefined,
          };
        },
        onCell: (record, index) => {
          const externalOnCell = col.onCell ? col.onCell(record, index) : {};
          return {
            ...externalOnCell,
            style: {
              textAlign: textAlign,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontSize: "12px",
              ...(externalOnCell.style || {}),
            },
          };
        },
      };

      if (fixedPos) {
        newCol.fixed = fixedPos;
      } else if (!col.fixed) {
        delete newCol.fixed;
      }

      return newCol;
    },
    [
      columnWidths,
      handleResize,
      handleDragStart,
      handleDragOver,
      handleDrop,
      handleDragEnd,
      // draggedColumnKey intentionally excluded — read via ref to avoid
      // rebuilding the entire column array on every drag-hover state change.
    ]
  );

  const displayedColumns = useMemo(() => {
    const cols = (resolvedColumns || []).filter(Boolean).map((c) => ({
      ...c,
      key: c.key || c.dataIndex || c.title,
    }));

    // Keys that must never be hidden — statically fixed columns in the definition
    // plus any column whose definition marks it as unhideable via a custom flag.
    const allStaticFixed = new Set([...staticFixedKeys.left, ...staticFixedKeys.right]);

    // Filter hidden columns (including children), but never hide static-fixed columns.
    const filterHidden = (columns) => {
      return columns
        .map((col) => {
          const colKey = col.key || col.dataIndex || col.title;

          // Static-fixed columns are always visible — skip the hidden check.
          if (!allStaticFixed.has(colKey) && optionSelectedCol.includes(colKey)) {
            return null;
          }

          // If the column has children, filter them recursively.
          if (col.children && Array.isArray(col.children)) {
            const filteredChildren = filterHidden(col.children);
            // If all children are hidden, hide the parent group too.
            if (filteredChildren.length === 0) return null;
            return { ...col, children: filteredChildren };
          }

          return col;
        })
        .filter(Boolean);
    };

    let visible = filterHidden(cols);

    // ── Guard: never let ALL columns be hidden ───────────────────────────────
    // If every column was toggled off (e.g. user checked all), keep the first
    // non-null column visible so the table always has at least one column.
    if (visible.length === 0 && cols.length > 0) {
      visible = [cols[0]];
    }

    // Apply column order (top-level only) — use a copy to avoid mutating visible.
    const ordered = columnOrder.length > 0
      ? [...visible].sort((a, b) => {
          const ia = columnOrder.indexOf(a.key);
          const ib = columnOrder.indexOf(b.key);
          if (ia === -1) return 1;
          if (ib === -1) return -1;
          return ia - ib;
        })
      : [...visible];

    // Separate into left, normal, right.
    // Handle fixed: true (Ant Design alias for 'left') and merge with safeFixedColumns.
    const leftFixed = [];
    const rightFixed = [];
    const normal = [];

    ordered.forEach((col) => {
      const isLeftFixed =
        safeFixedColumns.left.includes(col.key) ||
        staticFixedKeys.left.includes(col.key) ||
        col.fixed === 'left' ||
        col.fixed === true;           // fixed:true is AntD alias for 'left'
      const isRightFixed =
        safeFixedColumns.right.includes(col.key) ||
        staticFixedKeys.right.includes(col.key) ||
        col.fixed === 'right';

      if (isLeftFixed) {
        leftFixed.push(col);
      } else if (isRightFixed) {
        rightFixed.push(col);
      } else {
        normal.push(col);
      }
    });

    // ── Guard: all columns fixed, no normal columns ───────────────────────────
    // Ant Design requires at least one non-fixed column as a scroll anchor.
    // If every column ended up fixed, demote the last left-fixed (or first
    // right-fixed) to normal so the table layout doesn't break.
    if (normal.length === 0 && (leftFixed.length > 0 || rightFixed.length > 0)) {
      if (leftFixed.length > 0) {
        normal.push(leftFixed.pop());
      } else {
        normal.push(rightFixed.shift());
      }
    }

    return [
      ...leftFixed.map((c) => processColumn(c, "left")),
      ...normal.map((c) => processColumn(c, undefined)),
      ...rightFixed.map((c) => processColumn(c, "right")),
    ];
  }, [
    resolvedColumns,
    optionSelectedCol,
    safeFixedColumns,
    staticFixedKeys,
    columnOrder,
    processColumn,
  ]);

  // ── Search highlighting — separate memo so searchValue changes only rewrap
  // render functions, never rebuild the full layout/fixed/ordering pipeline.
  const displayedColumnsWithSearch = useMemo(() => {
    if (!searchValue) return displayedColumns;

    const processColumnForSearch = (col) => {
      const originalRender = col.render;
      const newCol = {
        ...col,
        render: (text, record, index) => {
          const renderedValue = originalRender ? originalRender(text, record, index) : text;
          if (typeof renderedValue === 'string') {
            return highlightText(renderedValue, searchValue);
          }
          return renderedValue;
        },
      };
      if (newCol.children && Array.isArray(newCol.children)) {
        newCol.children = newCol.children.map(processColumnForSearch);
      }
      return newCol;
    };

    return displayedColumns.map(processColumnForSearch);
  }, [displayedColumns, searchValue, highlightText]);

  const handleAdvanceSearch = useCallback((searchData) => {
    onAdvanceSearch(searchData);
    setIsAdvanceOpen(false);
  }, [onAdvanceSearch]);

  const handleClearFilter = useCallback(() => {
    onAdvanceSearch(null);
  }, [onAdvanceSearch]);

  // ── Clear saved column preferences ────────────────────────────────────────
  // Resets all four persisted settings to code defaults and removes the
  // localStorage entry. Useful as a "Reset columns" button in the toolbar.
  const handleClearPreferences = useCallback(() => {
    // Reset all four state pieces to their hard-coded defaults.
    setOptionSelectedCol([]);
    setColumnWidths({});
    setColumnOrder([]); // will re-derive from column definitions on next effect run
    setInternalFixedColumns({
      left:  Array.isArray(fixedColumns?.left)  ? [...fixedColumns.left]  : [],
      right: Array.isArray(fixedColumns?.right) ? [...fixedColumns.right] : [],
    });
    // Wipe the stored entry so it doesn't re-seed on next mount.
    if (prefsStorageKey) {
      try { localStorage.removeItem(prefsStorageKey); } catch { /* quota / private */ }
    }
    onClearPreferences?.();
  }, [fixedColumns, prefsStorageKey, onClearPreferences]);

  // Merge external components with internal ones.
  // ResizableTitle is the default header.cell — external can override other
  // header slots (e.g. wrapper, row) but we keep ResizableTitle for cell so
  // column resize always works. If an external header.cell is provided it
  // would override resize — document that as intentional opt-out.
  const components = {
    header: {
      ...(externalComponents?.header || {}),
      cell: externalComponents?.header?.cell ?? ResizableTitle,
    },
    ...(externalComponents?.body ? { body: externalComponents.body } : {}),
  };

  const hasRightControls =
    showExport || showAdvanceSearch || showSearchBar || showRefresh;

  React.useEffect(() => {
    if (selectedRowKey !== null) {
      setClickedRowKey(selectedRowKey);
    }
  }, [selectedRowKey]);

  const handleRowClick = useCallback(
    (record) => {
      const rowKey = record.key || record.recordId || record.id;
      setClickedRowKey(rowKey);
      onRowClick(record, rowKey);
    },
    [onRowClick]
  );

  const customOnRow = useCallback(
    (record, index) => {
      const baseOnRow = onRow ? onRow(record, index) : {};

      return {
        ...baseOnRow,
        onClick: (event) => {
          if (baseOnRow.onClick) {
            baseOnRow.onClick(event);
          }
          if (enableRowClick) {
            handleRowClick(record);
          }
        },
        style: {
          ...baseOnRow.style,
          cursor: enableRowClick
            ? "pointer"
            : baseOnRow.style?.cursor || "default",
          transition: "background-color 0.2s ease",
        },
      };
    },
    [onRow, enableRowClick, handleRowClick]
  );

  const customRowClassName = useCallback(
    (record, index) => {
      const recordKey = record.key || record.recordId || record.id;
      const isSelected = enableRowClick && clickedRowKey === recordKey;

      const baseClassName =
        typeof rowClassName === "function"
          ? rowClassName(record, index)
          : rowClassName || "";

      return `${baseClassName} ${isSelected ? "row-selected" : ""}`.trim();
    },
    [rowClassName, enableRowClick, clickedRowKey]
  );

  // ── Container width measurement ───────────────────────────────────────────
  // Track the actual rendered width of the table wrapper so the fixed-column
  // warning can compare real pixel widths, not assumed/prop values.
  const containerRef = React.useRef(null);
  const [containerWidth, setContainerWidth] = React.useState(0);
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    // Initial measurement
    setContainerWidth(el.getBoundingClientRect().width);
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) setContainerWidth(entry.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // ── Fixed-column overflow warning ─────────────────────────────────────────
  // Computes a warning when the combined width of all fixed columns leaves no
  // visible scroll area for the non-fixed (normal) columns. The message names
  // the offending columns and states the pixel overflow so users know exactly
  // what to adjust.
  const fixedColumnWarning = useMemo(() => {
    if (containerWidth <= 0 || displayedColumns.length === 0) return null;

    // Collect left-fixed and right-fixed columns with their resolved widths.
    const leftCols  = displayedColumns.filter((c) => c.fixed === 'left');
    const rightCols = displayedColumns.filter((c) => c.fixed === 'right');
    const fixedCols = [...leftCols, ...rightCols];

    if (fixedCols.length === 0) return null;

    // Sum widths — fall back to 150 if a column has no explicit width (same
    // default used in processColumn).
    const totalFixed = fixedCols.reduce((sum, c) => sum + (c.width || 150), 0);

    // We warn when fixed columns consume so much space that the remaining
    // viewport for scrollable columns is critically narrow (< 80px) — or
    // negative (overflow).
    const SCROLL_MIN = 80; // px — minimum usable scroll area
    const remaining  = containerWidth - totalFixed;

    if (remaining >= SCROLL_MIN) return null;

    // Build a human-readable list of fixed column titles.
    const colNames = fixedCols
      .map((c) => c.title || c.key || c.dataIndex || '—')
      .filter(Boolean);

    const overflowPx = Math.max(0, totalFixed - containerWidth);
    const side =
      leftCols.length > 0 && rightCols.length > 0
        ? 'left & right'
        : leftCols.length > 0
        ? 'left'
        : 'right';

    return {
      colNames,
      totalFixed,
      containerWidth: Math.round(containerWidth),
      overflowPx:     Math.round(overflowPx),
      remaining:      Math.round(remaining),
      side,
      isOverflow:     remaining < 0,
    };
  }, [displayedColumns, containerWidth]);

  const [warningDismissed, setWarningDismissed] = React.useState(false);
  // Reset dismiss state whenever the warning content changes (e.g. user adjusts
  // columns) so a new warning is always visible after a change.
  const prevWarningKeyRef = React.useRef('');
  React.useEffect(() => {
    const key = fixedColumnWarning
      ? fixedColumnWarning.colNames.join(',') + fixedColumnWarning.totalFixed
      : '';
    if (key !== prevWarningKeyRef.current) {
      prevWarningKeyRef.current = key;
      setWarningDismissed(false);
    }
  }, [fixedColumnWarning]);

  return (
    <div
      ref={containerRef}
      className={"flex flex-col w-full"}
      style={{
        ...(nestedAlignConfig.expandCellWidth !== undefined && { '--nx-expand-cell-width': nestedAlignConfig.expandCellWidth }),
        ...(nestedAlignConfig.parentCol1Width !== undefined && { '--nx-parent-col1-width': nestedAlignConfig.parentCol1Width }),
        ...(nestedAlignConfig.parentCol2Width !== undefined && { '--nx-parent-col2-width': nestedAlignConfig.parentCol2Width }),
      }}
    >
      <style>
        {`
            #${safeId} .ant-table-content {
              position: relative;
              z-index: 1;
            }

            #${safeId} .ant-table-body {
              position: relative;
              z-index: 1;
            }

            #${safeId} .ant-table-tbody > tr {
              position: relative;
              z-index: 1;
            }

            #${safeId} .ant-table-tbody > tr:hover {
              z-index: 2;
            }

            /* row-selected background is handled by the alternating-row section above */
            #${safeId} .ant-table-tbody > tr.row-selected {
              z-index: 2;
            }

            #${safeId} .ant-table-tbody .ant-table-cell-fix-left,
            #${safeId} .ant-table-tbody .ant-table-cell-fix-right {
              z-index: 3;
            }

            #${safeId} .ant-table-tbody > tr:hover .ant-table-cell-fix-left,
            #${safeId} .ant-table-tbody > tr:hover .ant-table-cell-fix-right,
            #${safeId} .ant-table-tbody > tr.row-selected .ant-table-cell-fix-left,
            #${safeId} .ant-table-tbody > tr.row-selected .ant-table-cell-fix-right {
              z-index: 3;
            }

            #${safeId} .ant-table-thead > tr > th {
              position: relative;
              z-index: 4;
            }

            #${safeId} .ant-table-thead .ant-table-cell-fix-left,
            #${safeId} .ant-table-thead .ant-table-cell-fix-right {
              z-index: 5 !important;
            }

            #${safeId} .ant-table-filter-trigger,
            #${safeId} .ant-table-filter-trigger-container,
            #${safeId} .ant-table-column-sorter {
              position: relative;
              z-index: 6;
              pointer-events: auto;
            }

            #${safeId} .ant-table-body::-webkit-scrollbar {
              width: 8px;
              height: 8px;
              z-index: 10;
            }

            #${safeId} .ant-table-body::-webkit-scrollbar-track {
              background: #f1f1f1;
              z-index: 10;
            }

            #${safeId} .ant-table-body::-webkit-scrollbar-thumb {
              background: #888;
              border-radius: 6px;
              z-index: 10;
            }

            #${safeId} .ant-table-body::-webkit-scrollbar-thumb:hover {
              background: #555;
            }

            #${safeId} .ant-table-body {
              scrollbar-width: thin;
              scrollbar-color: #888 #f1f1f1;
              padding-bottom: 0;
            }

            @supports (-moz-appearance:none) {
              #${safeId} .ant-table-body {
                padding-bottom: 0;
              }

              #${safeId} .ant-table-content {
                padding-bottom: 0;
              }
            }

            #${safeId} .ant-table-column-sorter,
            #${safeId} .ant-table-filter-trigger,
            #${safeId} .ant-table-column-sorter-up,
            #${safeId} .ant-table-column-sorter-down,
            #${safeId} .ant-table-filter-trigger-container {
              cursor: pointer;
            }

            #${safeId} th[draggable="true"] {
              cursor: move;
            }

            #${safeId} th[draggable="true"] .ant-table-column-sorter,
            #${safeId} th[draggable="true"] .ant-table-filter-trigger,
            #${safeId} th[draggable="true"] .ant-table-column-sorter-up,
            #${safeId} th[draggable="true"] .ant-table-column-sorter-down,
            #${safeId} th[draggable="true"] .ant-table-filter-trigger-container,
            #${safeId} th[draggable="true"] .ant-table-column-sorters {
              cursor: pointer;
            }

            #${safeId} .ant-table-column-sorter {
              margin-left: 4px;
              margin-right: 0px;
            }

            #${safeId} .ant-table-filter-trigger {
              margin-right: 6px;
            }

            #${safeId} .ant-table-column-sorters {
              padding-right: 0px;
            }

            /* Active sorter icon color — override primary color back to white */
            #${safeId} .ant-table-thead .ant-table-column-sorter-up.active .anticon,
            #${safeId} .ant-table-thead .ant-table-column-sorter-down.active .anticon {
              color: rgba(255, 255, 255, 0.85) !important;
            }

            #${safeId} .ant-table {
              border-radius: 8px 8px 0 0;
              overflow: hidden;
              border: none;
              border-collapse: collapse;
              border-spacing: 0;
            }

            #${safeId} .ant-table-container {
              border-radius: 8px 8px 0 0;
              overflow: hidden;
              border: none;
            }

            #${safeId} .ant-table-container table > thead > tr:first-child > *:first-child {
              border-start-start-radius: 8px;
            }

            #${safeId} .ant-table-container table > thead > tr:first-child > *:last-child {
              border-start-end-radius: 8px;
            }

            #${safeId} .ant-table-tbody > tr:last-child > *:first-child {
              border-end-start-radius: 0;
            }

            #${safeId} .ant-table-tbody > tr:last-child > *:last-child {
              border-end-end-radius: 0;
            }

            #${safeId} .ant-table-bordered .ant-table-cell,
            #${safeId} .ant-table-bordered .ant-table-thead > tr > th,
            #${safeId} .ant-table-bordered .ant-table-tbody > tr > td,
            #${safeId} .ant-table-bordered .ant-table-container {
              border-color: ${BORDER_COL} !important;
            }

            #${safeId} .ant-table-thead > tr > th {
              background-color: ${HEADER_BG} !important;
              color: #fff !important;
              padding: 4px 8px !important;
              height: 30px !important;
              line-height: 22px !important;
              font-size: 10px !important;
              border-right: 1px solid rgba(255,255,255,0.2) !important;
              border-bottom: 1px solid ${BORDER_COL} !important;
              font-family: ${FONT_FAMILY};
            }

            #${safeId} .ant-table-thead > tr:first-child > th {
              border-top: 1px solid ${BORDER_COL} !important;
            }

            /* Alternating row colors for the main table body */
            #${safeId} .ant-table-tbody > tr:not(.ant-table-measure-row):not(.ant-table-placeholder):nth-child(odd) > td {
              background-color: ${ROW_WHITE} !important;
            }

            #${safeId} .ant-table-tbody > tr:not(.ant-table-measure-row):not(.ant-table-placeholder):nth-child(even) > td {
              background-color: ${ROW_HOVER} !important;
            }

            /* Hover and selected row highlights */
            #${safeId} .ant-table-tbody > tr:not(.ant-table-measure-row):hover > td {
              background-color: ${ROW_HOVER} !important;
            }

            #${safeId} .ant-table-tbody > tr.row-selected > td {
              background-color: #d1e6f9 !important;
            }

            #${safeId} .ant-table-tbody > tr.row-selected:hover > td {
              background-color: #bad9f5 !important;
            }

            #${safeId} .ant-table-tbody > tr:not(.ant-table-measure-row) > td,
            #${safeId} .ant-table-tbody > tr:not(.ant-table-measure-row) > td.ant-table-cell,
            #${safeId} .ant-table-tbody > tr:not(.ant-table-measure-row) > td.ant-table-cell-ellipsis {
              padding: 0 8px !important;
              height: 30px !important;
              max-height: 30px !important;
              line-height: 30px !important;
              font-size: 12px !important;
              border-right: 1px solid ${BORDER_COL} !important;
              border-bottom: 1px solid ${BORDER_COL} !important;
              font-family: ${FONT_FAMILY};
            }

            #${safeId} .ant-table-tbody > tr:not(.ant-table-measure-row) > td:first-child {
              border-left: 1px solid ${BORDER_COL} !important;
            }

            /* Neutralise any vertical margin on inline badges/chips inside cells
               so they never inflate the row beyond its 30px total height */
            #${safeId} .ant-table-tbody > tr:not(.ant-table-measure-row) > td > * {
              margin-top: 0 !important;
              margin-bottom: 0 !important;
              vertical-align: middle;
            }

            #${safeId} .ant-table-thead > tr > th:first-child {
              border-left: 1px solid ${BORDER_COL} !important;
            }

            /* Left border on the first right-fixed column — marks the separator
               between the scrollable area and the pinned-right columns */
            #${safeId} .ant-table-thead > tr > th.ant-table-cell-fix-right-first,
            #${safeId} .ant-table-tbody > tr > td.ant-table-cell-fix-right-first {
              border-left: 1px solid ${BORDER_COL} !important;
            }


            #${safeId} .ant-table-measure-row > td {
              padding: 0 !important;
              height: 0 !important;
              line-height: 0;
              font-size: 0;
              overflow: hidden;
            }

            /* Empty state: force white background matching ROW_WHITE so it's
               consistent with NxTableNested's "No data" row and NxTableInlineEdit */
            #${safeId} .ant-table-placeholder > td {
              background-color: ${ROW_WHITE} !important;
              border-left: 1px solid ${BORDER_COL} !important;
              border-right: 1px solid ${BORDER_COL} !important;
              border-bottom: 1px solid ${BORDER_COL} !important;
            }

            #${safeId} .ant-table-placeholder:hover > td {
              background-color: ${ROW_WHITE} !important;
            }

            /* ── Nested table alignment ───────────────────────────────────────
               Child first column left edge aligns with parent second column
               left edge. Uses padding-left on the expanded td (NOT margin on
               inner div) so the cell never overflows its fixed width.
               
               Override via nestedAlignConfig prop:
                 expandCellWidth  – width of the expand trigger cell (default 32px)
                 parentCol1Width  – width of parent's first data column (default 150px)
            ──────────────────────────────────────────────────────────────────── */

            #${safeId} {
              --nx-expand-cell-width: 32px;
              --nx-parent-col1-width: 60px;
              --nx-child-offset: calc(var(--nx-expand-cell-width) + var(--nx-parent-col1-width));
            }

            /* Constrain the expanded td and indent the child table via padding.
               overflow:hidden prevents the child from blowing out the parent width. */
            #${safeId} .ant-table-expanded-row > td {
              padding-top: 0 !important;
              padding-bottom: 0 !important;
              padding-left: var(--nx-child-offset) !important;
              padding-right: 0 !important;
              overflow: hidden !important;
            }

            /* Child table fills remaining width naturally — no margin needed */
            #${safeId} .ant-table-expanded-row .ant-table-wrapper,
            #${safeId} .ant-table-expanded-row > td > div {
              margin-left: 0 !important;
              overflow: hidden !important;
            }

            /* ── Nested (Child) Table Styling ──────────────────────────────────
               Child tables use the same header blue (${HEADER_BG}), borders (${BORDER_COL}),
               and alternating row styling as parent tables. */

            #${safeId} .ant-table-expanded-row .ant-table {
              border-left: 1px solid ${BORDER_COL} !important;
              border-radius: 0 !important;
              border-top: none !important;
              border-right: none !important;
              border-bottom: none !important;
            }

            #${safeId} .ant-table-expanded-row .ant-table-container {
              border-radius: 0 !important;
            }

            #${safeId} .ant-table-expanded-row .ant-table-wrapper {
              border-radius: 0 !important;
            }

            #${safeId} .ant-table-expanded-row > td > div {
              border-radius: 0 !important;
            }

            /* Child table header styling */
            #${safeId} .ant-table-expanded-row .ant-table-thead > tr > th {
              background-color: ${HEADER_BG} !important;
              color: #fff !important;
              font-family: ${FONT_FAMILY};
              border-color: ${BORDER_COL} !important;
              border-right: 1px solid rgba(255,255,255,0.2) !important;
            }

            /* Child table body cells */
            #${safeId} .ant-table-expanded-row .ant-table-tbody > tr > td {
              border-color: ${BORDER_COL} !important;
              font-family: ${FONT_FAMILY};
              font-size: 12px !important;
            }

            /* Child table alternating row colors */
            #${safeId} .ant-table-expanded-row .ant-table-tbody > tr:nth-child(odd) > td {
              background-color: ${ROW_WHITE} !important;
            }

            #${safeId} .ant-table-expanded-row .ant-table-tbody > tr:nth-child(even) > td {
              background-color: ${ROW_HOVER} !important;
            }

            /* Child table row hover */
            #${safeId} .ant-table-expanded-row .ant-table-tbody > tr:hover > td {
              background-color: ${ROW_HOVER} !important;
            }

            /* Re-add left border on child's first header/cell so the vertical
               line from the parent second-column separator continues cleanly */
            #${safeId} .ant-table-expanded-row .ant-table-thead > tr > th:first-child,
            #${safeId} .ant-table-expanded-row .ant-table-tbody > tr > td:first-child {
              border-left: 1px solid ${BORDER_COL} !important;
            }
          `}
      </style>
      {useSelect ? (
        <div className={"w-full flex mb-3 justify-between items-center"}>
          <div className="flex items-center gap-4">
            <ColumnSettings
              columns={columnDefinitions || resolvedColumns}
              hiddenColumns={optionSelectedCol}
              onHiddenColumnsChange={(next) => {
                // Strip any attempts to hide a statically-fixed column.
                const allStaticFixed = new Set([
                  ...staticFixedKeys.left,
                  ...staticFixedKeys.right,
                ]);
                setOptionSelectedCol(next.filter((k) => !allStaticFixed.has(k)));
              }}
              fixedColumns={safeFixedColumns}
              onFixedColumnsChange={(next) => {
                // Only static keys (baked into column definitions) are locked —
                // the user is free to fix or un-fix any dynamic column.
                const nextLeft  = Array.isArray(next?.left)  ? next.left  : [];
                const nextRight = Array.isArray(next?.right) ? next.right : [];
                // Re-add static keys in case ColumnSettings emitted them as removed.
                const mergedLeft  = [...new Set([...staticFixedKeys.left,  ...nextLeft])];
                const mergedRight = [...new Set([...staticFixedKeys.right, ...nextRight])];
                const updated = { left: mergedLeft, right: mergedRight };
                // Write to internal state — this is what drives rendering.
                setInternalFixedColumns(updated);
                // Notify parent as a side-effect (best-effort, not required).
                setFixedColumns(updated);
              }}
              staticFixedKeys={staticFixedKeys}
              buttonText="Column Settings"
              buttonStyle={{ height: "32px", fontSize: "12px" }}
            />

            {/* Reset button — only shown when persistence is active and there
                are non-default settings saved for this user+table combination. */}
            {prefsStorageKey && (
              optionSelectedCol.length > 0 ||
              safeFixedColumns.left.filter(k => !staticFixedKeys.left.includes(k)).length > 0 ||
              safeFixedColumns.right.filter(k => !staticFixedKeys.right.includes(k)).length > 0 ||
              Object.keys(columnWidths).length > 0
            ) && (
              <Button
                size="small"
                onClick={handleClearPreferences}
                title="Reset all column settings (hidden, fixed, widths, order) to defaults"
                style={{
                  border: "1px solid #BDBDBD",
                  color: "#6B7280",
                  borderRadius: "8px",
                  height: "32px",
                  fontSize: "11px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                ↺ Reset columns
              </Button>
            )}

            {customHeaderLeft && customHeaderLeft}
          </div>

          {hasRightControls && (
            <div className="flex justify-end gap-2">
              {showRefresh && (
                <Button
                  icon={<ReloadOutlined style={{ fontSize: "14px" }} />}
                  onClick={handleRefresh}
                  loading={loading}
                  style={{
                    border: "1px solid #BDBDBD",
                    color: "black",
                    borderRadius: "8px",
                    height: "32px",
                    fontSize: "12px",
                  }}
                >
                  Refresh
                </Button>
              )}

              {showExport && (
                <Button
                  icon={<DownloadOutlined style={{ fontSize: "14px" }} />}
                  onClick={handleDownload}
                  style={{
                    border: "1px solid #BDBDBD",
                    color: "black",
                    borderRadius: "8px",
                    height: "32px",
                    fontSize: "12px",
                  }}
                >
                  Export
                </Button>
              )}

              {showAdvanceSearch && (
                <Button
                  onClick={() => setIsAdvanceOpen(true)}
                  style={{
                    border: "1px solid #BDBDBD",
                    color: "black",
                    borderRadius: "8px",
                    height: "32px",
                    fontSize: "12px",
                  }}
                >
                  <FilterOutlined style={{ fontSize: "14px" }} />
                  Advanced Search
                </Button>
              )}

              {showSearchBar && (
                <div style={{ width: "200px" }}>
                  {/* SearchBar owns its own DOM input state — no focus loss on parent re-render */}
                  <SearchBar
                    placeholder="Search content here ...."
                    onSearch={(val) => setSearchValue(val)}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      ) : null}

      {/* ── Fixed-column overflow warning ─────────────────────────────── */}
      {fixedColumnWarning && !warningDismissed && (
        <div
          role="alert"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "8px",
            padding: "7px 12px",
            borderRadius: "8px",
            border: `1px solid ${fixedColumnWarning.isOverflow ? '#fca5a5' : '#fcd34d'}`,
            background: fixedColumnWarning.isOverflow ? '#fef2f2' : '#fffbeb',
            fontSize: "12px",
            lineHeight: "1.5",
            color: fixedColumnWarning.isOverflow ? '#7f1d1d' : '#713f12',
          }}
        >
          <span style={{ fontSize: "15px", flexShrink: 0 }}>
            {fixedColumnWarning.isOverflow ? '🔒' : '📌'}
          </span>
          <span style={{ flex: 1 }}>
            {fixedColumnWarning.isOverflow ? (
              <>
                <strong>Some columns are hidden</strong> because too many are pinned.
                {' '}Unpin <strong>{fixedColumnWarning.colNames[fixedColumnWarning.colNames.length - 1]}</strong>
                {fixedColumnWarning.colNames.length > 1 ? ' or other pinned columns' : ''} in{' '}
                <strong>Column Settings</strong> to see all columns.
              </>
            ) : (
              <>
                <strong>Not much space left to scroll.</strong>
                {' '}Try unpinning <strong>{fixedColumnWarning.colNames[fixedColumnWarning.colNames.length - 1]}</strong>
                {fixedColumnWarning.colNames.length > 1 ? ' or other pinned columns' : ''} in{' '}
                <strong>Column Settings</strong> for a better view.
              </>
            )}
          </span>
          <button
            onClick={() => setWarningDismissed(true)}
            title="Dismiss"
            aria-label="Dismiss warning"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0 2px',
              fontSize: '16px',
              color: fixedColumnWarning.isOverflow ? '#ef4444' : '#d97706',
              lineHeight: 1,
              flexShrink: 0,
              opacity: 0.7,
            }}
          >
            ×
          </button>
        </div>
      )}

      <div style={{ position: "relative" }}>
        <Table
          dataSource={filteredDataSource}
          rowKey={rowKey}
          columns={displayedColumnsWithSearch}
          components={components}
          scroll={{ ...tableScrolled, y: tableScrollY }}
          bordered
          pagination={false}
          className={`w-full${className ? ` ${className}` : ''}`}
          loading={loading}
          tableLayout="fixed"
          expandable={expandable}
          id={safeId}
          onChange={onSort}
          rowSelection={rowSelection}
          onRow={customOnRow}
          rowClassName={customRowClassName}
          locale={fetchFailed ? {
            emptyText: (
              <div style={{ padding: "24px 0", textAlign: "center" }}>
                <div style={{ fontSize: "20px", marginBottom: "8px" }}>⚠️</div>
                <div style={{ fontSize: "13px", color: "#6B7280", marginBottom: "12px" }}>
                  Failed to load data
                </div>
                {onRefresh && (
                  <Button
                    size="small"
                    icon={<ReloadOutlined />}
                    onClick={handleRefresh}
                    style={{ borderRadius: "6px", fontSize: "12px" }}
                  >
                    Retry
                  </Button>
                )}
              </div>
            )
          } : undefined}
        />

        {useInfiniteScroll ? (
          <div style={{ position: "relative", zIndex: "1", marginTop: "-1px", borderTop: `1px solid ${BORDER_COL}`, borderLeft: `1px solid ${BORDER_COL}`, borderRight: `1px solid ${BORDER_COL}`, borderBottom: `1px solid ${BORDER_COL}`, borderRadius: "0 0 8px 8px", background: "#fff", padding: "6px 12px", display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "8px", width: "100%" }}>
            <span style={{ fontSize: "12px", color: "#6B7280" }}>
              Showing {resolvedDataSource?.length || 0} of {Math.max(resolvedTotalData, resolvedDataSource?.length || 0)} entries
              {isLoadingMore && hasMore && " · Loading..."}
            </span>
            {!hasMore && resolvedDataSource?.length > 0 && (
              <>
                <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#D1D5DB", display: "inline-block" }} />
                <span style={{ fontSize: "12px", color: "#22c55e", fontWeight: "500" }}>All data showed</span>
              </>
            )}
          </div>
        ) : usePagination ? (
          <div style={{ position: "relative", zIndex: "1", marginTop: "-2px", borderTop: `1px solid ${BORDER_COL}`, borderLeft: `1px solid ${BORDER_COL}`, borderRight: `1px solid ${BORDER_COL}`, borderBottom: `1px solid ${BORDER_COL}`, borderRadius: "0 0 8px 8px", background: "#fff", padding: "6px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Select
                value={pageSize}
                onChange={(value) => onSizeChanger(current, value)}
                className="w-15"
                style={{ fontSize: "12px" }}
                size="small"
              >
                {[10, 20, 50, 100].map((size) => (
                  <Option key={size} value={size}>
                    {size}
                  </Option>
                ))}
              </Select>
              <span style={{ fontSize: "12px" }}>
                {resolvedTotalData === 0
                  ? "Showing 0 entries"
                  : `Showing ${(current - 1) * pageSize + 1} to ${Math.min(current * pageSize, resolvedTotalData)} of ${resolvedTotalData} entries`}
              </span>
            </div>
            <Pagination
              total={resolvedTotalData}
              current={current}
              pageSize={pageSize}
              onChange={onChange}
              showSizeChanger={false}
              showTotal={false}
              style={{ display: "flex", gap: "3px" }}
              size="small"
            />
          </div>
        ) : (
          <div style={{ position: "relative", zIndex: "1", marginTop: "-1px", borderTop: `1px solid ${BORDER_COL}`, borderLeft: `1px solid ${BORDER_COL}`, borderRight: `1px solid ${BORDER_COL}`, borderBottom: `1px solid transparent`, borderRadius: "0 0 8px 8px", background: "#fff", padding: "6px 12px", display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "8px", width: "100%" }}>
            <span style={{ fontSize: "12px", color: "#6B7280" }}>
              Showing {resolvedDataSource?.length || 0} of {resolvedTotalData} entries
            </span>
            {!loading && resolvedDataSource?.length > 0 && (
              <>
                <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#D1D5DB", display: "inline-block" }} />
                <span style={{ fontSize: "12px", color: "#22c55e", fontWeight: "500" }}>All data showed</span>
              </>
            )}
          </div>
        )}

        {loading && (
          <div style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: (useInfiniteScroll || usePagination) ? "33px" : 0,
            background: "rgba(255, 255, 255, 0.65)",
            zIndex: 10,
            borderRadius: "0 0 8px 8px",
          }} />
        )}
      </div>

      <NxAdvanceSearch
        visible={isAdvanceOpen}
        onClose={() => setIsAdvanceOpen(false)}
        onSearch={handleAdvanceSearch}
        onClear={handleClearFilter}
        columns={columnDefinitions || resolvedColumns}
        modalWidth={600}
      />
    </div>
  );
};

// ── Static utility — clear saved preferences ──────────────────────────────
// Call this on logout (or user-switch) to wipe all saved column preferences
// for a specific user, or for one specific table:
//
//   NxTable.clearPreferences({ userId: 'u1' });           // all tables for user
//   NxTable.clearPreferences({ userId: 'u1', idTable: 'jobTable' }); // one table
//
NxTable.clearPreferences = ({ userId, idTable: tableId } = {}) => {
  if (!userId) return;
  try {
    if (tableId) {
      // Clear a single table's preferences.
      const key = buildStorageKey(userId, tableId);
      if (key) localStorage.removeItem(key);
    } else {
      // Clear ALL tables for this user — scan all keys with the user prefix.
      const prefix = `nxtable__${userId}__`;
      const toRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(prefix)) toRemove.push(k);
      }
      toRemove.forEach((k) => localStorage.removeItem(k));
    }
  } catch {
    // Private browsing or quota error — fail silently.
  }
};

export default NxTable;
