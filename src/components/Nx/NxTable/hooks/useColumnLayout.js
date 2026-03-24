// src/components/Nx/NxTable/hooks/useColumnLayout.js
import React, { useState, useCallback, useMemo } from 'react';
import { DEFAULT_COL_WIDTH } from '../constants';

const useColumnLayout = ({
  resolvedColumns,
  fixedColumnsProp,
  initHiddenColumns,
  initFixedColumns,
  initColumnWidths,
  initColumnOrder,
}) => {
  // ── Column visibility ────────────────────────────────────────────────────
  const [optionSelectedCol, setOptionSelectedCol] = useState(() => initHiddenColumns);

  // ── Column widths ────────────────────────────────────────────────────────
  const [columnWidths, setColumnWidths] = useState(() => initColumnWidths);

  // ── Column order ─────────────────────────────────────────────────────────
  // Fix 4.3: lazy-initialise from resolvedColumns when initColumnOrder is empty,
  // avoiding the mount-time state update that triggered a 3-render cascade.
  const [columnOrder, setColumnOrder] = useState(() =>
    initColumnOrder.length > 0 ? initColumnOrder : getAllColumnKeys(resolvedColumns)
  );

  // ── Fixed columns (internal) ─────────────────────────────────────────────
  const [internalFixedColumns, setInternalFixedColumns] = useState(() => initFixedColumns);

  const safeFixedColumns = useMemo(() => ({
    left:  Array.isArray(internalFixedColumns.left)  ? internalFixedColumns.left  : [],
    right: Array.isArray(internalFixedColumns.right) ? internalFixedColumns.right : [],
  }), [internalFixedColumns]);

  // ── Static fixed keys ─────────────────────────────────────────────────────
  const staticFixedKeys = useMemo(() => {
    const left = [];
    const right = [];
    const traverse = (cols) => {
      cols.forEach((col) => {
        if (!col) return;
        const key = col.key || col.dataIndex || col.title;
        if (!key) return;
        if (col.fixed === 'left' || col.fixed === true)  left.push(key);
        if (col.fixed === 'right') right.push(key);
        if (col.children) traverse(col.children);
      });
    };
    traverse(resolvedColumns);
    return { left, right };
  }, [resolvedColumns]);

  // Fix 4.2: merge the two separate setInternalFixedColumns effects into one.
  // Previously a parent prop change caused two effects to fire in the same
  // commit, triggering two re-renders with stale intermediate state.
  //
  // Fix: initialise both refs to the actual mount-time values so the effect is
  // a no-op on the first render.  Without this, the effect always sees a
  // "change" on mount ('' !== real sig) and resets internalFixedColumns to the
  // prop value, discarding any preferences loaded from localStorage.
  const prevFixedColsSigRef = React.useRef(null);
  const prevStaticFixedRef  = React.useRef(null);
  if (prevFixedColsSigRef.current === null) {
    prevFixedColsSigRef.current = (fixedColumnsProp?.left ?? []).join(',') + '|' + (fixedColumnsProp?.right ?? []).join(',');
  }
  if (prevStaticFixedRef.current === null) {
    prevStaticFixedRef.current = JSON.stringify(staticFixedKeys);
  }
  React.useEffect(() => {
    // Fix 5.4: join-based sig instead of JSON.stringify for performance.
    const propSig    = (fixedColumnsProp?.left ?? []).join(',') + '|' + (fixedColumnsProp?.right ?? []).join(',');
    const staticSig  = JSON.stringify(staticFixedKeys);
    const propChanged    = propSig   !== prevFixedColsSigRef.current;
    const staticChanged  = staticSig !== prevStaticFixedRef.current;

    if (!propChanged && !staticChanged) return;

    prevFixedColsSigRef.current = propSig;
    prevStaticFixedRef.current  = staticSig;

    setInternalFixedColumns((prev) => {
      const prevSafe = {
        left:  Array.isArray(prev?.left)  ? prev.left  : [],
        right: Array.isArray(prev?.right) ? prev.right : [],
      };

      // Merge prop-driven fixed columns.
      const propLeft  = propChanged && Array.isArray(fixedColumnsProp?.left)  ? [...fixedColumnsProp.left]  : prevSafe.left;
      const propRight = propChanged && Array.isArray(fixedColumnsProp?.right) ? [...fixedColumnsProp.right] : prevSafe.right;

      // Merge static (definition-baked) fixed columns.
      const mergedLeft  = [...new Set([...staticFixedKeys.left,  ...propLeft])];
      const mergedRight = [...new Set([...staticFixedKeys.right, ...propRight])];

      if (
        mergedLeft.join(',')  === prevSafe.left.join(',') &&
        mergedRight.join(',') === prevSafe.right.join(',')
      ) return prev;

      return { left: mergedLeft, right: mergedRight };
    });
  }, [fixedColumnsProp, staticFixedKeys]);

  // ── Column order sync ─────────────────────────────────────────────────────
  // Fix: initialise to the mount-time keys so the effect is a no-op on the
  // first render, preserving the column order loaded from localStorage.
  // Without this the effect always fires on mount ('' !== current keys) and
  // resets columnOrder to the definition order, losing the saved preference.
  const prevColumnKeysRef = React.useRef(null);
  if (prevColumnKeysRef.current === null) {
    prevColumnKeysRef.current = resolvedColumns && resolvedColumns.length > 0
      ? getAllColumnKeys(resolvedColumns).join(',')
      : '';
  }
  React.useEffect(() => {
    if (!resolvedColumns || resolvedColumns.length === 0) return;
    const allKeys  = getAllColumnKeys(resolvedColumns);
    const nextKeys = allKeys.join(',');
    if (nextKeys === prevColumnKeysRef.current) return;
    prevColumnKeysRef.current = nextKeys;
    setColumnOrder(allKeys);
    const keySet = new Set(allKeys);
    setOptionSelectedCol((prev) => prev.filter((k) => keySet.has(k)));
  }, [resolvedColumns]);

  // ── Drag state ───────────────────────────────────────────────────────────
  const [draggedColumnKey, setDraggedColumnKey] = useState(null);
  const draggedColumnKeyRef = React.useRef(draggedColumnKey);
  React.useEffect(() => { draggedColumnKeyRef.current = draggedColumnKey; }, [draggedColumnKey]);

  const handleDragStart = useCallback((e, columnKey) => {
    setDraggedColumnKey(columnKey);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', columnKey);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    return false;
  }, []);

  const handleDrop = useCallback((e, targetColumnKey) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggedColumnKey && draggedColumnKey !== targetColumnKey) {
      setColumnOrder((prevOrder) => {
        const newOrder = [...prevOrder];
        const draggedIndex = newOrder.indexOf(draggedColumnKey);
        const targetIndex  = newOrder.indexOf(targetColumnKey);
        if (draggedIndex !== -1 && targetIndex !== -1) {
          newOrder.splice(draggedIndex, 1);
          newOrder.splice(targetIndex, 0, draggedColumnKey);
        }
        return newOrder;
      });
    }
    setDraggedColumnKey(null);
    return false;
  }, [draggedColumnKey]);

  const handleDragEnd = useCallback(() => {
    setDraggedColumnKey(null);
  }, []);

  // ── Resize handler cache ─────────────────────────────────────────────────
  const resizeHandlerMapRef = React.useRef({});
  const handleResize = useCallback((key) => {
    if (!resizeHandlerMapRef.current[key]) {
      resizeHandlerMapRef.current[key] = (newWidth) => {
        setColumnWidths((prev) => ({ ...prev, [key]: newWidth }));
      };
    }
    return resizeHandlerMapRef.current[key];
  }, []);

  // Fix 3.3: prune against getAllColumnKeys(resolvedColumns) — includes columns
  // that were never resized (no entry in columnWidths) but have been removed.
  React.useEffect(() => {
    const currentKeys = new Set(getAllColumnKeys(resolvedColumns));
    Object.keys(resizeHandlerMapRef.current).forEach((k) => {
      if (!currentKeys.has(k)) delete resizeHandlerMapRef.current[k];
    });
  }, [resolvedColumns]);

  // ── processColumn ─────────────────────────────────────────────────────────
  const processColumn = useCallback(
    (col, fixedPos = null) => {
      const colKey = col.key || col.dataIndex || col.title;

      if (col.children && Array.isArray(col.children)) {
        return {
          ...col,
          key: colKey,
          children: col.children.map((c) => processColumn(c, fixedPos)),
        };
      }

      let textAlign = 'left';
      if (col.isNumber || col.align === 'right')  textAlign = 'right';
      else if (col.isClassification)              textAlign = 'center';

      const isDraggable = !fixedPos && !col.fixed;
      const width = columnWidths[colKey] || col.width || DEFAULT_COL_WIDTH;

      const newCol = {
        ...col,
        key: colKey,
        width,
        align: col.align || textAlign,
        ellipsis: { showTitle: true },
        onHeaderCell: (column) => {
          const baseStyle = {
            textTransform: 'uppercase',
            fontSize: '10px',
            cursor: isDraggable ? 'move' : 'default',
          };
          if (isDraggable && draggedColumnKeyRef.current === colKey) {
            baseStyle.opacity = 0.5;
            baseStyle.backgroundColor = '#f0f0f0';
          }
          return {
            width: columnWidths[colKey] || col.width || DEFAULT_COL_WIDTH,
            onResize: handleResize(colKey),
            style: baseStyle,
            draggable: isDraggable,
            onDragStart: isDraggable ? (e) => handleDragStart(e, colKey) : undefined,
            onDragOver:  isDraggable ? handleDragOver : undefined,
            onDrop:      isDraggable ? (e) => handleDrop(e, colKey) : undefined,
            onDragEnd:   isDraggable ? handleDragEnd : undefined,
          };
        },
        onCell: (record, index) => {
          const externalOnCell = col.onCell ? col.onCell(record, index) : {};
          return {
            ...externalOnCell,
            style: {
              textAlign,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              fontSize: '12px',
              ...(externalOnCell.style || {}),
            },
          };
        },
      };

      if (fixedPos)      newCol.fixed = fixedPos;
      else if (!col.fixed) delete newCol.fixed;

      return newCol;
    },
    [columnWidths, handleResize, handleDragStart, handleDragOver, handleDrop, handleDragEnd]
  );

  // ── displayedColumns memo ─────────────────────────────────────────────────
  const displayedColumns = useMemo(() => {
    const cols = (resolvedColumns || []).filter(Boolean).map((c) => ({
      ...c,
      key: c.key || c.dataIndex || c.title,
    }));

    const allStaticFixed = new Set([...staticFixedKeys.left, ...staticFixedKeys.right]);

    const filterHidden = (columns) =>
      columns
        .map((col) => {
          const colKey = col.key || col.dataIndex || col.title;
          if (!allStaticFixed.has(colKey) && optionSelectedCol.includes(colKey)) return null;
          if (col.children && Array.isArray(col.children)) {
            const filteredChildren = filterHidden(col.children);
            if (filteredChildren.length === 0) return null;
            return { ...col, children: filteredChildren };
          }
          return col;
        })
        .filter(Boolean);

    let visible = filterHidden(cols);
    if (visible.length === 0 && cols.length > 0) visible = [cols[0]];

    const ordered = columnOrder.length > 0
      ? [...visible].sort((a, b) => {
          const ia = columnOrder.indexOf(a.key);
          const ib = columnOrder.indexOf(b.key);
          if (ia === -1) return 1;
          if (ib === -1) return -1;
          return ia - ib;
        })
      : [...visible];

    const leftFixed = [];
    const rightFixed = [];
    const normal = [];

    ordered.forEach((col) => {
      const isLeftFixed =
        safeFixedColumns.left.includes(col.key) ||
        staticFixedKeys.left.includes(col.key) ||
        col.fixed === 'left' ||
        col.fixed === true;
      const isRightFixed =
        safeFixedColumns.right.includes(col.key) ||
        staticFixedKeys.right.includes(col.key) ||
        col.fixed === 'right';

      if (isLeftFixed)       leftFixed.push(col);
      else if (isRightFixed) rightFixed.push(col);
      else                   normal.push(col);
    });

    if (normal.length === 0 && (leftFixed.length > 0 || rightFixed.length > 0)) {
      if (leftFixed.length > 0) normal.push(leftFixed.pop());
      else                      normal.push(rightFixed.shift());
    }

    return [
      ...leftFixed.map((c) => processColumn(c, 'left')),
      ...normal.map((c) => processColumn(c, undefined)),
      ...rightFixed.map((c) => processColumn(c, 'right')),
    ];
  }, [resolvedColumns, optionSelectedCol, safeFixedColumns, staticFixedKeys, columnOrder, processColumn]);

  return {
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
    draggedColumnKey,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
  };
};

// ── Helper: collect all column keys recursively ───────────────────────────
function getAllColumnKeys(cols) {
  const keys = [];
  const traverse = (columns) => {
    columns.forEach((col) => {
      const key = col.key || col.dataIndex || col.title;
      if (key) keys.push(key);
      if (col.children && Array.isArray(col.children)) traverse(col.children);
    });
  };
  traverse(cols || []);
  return keys;
}

export { getAllColumnKeys };
export default useColumnLayout;
