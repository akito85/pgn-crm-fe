// src/components/Nx/NxTable/hooks/useRowSelection.js
import React, { useState, useCallback, useEffect } from 'react';

const useRowSelection = ({ rowKey, onRow, enableRowClick, onRowClick, rowClassName, selectedRowKey }) => {
  const [clickedRowKey, setClickedRowKey] = useState(null);

  // Fix 7.2 / 9.7: ref avoids rebuilding customRowClassName on every click.
  // Previously clickedRowKey was in the useCallback dep array, causing all
  // visible rows to re-render on every click.
  const clickedRowKeyRef = React.useRef(clickedRowKey);
  useEffect(() => { clickedRowKeyRef.current = clickedRowKey; }, [clickedRowKey]);

  useEffect(() => {
    if (selectedRowKey !== null) {
      setClickedRowKey(selectedRowKey);
    }
  }, [selectedRowKey]);

  // Fix 1.4: local variable renamed to clickedKey to avoid shadowing the
  // rowKey prop (which is a function). Derived by calling the prop when it is
  // a function, matching how AntD derives the row key internally.
  const handleRowClick = useCallback(
    (record) => {
      const clickedKey = typeof rowKey === 'function'
        ? rowKey(record)
        : (record.key || record.recordId || record.id);
      setClickedRowKey(clickedKey);
      onRowClick(record, clickedKey);
    },
    [rowKey, onRowClick]
  );

  const customOnRow = useCallback(
    (record, index) => {
      const baseOnRow = onRow ? onRow(record, index) : {};
      return {
        ...baseOnRow,
        onClick: (event) => {
          if (baseOnRow.onClick) baseOnRow.onClick(event);
          if (enableRowClick) handleRowClick(record);
        },
        style: {
          ...baseOnRow.style,
          cursor: enableRowClick ? 'pointer' : (baseOnRow.style?.cursor || 'default'),
          transition: 'background-color 0.2s ease',
        },
      };
    },
    [onRow, enableRowClick, handleRowClick]
  );

  // Fix 7.2: clickedRowKey removed from dep array — read via ref instead.
  // customRowClassName reference is now stable across row clicks, preventing
  // all-row re-renders.
  const customRowClassName = useCallback(
    (record, index) => {
      const recordKey = typeof rowKey === 'function'
        ? rowKey(record)
        : (record.key || record.recordId || record.id);
      const isSelected = enableRowClick && clickedRowKeyRef.current === recordKey;
      const base =
        typeof rowClassName === 'function'
          ? rowClassName(record, index)
          : rowClassName || '';
      return `${base} ${isSelected ? 'row-selected' : ''}`.trim();
    },
    [rowKey, rowClassName, enableRowClick] // clickedRowKey intentionally excluded — read via ref
  );

  return { clickedRowKey, customOnRow, customRowClassName };
};

export default useRowSelection;
