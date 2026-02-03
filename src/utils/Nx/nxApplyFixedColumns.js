/**
 * Apply fixed positions to columns based on fixedColumns configuration
 *
 * @param {import("antd/lib/table").ColumnProps[]} columns - Array of column definitions
 * @param {{ right: string[]; left: string[] }} fixedColumns - Object with columnKey: position mapping
 * @returns {Array} - Reordered columns with fixed positions applied
 *
 * Example:
 * const columns = [
 *   { key: 'id', title: 'ID', dataIndex: 'id' },
 *   { key: 'name', title: 'Name', dataIndex: 'name' },
 *   { key: 'action', title: 'Action', dataIndex: 'action' }
 * ];
 *
 * const fixedColumns = { left: ['id'], right: ['action'] };
 *
 * const result = nxApplyFixedColumns(columns, fixedColumns);
 * // Returns columns with 'id' fixed left and 'action' fixed right
 */
export const nxApplyFixedColumns = (columns, fixedColumns = {}) => {
  const leftFixed = [];
  const rightFixed = [];
  const normal = [];

  columns.forEach((col) => {
    const { right, left } = fixedColumns;

    const rightSet = new Set(right);
    const leftSet = new Set(left);
    const fixedPos = fixedColumns[col.key];
    const colWithFixed = { ...col, fixed: fixedPos || undefined };

    if (leftSet.has(col.key)) {
      leftFixed.push({
        ...col,
        fixed: "left",
      });
    } else if (rightSet.has(col.key)) {
      rightFixed.push({
        ...col,
        fixed: "right",
      });
    } else {
      normal.push(colWithFixed);
    }
  });

  return [...leftFixed, ...normal, ...rightFixed];
};
