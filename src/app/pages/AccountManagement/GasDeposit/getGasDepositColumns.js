import { toTitleCase } from "../../../../utils";
import { getColumnSearchPropsUseFilteredValue } from "../../../../utils/getColumnSearchProps";
import StatusComponent from "../../../../components/StatusComponent";
import NxDate from "../../../../components/Nx/NxDatePicker";

/**
 * Returns the column definitions for the Gas Deposit table.
 *
 * Each column includes search/filter props via `getColumnSearchPropsUseFilteredValue`.
 * Date columns (earnPeriodStart, earnPeriodEnd, redeemPeriodStart, redeemPeriodEnd) are
 * formatted as "DD MMM YYYY". Status columns are conditionally included based on `includeStatus`.
 *
 * @param {Object} search - Current active search/filter values keyed by column dataIndex.
 * @param {React.RefObject} searchInput - Ref to the search input element (used for focus).
 * @param {string} searchedColumn - The dataIndex of the column currently being searched.
 * @param {string} searchText - The current search text value.
 * @param {Function} handleSearch - Callback invoked when a search/filter is confirmed.
 * @param {boolean} [includeStatus=true] - Whether to include the statusApproval and status columns.
 * @returns {Array<Object>} Array of Ant Design column definition objects.
 */
const getGasDepositColumns = ({
  search,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
  includeStatus = true,
  isUnderAccount = false,
}) => [
  {
    key: "no",
    title: "NO",
    align: "center",
    dataIndex: "no",
    width: 40,
    render: (_, __, index) => index + 1,
  },
  !isUnderAccount && {
    key: "accountNumber",
    title: "ACCOUNT NUMBER",
    dataIndex: "accountNumber",
    width: 200,
    sorter: true,
    align: "right ",
    filteredValue: [search?.accountNumber] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "accountNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  !isUnderAccount && {
    key: "accountName",
    title: "ACCOUNT NAME",
    dataIndex: "accountName",
    width: 200,
    sorter: true,
    filteredValue: [search?.accountName] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "accountName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "earnPeriodStart",
    title: "EARN PERIOD START",
    dataIndex: "earnPeriodStart",
    width: 180,
    align: "center",
    filteredValue: [search?.earnPeriodStart] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "earnPeriodStart",
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
    key: "earnPeriodEnd",
    title: "EARN PERIOD END",
    dataIndex: "earnPeriodEnd",
    width: 180,
    align: "center",
    filteredValue: [search?.earnPeriodEnd] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "earnPeriodEnd",
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
    key: "redeemPeriodStart",
    title: "REDEEM PERIOD START",
    dataIndex: "redeemPeriodStart",
    width: 200,
    align: "center",
    filteredValue: [search?.redeemPeriodStart] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "redeemPeriodStart",
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
    key: "redeemPeriodEnd",
    title: "REDEEM PERIOD END",
    dataIndex: "redeemPeriodEnd",
    width: 200,
    align: "center",
    filteredValue: [search?.redeemPeriodEnd] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "redeemPeriodEnd",
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
    key: "currency",
    title: "CURRENCY",
    dataIndex: "currency",
    width: 120,
    sorter: true,
    align: "center",
    filteredValue: [search?.currency] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "currency",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "balanceM3",
    title: "BALANCE (M3)",
    dataIndex: "balanceM3",
    width: 150,
    sorter: true,
    align: "center",
    filteredValue: [search?.balanceM3] || null,
    ...getColumnSearchPropsUseFilteredValue(
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
    sorter: true,
    align: "center",
    filteredValue: [search?.balanceMscf] || null,
    ...getColumnSearchPropsUseFilteredValue(
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
    sorter: true,
    align: "center",
    filteredValue: [search?.balanceMmbtu] || null,
    ...getColumnSearchPropsUseFilteredValue(
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
    sorter: true,
    align: "center",
    filteredValue: [search?.balanceAmount] || null,
    ...getColumnSearchPropsUseFilteredValue(
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
    sorter: true,
    align: "center",
    filteredValue: [search?.availableAmount] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "availableAmount",
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
    width: 200,
    sorter: true,
    align: "center",
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
  includeStatus && {
    key: "statusApproval",
    title: "STATUS APPROVAL",
    dataIndex: "statusApproval",
    width: 170,
    sorter: true,
    align: "center",
    filteredValue: [search?.statusApproval] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "statusApproval",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (status) => {
      const displayText = {
        "approved": "Approved",
        "waitingApproval": "Waiting Approval",
        "pending": "Pending",
        "rejected": "Rejected",
        "WAITING_APPROVAL": "Waiting Approval",
        "WAITING_FOR_APPROVAL": "Waiting Approval",
      };
      return (
        <div className="flex justify-center">
          <StatusComponent colour={status}>
            {displayText[status] || toTitleCase(String(status || "")) || "-"}
          </StatusComponent>
        </div>
      );
    },
  },
  includeStatus && {
    key: "status",
    title: "STATUS",
    dataIndex: "status",
    width: 120,
    sorter: true,
    filteredValue: [search?.status] || null,
    ...getColumnSearchPropsUseFilteredValue(
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

export { getGasDepositColumns };
