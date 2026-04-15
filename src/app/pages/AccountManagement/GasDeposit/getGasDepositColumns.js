import { toTitleCase } from "../../../../utils";
import { getColumnSearchPropsUseFilteredValue, getColumnSearchPropsUseFilteredValueFE } from "../../../../utils/getColumnSearchProps";
import StatusComponent from "../../../../components/StatusComponent";
import NxDate from "../../../../components/Nx/NxDatePicker";

/**
 * Returns the column definitions for the Gas Deposit table.
 *
 * @param {Object}          params                        - Column configuration options.
 * @param {Object}          params.search                 - Current active search/filter values keyed by column dataIndex.
 * @param {React.RefObject} params.searchInput            - Ref to the search input element (used for focus).
 * @param {string}          params.searchedColumn         - The dataIndex of the column currently being searched.
 * @param {string}          params.searchText             - The current search text value.
 * @param {Function}        params.handleSearch           - Callback invoked when a search/filter is confirmed.
 * @param {boolean}         [params.isApproval=false]     - When true, fixes the NO column left and shows the statusApproval column.
 * @param {boolean}         [params.isUnderAccount=false] - When true, omits the accountNumber and accountName columns.
 * @param {boolean}         [params.isFrontEnd=false]     - When true, uses client-side search/filter props.
 * @returns {Array<Object>} Array of Ant Design column definition objects.
 */
const getGasDepositColumns = ({
  search,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
  isApproval = false,
  isUnderAccount = false,
  isFrontEnd = false,
}) => [
  {
    key: "no",
    title: "NO",
    align: "center",
    dataIndex: "no",
    width: 40,
    fixed: isApproval ? "left" : undefined,
    render: (_, __, index) => index + 1,
  },
  !isUnderAccount && {
    key: "accountNumber",
    title: "ACCOUNT NUMBER",
    dataIndex: "accountNumber",
    width: 200,
    sorter: true,
    align: "right ",
    ...(isFrontEnd ? getColumnSearchPropsUseFilteredValueFE : getColumnSearchPropsUseFilteredValue)(
      search,
      "accountNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  !isUnderAccount && {
    key: "accountName",
    title: "ACCOUNT NAME",
    dataIndex: "accountName",
    width: 200,
    sorter: true,
    ...(isFrontEnd ? getColumnSearchPropsUseFilteredValueFE : getColumnSearchPropsUseFilteredValue)(
      search,
      "accountName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "earnPeriodStart",
    title: "EARN PERIOD START",
    dataIndex: "earnPeriodStart",
    width: 180,
    sorter: true,
    align: "center",
    ...(isFrontEnd ? getColumnSearchPropsUseFilteredValueFE : getColumnSearchPropsUseFilteredValue)(
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
    sorter: true,
    align: "center",
    ...(isFrontEnd ? getColumnSearchPropsUseFilteredValueFE : getColumnSearchPropsUseFilteredValue)(
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
    sorter: true,
    align: "center",
    ...(isFrontEnd ? getColumnSearchPropsUseFilteredValueFE : getColumnSearchPropsUseFilteredValue)(
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
    sorter: true,
    align: "center",
    ...(isFrontEnd ? getColumnSearchPropsUseFilteredValueFE : getColumnSearchPropsUseFilteredValue)(
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
    ...(isFrontEnd ? getColumnSearchPropsUseFilteredValueFE : getColumnSearchPropsUseFilteredValue)(
      search,
      "currency",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "balanceM3",
    title: "BALANCE (M3)",
    dataIndex: "balanceM3",
    width: 150,
    sorter: true,
    align: "center",
    ...(isFrontEnd ? getColumnSearchPropsUseFilteredValueFE : getColumnSearchPropsUseFilteredValue)(
      search,
      "balanceM3",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "balanceMscf",
    title: "BALANCE (MSCF)",
    dataIndex: "balanceMscf",
    width: 160,
    sorter: true,
    align: "center",
    ...(isFrontEnd ? getColumnSearchPropsUseFilteredValueFE : getColumnSearchPropsUseFilteredValue)(
      search,
      "balanceMscf",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "balanceMmbtu",
    title: "BALANCE (MMBTU)",
    dataIndex: "balanceMmbtu",
    width: 170,
    sorter: true,
    align: "center",
    ...(isFrontEnd ? getColumnSearchPropsUseFilteredValueFE : getColumnSearchPropsUseFilteredValue)(
      search,
      "balanceAmount",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "balanceAmount",
    title: "BALANCE AMOUNT",
    dataIndex: "balanceAmount",
    width: 170,
    sorter: true,
    align: "center",
    ...(isFrontEnd ? getColumnSearchPropsUseFilteredValueFE : getColumnSearchPropsUseFilteredValue)(
      search,
      "balanceAmount",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "availableAmount",
    title: "AVAILABLE AMOUNT",
    dataIndex: "availableAmount",
    width: 180,
    sorter: true,
    align: "center",
    ...(isFrontEnd ? getColumnSearchPropsUseFilteredValueFE : getColumnSearchPropsUseFilteredValue)(
      search,
      "availableAmount",
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
    width: 200,
    sorter: true,
    align: "center",
    ...(isFrontEnd ? getColumnSearchPropsUseFilteredValueFE : getColumnSearchPropsUseFilteredValue)(
      search,
      "remark",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  isApproval && {
    key: "statusApproval",
    title: "STATUS APPROVAL",
    dataIndex: "statusApproval",
    width: 170,
    sorter: true,
    align: "center",
    fixed: "right",
    ...(isFrontEnd ? getColumnSearchPropsUseFilteredValueFE : getColumnSearchPropsUseFilteredValue)(
      search,
      "statusApproval",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
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
  {
    key: "status",
    title: "STATUS",
    dataIndex: "status",
    width: 120,
    sorter: true,
    fixed: "right",
    ...(isFrontEnd ? getColumnSearchPropsUseFilteredValueFE : getColumnSearchPropsUseFilteredValue)(
      search,
      "status",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
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
