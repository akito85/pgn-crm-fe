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
  const leftFixed = [];
  const rightFixed = [];
  const normal = [];

  columns.forEach((col) => {
    const fixedPos = fixedColumns[col.key];
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
