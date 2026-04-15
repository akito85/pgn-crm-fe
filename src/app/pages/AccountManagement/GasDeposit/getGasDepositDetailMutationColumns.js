import NxDate from "../../../../components/Nx/NxDatePicker";
import { getColumnSearchPropsUseFilteredValue } from "../../../../utils/getColumnSearchProps";

/**
 * Returns the column definitions for the Gas Deposit Detail Mutation table.
 *
 * @param {Object}          params                - Column configuration options.
 * @param {Object}          params.search         - Current active search/filter values keyed by column dataIndex.
 * @param {React.RefObject} params.searchInput    - Ref to the search input element (used for focus).
 * @param {string}          params.searchedColumn - The dataIndex of the column currently being searched.
 * @param {string}          params.searchText     - The current search text value.
 * @param {Function}        params.handleSearch   - Callback invoked when a search/filter is confirmed.
 * @returns {Array<Object>} Array of Ant Design column definition objects.
 */
const getGasDepositDetailMutationColumns = ({
  search,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
}) => [
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
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "period",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "mutationDate",
    title: "MUTATION DATE",
    dataIndex: "mutationDate",
    width: 200,
    align: "center",
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
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "type",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "source",
    title: "SOURCE",
    dataIndex: "source",
    width: 200,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "source",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "m3",
    title: "M3",
    dataIndex: "m3",
    width: 150,
    align: "right",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "m3",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "mscf",
    title: "MSCF",
    dataIndex: "mscf",
    width: 150,
    align: "right",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "mscf",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "mmbtu",
    title: "MMBTU",
    dataIndex: "mmbtu",
    width: 150,
    align: "right",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "mmbtu",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "price",
    title: "PRICE",
    dataIndex: "price",
    width: 200,
    align: "right",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "price",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "amount",
    title: "AMOUNT",
    dataIndex: "amount",
    width: 200,
    align: "right",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "amount",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "remark",
    title: "REMARK",
    dataIndex: "remark",
    width: 300,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "remark",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
];

export { getGasDepositDetailMutationColumns };
