import { getRelationshipColumns } from "./getRelationshipColumns";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../../utils/getColumnSearchProps";

/**
 * Returns column definitions for the standalone relationship list.
 * Prepends Subject Account and Subject Customer columns to the base set.
 * The base set is identical to the account-scoped list.
 *
 * @param {Object} params - Same params accepted by getRelationshipColumns, plus handlers.
 */
export const getStandaloneRelationshipColumns = (params) => {
  const baseColumns = getRelationshipColumns(params);

  const { search, searchInput, searchedColumn, searchText, handleSearch } = params;

  const subjectAccountCol = {
    title: "SUBJECT ACCOUNT",
    dataIndex: "subjectName",
    key: "subjectName",
    width: 200,
    ...getColumnSearchPropsUseFilteredValue(
      "subjectName", searchInput, searchedColumn, searchText, handleSearch, () => {}
    ),
    render: (val) => val?.toUpperCase?.() || val || "-",
  };

  const subjectCustomerCol = {
    title: "SUBJECT NUMBER",
    dataIndex: "subjectNumber",
    key: "subjectNumber",
    width: 160,
    ...getColumnSearchPropsUseFilteredValue(
      "subjectNumber", searchInput, searchedColumn, searchText, handleSearch, () => {}
    ),
    render: (val) => val || "-",
  };

  // Insert subject columns after the NO column (index 0)
  return [baseColumns[0], subjectAccountCol, subjectCustomerCol, ...baseColumns.slice(1)];
};
