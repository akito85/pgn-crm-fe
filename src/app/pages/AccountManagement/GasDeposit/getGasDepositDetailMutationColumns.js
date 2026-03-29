import NxDate from "../../../../components/Nx/NxDatePicker";
import { getColumnSearchPropsUseFilteredValue } from "../../../../utils/getColumnSearchProps";

/**
 * Returns the column definitions for the Gas Deposit Detail Mutation table.
 *
 * Each column includes search/filter props via `getColumnSearchPropsUseFilteredValue`
 * for server-side filtering, with `filteredValue` set per column. Sorting is handled
 * server-side via `sorter: true`. The mutationDate column is formatted as "DD MMM YYYY".
 * Numeric columns (m3, mscf, mmbtu, price, amount) use right-aligned text.
 *
 * @param {Object} search - Current active search/filter values keyed by column dataIndex.
 * @param {React.RefObject} searchInput - Ref to the search input element (used for focus).
 * @param {string} searchedColumn - The dataIndex of the column currently being searched.
 * @param {string} searchText - The current search text value.
 * @param {Function} handleSearch - Callback invoked when a search/filter is confirmed.
 * @returns {Array<Object>} Array of Ant Design column definition objects.
 */
const getGasDepositDetailMutationColumns = (
  search,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
) => [
  {
    key: "no",
    title: "NO",
    align: "center",
    dataIndex: "no",
    width: 40,
    render: (_, __, index) => index + 1,
  },
  {
    key: "period",
    title: "PERIOD",
    dataIndex: "period",
    width: 200,
    sorter: true,
    align: "center",
    filteredValue: [search?.period] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "period",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "mutationDate",
    title: "MUTATION DATE",
    dataIndex: "mutationDate",
    width: 200,
    align: "center",
    filteredValue: [search?.mutationDate] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "mutationDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date"
    ),
    render: (date) => NxDate.formatDate(date, "DD MMM YYYY"),
  },
  {
    key: "type",
    title: "TYPE",
    dataIndex: "type",
    width: 100,
    filteredValue: [search?.type] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "type",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
  },
  {
    key: "source",
    title: "SOURCE",
    dataIndex: "source",
    width: 200,
    filteredValue: [search?.source] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "source",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
  },
  {
    key: "m3",
    title: "M3",
    dataIndex: "m3",
    width: 150,
    align: "right",
    filteredValue: [search?.m3] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "m3",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
  },
  {
    key: "mscf",
    title: "MSCF",
    dataIndex: "mscf",
    width: 150,
    align: "right",
    filteredValue: [search?.mscf] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "mscf",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "mmbtu",
    title: "MMBTU",
    dataIndex: "mmbtu",
    width: 150,
    align: "right",
    filteredValue: [search?.mmbtu] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "mmbtu",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "price",
    title: "PRICE",
    dataIndex: "price",
    width: 200,
    align: "right",
    filteredValue: [search?.price] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "price",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "amount",
    title: "AMOUNT",
    dataIndex: "amount",
    width: 200,
    align: "right",
    filteredValue: [search?.amount] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "amount",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "remark",
    title: "REMARK",
    dataIndex: "remark",
    width: 300,
    filteredValue: [search?.remark] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "remark",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
];

export { getGasDepositDetailMutationColumns };
