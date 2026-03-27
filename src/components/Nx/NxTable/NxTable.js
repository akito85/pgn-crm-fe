// src/components/Nx/NxTable/NxTable.js
import React, { useMemo, useState, useCallback, startTransition } from 'react';
import { Table } from 'antd';
import { Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import './NxTable.css';

import useColumnPreferences   from './hooks/useColumnPreferences';
import useColumnLayout        from './hooks/useColumnLayout';
import useInfiniteScroll      from './hooks/useInfiniteScroll';
import useAutoHeight          from './hooks/useAutoHeight';
import useRowSelection        from './hooks/useRowSelection';
import useKeyboardNav         from './hooks/useKeyboardNav';
import ResizableTitle         from './features/ResizableTitle';
import NxTableToolbar         from './layouts/NxTableToolbar';
import NxTableFooter          from './layouts/NxTableFooter';
import NxAdvanceSearch        from '../NxAdvanceSearch';

// Fix 1.5: module-level monotonic counter as UUID fallback.
// Date.now() at 100k rows in a tight map() produces duplicate millisecond
// timestamps. A counter is O(1) and collision-free.
let _uid = 0;
const uid = () => `nx-${++_uid}`;

const NxTable = ({
  idTable,
  userId,
  persistPreferences = true,
  dataSource,
  rowKey = (record) => record.id,
  dataMain,
  columns = [],
  columnMain,
  pageSize = 10,
  current = 1,
  loading,
  onChange = () => {},
  onSizeChanger = () => {},
  totalData = 0,
  onDelete,            // eslint-disable-line no-unused-vars
  rowSelection,
  onRowClicked, // eslint-disable-line no-unused-vars
  tableScrolled = { y: 380 },
  expandable,          // kept in signature only for the deprecation warning
  className,
  useSelect = true,
  usePagination = true,
  useInfiniteScroll: useInfiniteScrollProp = false,
  onLoadMore = () => {},
  hasMore = false,
  loadMoreThreshold = 20, // eslint-disable-line no-unused-vars
  onSort = () => {},
  handleDownload = () => {},
  columnDefinitions,
  fixedColumns = { left: [], right: [] },
  setFixedColumns = () => {},
  onAdvanceSearch = () => {},
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
  onRowClick = () => {},
  components: externalComponents,
  nestedAlignConfig = {},
  autoHeight = true,
  fetchFailed = false,
  onInitialLoad,
  onClearPreferences,
}) => {
  // ── Dev warnings ────────────────────────────────────────────────────────
  if (process.env.NODE_ENV !== 'production') {
    if (expandable !== undefined) {
      console.warn('[NxTable] `expandable` is not supported — use NxTableNested for expandable rows. AntD virtual rendering is incompatible with expandable rows.');
    }
    if (onDelete !== undefined) {
      console.warn('[NxTable] `onDelete` prop is unused and will be removed in a future version.');
    }
    if (onRowClicked !== undefined) {
      console.warn('[NxTable] `onRowClicked` is deprecated — use `onRowClick` instead.');
    }
    if (loadMoreThreshold !== 20) {
      console.warn('[NxTable] `loadMoreThreshold` is no longer used. Infinite scroll uses a scroll listener.');
    }
    if (!idTable) {
      console.warn('[NxTable] The `idTable` prop is required. CSS scoping and scroll behaviour will not work correctly without it.');
    }
  }

  const safeId = idTable || 'nx-table-fallback';
  const containerRef = React.useRef(null);

  // Fix 8.3 / 7.3: memoize resolved aliases so downstream memos receive
  // stable references even when the parent re-renders with the same data.
  const resolvedColumns = useMemo(
    () => columns.length > 0 ? columns : (columnMain || []),
    [columns, columnMain]
  );
  const resolvedDataSource = useMemo(
    () => dataSource || dataMain || [],
    [dataSource, dataMain]
  );
  const resolvedTotalData = (totalData != null) ? totalData : (resolvedDataSource.length || 0);

  const tableScrollYProp = tableScrolled?.y ?? 380;

  // ── Column preferences ────────────────────────────────────────────────────
  const {
    write: writePrefs,
    initHiddenColumns,
    initFixedColumns,
    initColumnWidths,
    initColumnOrder,
    storageKey: prefsStorageKey,
  } = useColumnPreferences({
    userId:           persistPreferences ? userId : null,
    idTable:          persistPreferences ? idTable : null,
    fixedColumnsProp: fixedColumns,
  });

  // ── Column layout ─────────────────────────────────────────────────────────
  const {
    optionSelectedCol,
    setOptionSelectedCol,
    columnWidths,
    setColumnWidths,
    columnOrder,
    setColumnOrder,
    internalFixedColumns,
    setInternalFixedColumns,
    safeFixedColumns,
    staticFixedKeys,
    displayedColumns,
  } = useColumnLayout({
    resolvedColumns,
    fixedColumnsProp: fixedColumns,
    initHiddenColumns,
    initFixedColumns,
    initColumnWidths,
    initColumnOrder,
  });

  // ── Auto height + container width ─────────────────────────────────────────
  const { dynamicScrollY, containerWidth } = useAutoHeight({
    autoHeight,
    tableScrollYProp,
    useInfiniteScroll: useInfiniteScrollProp,
    usePagination,
    useSelect,
    containerRef,
  });
  const tableScrollY = dynamicScrollY;

  // ── Keyboard navigation ───────────────────────────────────────────────────
  useKeyboardNav({ safeId, containerRef });

  // ── Row selection ─────────────────────────────────────────────────────────
  const { clickedRowKey, customOnRow, customRowClassName } = useRowSelection({
    rowKey,
    onRow,
    enableRowClick,
    onRowClick,
    rowClassName,
    selectedRowKey,
  });

  // ── Stable ID map (avoids UUID re-generation on every render) ─────────────
  const stableIdMapRef = React.useRef(new Map());
  const prevDataSourceRef = React.useRef(resolvedDataSource);
  // Fix 3.2: clear map when dataSource reference changes entirely (full reset).
  // Between appends (same reference), no pruning — the Map grows by one entry
  // per append. Eliminates the O(n) Set construction on every data change.
  if (prevDataSourceRef.current !== resolvedDataSource) {
    prevDataSourceRef.current = resolvedDataSource;
    stableIdMapRef.current.clear();
  }

  // Fix 5.3: skip spread for rows that already have an id (common case).
  const resolvedDataSourceWithKeys = useMemo(() => {
    if (!Array.isArray(resolvedDataSource)) return [];
    return resolvedDataSource.map((item) => {
      if (item.id) return item;  // Fix 5.3: no spread — return original reference
      if (!stableIdMapRef.current.has(item)) {
        stableIdMapRef.current.set(
          item,
          crypto?.randomUUID ? crypto.randomUUID() : uid()  // Fix 1.5: monotonic counter fallback
        );
      }
      return { ...item, id: stableIdMapRef.current.get(item) };
    });
  }, [resolvedDataSource]);

  // ── Search ────────────────────────────────────────────────────────────────
  const [searchValue, setSearchValue] = useState('');

  // Fix 4.6: stable callback — SearchBar (React.memo) does not re-render on parent changes.
  // Fix 5.1: startTransition marks the re-render as non-urgent, keeping browser responsive
  //          during the O(n*c) filter computation at 100k rows.
  const handleSearch = useCallback((val) => {
    startTransition(() => setSearchValue(val));
  }, []);

  // Fix 7.1 / 5.2: searchRef lets render functions read the current search value
  // without being recreated on every keystroke. displayedColumnsWithSearch memo
  // is eliminated — column render functions are now stable across search changes.
  const searchRef = React.useRef(searchValue);
  React.useEffect(() => { searchRef.current = searchValue; }, [searchValue]);

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

  const highlightText = useCallback((text, search) => {
    if (!search || text === null || text === undefined) return text;
    const str = String(text);
    const lower = str.toLowerCase();
    const sq = search.toLowerCase();
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
    const chars = [];
    let qi = 0;
    for (let i = 0; i < str.length; i++) {
      if (qi < sq.length && str[i].toLowerCase() === sq[qi]) {
        chars.push(<span key={i} style={{ color: '#1976D2', fontWeight: 700, textDecoration: 'underline' }}>{str[i]}</span>);
        qi++;
      } else {
        chars.push(str[i]);
      }
    }
    return <>{chars}</>;
  }, []);

  // Fix 7.1 / 5.2: stable column render functions — searchValue changes do NOT
  // rebuild the column array. highlightText reads from searchRef.current.
  const displayedColumnsWithSearch = useMemo(() => {
    if (!searchValue) return displayedColumns;
    const processColumnForSearch = (col) => {
      const originalRender = col.render;
      const newCol = {
        ...col,
        // Capture searchRef (not searchValue) — function reference is stable.
        render: (text, record, index) => {
          const renderedValue = originalRender ? originalRender(text, record, index) : text;
          if (typeof renderedValue === 'string') {
            return highlightText(renderedValue, searchRef.current);
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
  // Note: searchValue in deps ensures memo rebuilds when search is cleared (returns displayedColumns).
  // The render function itself reads searchRef.current, so it remains accurate without rebuilding.

  // ── Client-side search filter ──────────────────────────────────────────────
  const filteredDataSource = useMemo(() => {
    if (!searchValue) return resolvedDataSourceWithKeys;
    return resolvedDataSourceWithKeys.filter((row) =>
      resolvedColumns.some((col) => {
        const value = row[col.dataIndex || col.key];
        const str = String(value || '').toLowerCase();
        const sq = searchValue.toLowerCase();
        return str.includes(sq) || fuzzyMatch(str, sq);
      })
    );
  }, [resolvedDataSourceWithKeys, resolvedColumns, searchValue, fuzzyMatch]);

  // ── Infinite scroll ───────────────────────────────────────────────────────
  // Disabled while fuzzy search is active: the search bar is a client-side
  // quick filter for already-loaded data. Fewer visible rows make Phase B's
  // scroll threshold fire immediately, causing an infinite load loop.
  // When search is cleared the hook re-enables and Phase A resumes from fill.
  // For searching across all server data, users should use Advanced Search.
  const { isLoadingMore } = useInfiniteScroll({
    useInfiniteScroll: useInfiniteScrollProp && !searchValue,
    safeId,
    containerRef,
    hasMore,
    onLoadMore,
    filteredDataLength: resolvedDataSourceWithKeys.length,
    tableScrollY,
    virtual: true,
  });

  // ── Persist preferences ───────────────────────────────────────────────────
  // Fix 4.1: hasMountedRef guard skips the first invocation (mount-time write
  // causes a localStorage read→write loop with no observable benefit).
  const hasMountedRef = React.useRef(false);
  React.useEffect(() => {
    if (!hasMountedRef.current) { hasMountedRef.current = true; return; }
    writePrefs({
      hiddenColumns: optionSelectedCol,
      fixedColumns:  internalFixedColumns,
      columnWidths,
      columnOrder,
    });
  }, [optionSelectedCol, internalFixedColumns, columnWidths, columnOrder, writePrefs]);

  // ── Initial load guarantee ────────────────────────────────────────────────
  const hasTriggeredInitialLoad = React.useRef(false);
  // Fix: Detect data reset (non-empty → empty) and re-trigger initial load
  const dataWasResetRef = React.useRef(false);
  // Fix 2.2: loading and resolvedDataSource.length added to deps so the mount
  // snapshot cannot capture a stale loading=false from before RTK Query resolves.
  React.useEffect(() => {
    // Detect data reset: non-empty → empty transition (indicates refresh/delete)
    const dataWasCleared =
      prevDataSourceRef.current.length > 0 &&
      resolvedDataSource.length === 0;

    if (dataWasCleared) {
      hasTriggeredInitialLoad.current = false;
      dataWasResetRef.current = true;
    }

    // Note: prevDataSourceRef.current is updated by the stable ID map logic above

    if (
      !hasTriggeredInitialLoad.current &&
      !loading &&
      resolvedDataSource.length === 0 &&
      !fetchFailed &&
      typeof onInitialLoad === 'function'
    ) {
      hasTriggeredInitialLoad.current = true;
      dataWasResetRef.current = false;
      onInitialLoad();
    }
  }, [loading, resolvedDataSource.length, fetchFailed, onInitialLoad]); // Fix 2.2: full deps

  // ── Stable callbacks for toolbar ──────────────────────────────────────────
  // Fix 4.5: extracted from inline JSX lambdas — ColumnSettings (React.memo)
  // now receives stable references and does not re-render on parent state changes.
  const handleHiddenColumnsChange = useCallback((next) => {
    const allStaticFixed = new Set([...staticFixedKeys.left, ...staticFixedKeys.right]);
    setOptionSelectedCol(next.filter((k) => !allStaticFixed.has(k)));
  }, [staticFixedKeys, setOptionSelectedCol]);

  const handleFixedColumnsChange = useCallback((next) => {
    const nextLeft  = Array.isArray(next?.left)  ? next.left  : [];
    const nextRight = Array.isArray(next?.right) ? next.right : [];
    const mergedLeft  = [...new Set([...staticFixedKeys.left,  ...nextLeft])];
    const mergedRight = [...new Set([...staticFixedKeys.right, ...nextRight])];
    const updated = { left: mergedLeft, right: mergedRight };
    setInternalFixedColumns(updated);
    setFixedColumns(updated);
  }, [staticFixedKeys, setInternalFixedColumns, setFixedColumns]);

  const handleRefresh = useCallback(() => {
    if (onRefresh) onRefresh();
    else window.location.reload();
  }, [onRefresh]);

  // ── Clear preferences ─────────────────────────────────────────────────────
  const handleClearPreferences = useCallback(() => {
    setOptionSelectedCol([]);
    setColumnWidths({});
    setColumnOrder([]);
    setInternalFixedColumns({
      left:  Array.isArray(fixedColumns?.left)  ? [...fixedColumns.left]  : [],
      right: Array.isArray(fixedColumns?.right) ? [...fixedColumns.right] : [],
    });
    if (prefsStorageKey) {
      try { localStorage.removeItem(prefsStorageKey); } catch {}
    }
    onClearPreferences?.();
  }, [fixedColumns, prefsStorageKey, onClearPreferences, setOptionSelectedCol, setColumnWidths, setColumnOrder, setInternalFixedColumns]);

  // ── Advanced search ───────────────────────────────────────────────────────
  const [isAdvanceOpen, setIsAdvanceOpen] = useState(false);

  const handleAdvanceSearch = useCallback((searchData) => {
    onAdvanceSearch(searchData);
    setIsAdvanceOpen(false);
  }, [onAdvanceSearch]);

  const handleClearFilter = useCallback(() => {
    onAdvanceSearch(null);
  }, [onAdvanceSearch]);

  // ── Fixed-column overflow warning ──────────────────────────────────────────
  const fixedColumnWarning = useMemo(() => {
    if (containerWidth <= 0 || displayedColumns.length === 0) return null;
    const leftCols  = displayedColumns.filter((c) => c.fixed === 'left');
    const rightCols = displayedColumns.filter((c) => c.fixed === 'right');
    const fixedCols = [...leftCols, ...rightCols];
    if (fixedCols.length === 0) return null;
    const totalFixed = fixedCols.reduce((sum, c) => sum + (c.width || 150), 0);
    const SCROLL_MIN = 80;
    const remaining  = containerWidth - totalFixed;
    if (remaining >= SCROLL_MIN) return null;
    const colNames = fixedCols.map((c) => c.title || c.key || c.dataIndex || '—').filter(Boolean);
    const overflowPx = Math.max(0, totalFixed - containerWidth);
    const side = leftCols.length > 0 && rightCols.length > 0 ? 'left & right'
               : leftCols.length > 0 ? 'left' : 'right';
    return { colNames, totalFixed, containerWidth: Math.round(containerWidth), overflowPx: Math.round(overflowPx), remaining: Math.round(remaining), side, isOverflow: remaining < 0 };
  }, [displayedColumns, containerWidth]);

  const [warningDismissed, setWarningDismissed] = React.useState(false);
  const prevWarningKeyRef = React.useRef('');
  React.useEffect(() => {
    // Fix 1.6: key on colNames only — excludes totalFixed which changes on
    // every resize, causing the warning to re-appear after every resize event.
    const key = fixedColumnWarning ? fixedColumnWarning.colNames.join(',') : '';
    if (key !== prevWarningKeyRef.current) {
      prevWarningKeyRef.current = key;
      setWarningDismissed(false);
    }
  }, [fixedColumnWarning]);

  // Fix 4.4: components wrapped in useMemo — AntD reference-checks this
  // to decide whether to remount the table header. Previously a new object
  // was created on every render, triggering a header remount every time.
  const components = useMemo(() => ({
    header: {
      ...(externalComponents?.header || {}),
      cell: externalComponents?.header?.cell ?? ResizableTitle,
    },
    ...(externalComponents?.body ? { body: externalComponents.body } : {}),
  }), [externalComponents]);

  return (
    <div
      ref={containerRef}
      className="nx-table flex flex-col w-full"
      style={{
        ...(nestedAlignConfig.expandCellWidth !== undefined && { '--nx-expand-cell-width': nestedAlignConfig.expandCellWidth }),
        ...(nestedAlignConfig.parentCol1Width  !== undefined && { '--nx-parent-col1-width': nestedAlignConfig.parentCol1Width }),
        ...(nestedAlignConfig.parentCol2Width  !== undefined && { '--nx-parent-col2-width': nestedAlignConfig.parentCol2Width }),
      }}
    >
      {useSelect && (
        <NxTableToolbar
          columnDefinitions={columnDefinitions}
          resolvedColumns={resolvedColumns}
          optionSelectedCol={optionSelectedCol}
          onHiddenColumnsChange={handleHiddenColumnsChange}
          safeFixedColumns={safeFixedColumns}
          onFixedColumnsChange={handleFixedColumnsChange}
          staticFixedKeys={staticFixedKeys}
          prefsStorageKey={prefsStorageKey}
          columnWidths={columnWidths}
          handleClearPreferences={handleClearPreferences}
          customHeaderLeft={customHeaderLeft}
          showExport={showExport}
          showAdvanceSearch={showAdvanceSearch}
          showSearchBar={showSearchBar}
          showRefresh={showRefresh}
          loading={loading}
          handleRefresh={handleRefresh}
          handleDownload={handleDownload}
          onSearch={handleSearch}
          setIsAdvanceOpen={setIsAdvanceOpen}
        />
      )}

      {fixedColumnWarning && !warningDismissed && (
        <div
          role="alert"
          style={{
            display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px',
            padding: '7px 12px', borderRadius: '8px',
            border: `1px solid ${fixedColumnWarning.isOverflow ? '#fca5a5' : '#fcd34d'}`,
            background: fixedColumnWarning.isOverflow ? '#fef2f2' : '#fffbeb',
            fontSize: '12px', lineHeight: '1.5',
            color: fixedColumnWarning.isOverflow ? '#7f1d1d' : '#713f12',
          }}
        >
          <span style={{ fontSize: '15px', flexShrink: 0 }}>
            {fixedColumnWarning.isOverflow ? '🔒' : '📌'}
          </span>
          <span style={{ flex: 1 }}>
            {fixedColumnWarning.isOverflow ? (
              <>
                <strong>Some columns are hidden</strong> because too many are pinned.{' '}
                Unpin <strong>{fixedColumnWarning.colNames[fixedColumnWarning.colNames.length - 1]}</strong>
                {fixedColumnWarning.colNames.length > 1 ? ' or other pinned columns' : ''} in{' '}
                <strong>Column Settings</strong> to see all columns.
              </>
            ) : (
              <>
                <strong>Not much space left to scroll.</strong>{' '}
                Try unpinning <strong>{fixedColumnWarning.colNames[fixedColumnWarning.colNames.length - 1]}</strong>
                {fixedColumnWarning.colNames.length > 1 ? ' or other pinned columns' : ''} in{' '}
                <strong>Column Settings</strong> for a better view.
              </>
            )}
          </span>
          <button
            onClick={() => setWarningDismissed(true)}
            title="Dismiss"
            aria-label="Dismiss warning"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 2px', fontSize: '16px',
                     color: fixedColumnWarning.isOverflow ? '#ef4444' : '#d97706', lineHeight: 1, flexShrink: 0, opacity: 0.7 }}
          >
            ×
          </button>
        </div>
      )}

      <div style={{ position: 'relative' }}>
        <Table
          virtual
          dataSource={filteredDataSource}
          rowKey={rowKey}
          columns={displayedColumnsWithSearch}
          components={components}
          scroll={{ ...tableScrolled, y: tableScrollY }}
          pagination={false}
          className={`w-full${className ? ` ${className}` : ''}`}
          loading={loading}
          tableLayout="fixed"
          id={safeId}
          onChange={onSort}
          rowSelection={rowSelection}
          onRow={customOnRow}
          rowClassName={customRowClassName}
          locale={fetchFailed ? {
            emptyText: (
              <div style={{ padding: '24px 0', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', marginBottom: '8px' }}>⚠️</div>
                <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '12px' }}>Failed to load data</div>
                {onRefresh && (
                  <Button size="small" icon={<ReloadOutlined />} onClick={handleRefresh} style={{ borderRadius: '6px', fontSize: '12px' }}>
                    Retry
                  </Button>
                )}
              </div>
            ),
          } : undefined}
        />

        <NxTableFooter
          useInfiniteScroll={useInfiniteScrollProp}
          usePagination={usePagination}
          loading={loading}
          isLoadingMore={isLoadingMore}
          hasMore={hasMore}
          resolvedDataSource={resolvedDataSource}
          filteredCount={filteredDataSource.length}
          isFiltering={!!searchValue}
          resolvedTotalData={resolvedTotalData}
          current={current}
          pageSize={pageSize}
          onChange={onChange}
          onSizeChanger={onSizeChanger}
          handleRefresh={handleRefresh}
          onRefresh={onRefresh}
        />

        {loading && (
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: (useInfiniteScrollProp || usePagination) ? '33px' : 0,
            background: 'rgba(255, 255, 255, 0.65)',
            zIndex: 10,
            borderRadius: '0 0 8px 8px',
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

export default NxTable;
