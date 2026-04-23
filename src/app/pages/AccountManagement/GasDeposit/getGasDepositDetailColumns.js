import { toTitleCase } from "../../../../utils";
import { getColumnSearchPropsUseFilteredValueFE } from "../../../../utils/getColumnSearchProps";
import StatusComponent from "../../../../components/StatusComponent";
import NxDate from "../../../../components/Nx/NxDatePicker";
import { sorterFunction } from "../../../../utils/sorterFunction";

/**
 * Returns the column definitions for the Gas Deposit Detail table.
 *
 * @param {Object}          params                      - Column configuration options.
 * @param {Object}          params.search               - Current active search/filter values keyed by column dataIndex.
 * @param {React.RefObject} params.searchInput          - Ref to the search input element (used for focus).
 * @param {string}          params.searchedColumn       - The dataIndex of the column currently being searched.
 * @param {string}          params.searchText           - The current search text value.
 * @param {Function}        params.handleSearch         - Callback invoked when a search/filter is confirmed.
 * @param {boolean}         [params.includeStatus=true] - When false, omits the status column.
 * @returns {Array<Object>} Array of Ant Design column definition objects.
 */
const getGasDepositDetailColumns = ({
  search,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
  includeStatus = true,
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
    width: 180,
    align: "center",
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "period",
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
    key: "balanceM3",
    title: "BALANCE (M3)",
    dataIndex: "balanceM3",
    width: 150,
    align: "right",
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "balanceM3",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "balanceMscf",
    title: "BALANCE (MSCF)",
    dataIndex: "balanceMscf",
    width: 160,
    align: "right",
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "balanceMscf",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "balanceMmbtu",
    title: "BALANCE (MMBTU)",
    dataIndex: "balanceMmbtu",
    width: 170,
    align: "right",
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "balanceMmbtu",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "balanceAmount",
    title: "BALANCE AMOUNT",
    dataIndex: "balanceAmount",
    width: 170,
    align: "right",
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "balanceAmount",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "availableAmount",
    title: "AVAILABLE AMOUNT",
    dataIndex: "availableAmount",
    width: 180,
    align: "right",
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "availableAmount",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  includeStatus && {
    key: "status",
    title: "STATUS",
    dataIndex: "status",
    width: 120,
    fixed: "right",
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "status",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (status) => {
      const displayText = {
        "active": "Active",
        "inactive": "Inactive",
      };

      return (
        <div className={" flex justify-center"}>
          <StatusComponent colour={status}>
            {displayText[status] || toTitleCase(String(status || "")) || "-"}
          </StatusComponent>
        </div>
      )
    },
  },
].filter(Boolean);

export { getGasDepositDetailColumns };
