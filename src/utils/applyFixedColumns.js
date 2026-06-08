import React from "react";

/**
 * Apply fixed positions to columns based on fixedColumns configuration
 *
 * @param {Array} columns - Array of column definitions
 * @param {Object} fixedColumns - Object with columnKey: position mapping
 * @returns {Array} - Reordered columns with fixed positions applied
 *
 * Example:
 * const columns = [
 *   { key: 'id', title: 'ID', dataIndex: 'id' },
 *   { key: 'name', title: 'Name', dataIndex: 'name' },
 *   { key: 'action', title: 'Action', dataIndex: 'action' }
 * ];
 *
 * const fixedColumns = { id: 'left', action: 'right' };
 *
 * const result = applyFixedColumns(columns, fixedColumns);
 * // Returns columns with 'id' fixed left and 'action' fixed right
 */
export const applyFixedColumns = (columns, fixedColumns = {}) => {
  // Support two shapes for fixedColumns:
  // 1) mapping: { columnKey: 'left' | 'right' }
  // 2) grouped arrays: { left: [colKey], right: [colKey] }

  const leftFixed = [];
  const rightFixed = [];
  const normal = [];

  // Build lookup map for columns by key
  const colsByKey = new Map(columns.map((c) => [c.key || c.dataIndex || c.title, c]));

  // If fixedColumns has left/right arrays, respect their order
  if (fixedColumns && (Array.isArray(fixedColumns.left) || Array.isArray(fixedColumns.right))) {
    const leftKeys = Array.isArray(fixedColumns.left) ? fixedColumns.left : [];
    const rightKeys = Array.isArray(fixedColumns.right) ? fixedColumns.right : [];

    // Add left fixed in requested order
    leftKeys.forEach((key) => {
      const col = colsByKey.get(key);
      if (col) leftFixed.push({ ...col, fixed: "left" });
    });

    // Add normal columns (those not in left or right), in original order
    columns.forEach((col) => {
      const key = col.key || col.dataIndex || col.title;
      if (!leftKeys.includes(key) && !rightKeys.includes(key)) {
        normal.push({ ...col, fixed: undefined });
      }
    });

    // Add right fixed in requested order
    rightKeys.forEach((key) => {
      const col = colsByKey.get(key);
      if (col) rightFixed.push({ ...col, fixed: "right" });
    });

    return [...leftFixed, ...normal, ...rightFixed];
  }

  // Fallback: fixedColumns is a mapping { key: 'left'|'right' }
  columns.forEach((col) => {
    const key = col.key || col.dataIndex || col.title;
    const fixedPos = fixedColumns[key];
    const colWithFixed = { ...col, fixed: fixedPos || undefined };

    if (fixedPos === "left") {
      leftFixed.push(colWithFixed);
    } else if (fixedPos === "right") {
      rightFixed.push(colWithFixed);
    } else {
      normal.push(colWithFixed);
    }
  });

  return [...leftFixed, ...normal, ...rightFixed];
};

/**
 * Hook to manage fixed columns state
 *
 * @param {Object} initialFixedColumns - Initial fixed columns configuration
 * @returns {Object} - { fixedColumns, setFixedColumns, applyToColumns }
 *
 * Example:
 * const { fixedColumns, setFixedColumns, applyToColumns } = useFixedColumns({
 *   invoiceNumber: 'left'
 * });
 *
 * const processedColumns = applyToColumns(myColumns);
 */
export const useFixedColumns = (initialFixedColumns = {}) => {
  const [fixedColumns, setFixedColumns] = React.useState(initialFixedColumns);

  const applyToColumns = React.useCallback(
    (columns) => applyFixedColumns(columns, fixedColumns),
    [fixedColumns]
  );

  return {
    fixedColumns,
    setFixedColumns,
    applyToColumns,
  };
};
