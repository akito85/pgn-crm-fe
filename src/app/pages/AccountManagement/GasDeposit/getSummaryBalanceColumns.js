import { toTitleCase } from "../../../../utils";
import { getColumnSearchPropsUseFilteredValue, getColumnSearchPropsUseFilteredValueFE } from "../../../../utils/getColumnSearchProps";
import NxDate from "../../../../components/Nx/NxDatePicker";
import NxStatusComponent from "../../../../components/Nx/NxStatusComponent";

/**
 * Returns the column definitions for the Summary Balance table.
 *
 * @param {Object}          params                        - Column configuration options.
 * @param {Object}          params.search                 - Current active search/filter values keyed by column dataIndex.
 * @param {React.RefObject} params.searchInput            - Ref to the search input element (used for focus).
 * @param {string}          params.searchedColumn         - The dataIndex of the column currently being searched.
 * @param {string}          params.searchText             - The current search text value.
 * @param {Function}        params.handleSearch           - Callback invoked when a search/filter is confirmed.
 * @param {boolean}         [params.isApproval=false]     - When true, fixes the NO column left and shows the statusApproval column.
 * @param {boolean}         [params.includeStatus=true]   - When false, hide the status and statusApproval columns.
 * @param {boolean}         [params.isFrontEnd=false]     - When true, uses client-side search/filter props.
 * @returns {Array<Object>} Array of Ant Design column definition objects.
 */
const getSummaryBalanceColumns = ({
  search,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
  isApproval = false,
  includeStatus = true,
  isFrontEnd = false,
}) => [
  {
    key: "no",
    title: "NO",
    align: "center",
    dataIndex: "no",
    width: 50,
    fixed: isApproval ? "left" : undefined,
    render: (_, __, index) => index + 1,
  },
  {
    key: "termsEarn",
    title: "TERMS EARN",
    dataIndex: "termsEarn",
    width: 150,
    sorter: true,
    align: "center",
    ...(isFrontEnd ? getColumnSearchPropsUseFilteredValueFE : getColumnSearchPropsUseFilteredValue)(
      search,
      "termsEarn",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
  },
  {
    key: "termsRedeem",
    title: "TERMS REDEEM",
    dataIndex: "termsRedeem",
    width: 150,
    sorter: true,
    align: "center",
    ...(isFrontEnd ? getColumnSearchPropsUseFilteredValueFE : getColumnSearchPropsUseFilteredValue)(
      search,
      "termsRedeem",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
  },
  {
    key: "periodEarn",
    title: "PERIOD EARN",
    dataIndex: "periodEarn",
    width: 150,
    sorter: true,
    align: "center",
    ...(isFrontEnd ? getColumnSearchPropsUseFilteredValueFE : getColumnSearchPropsUseFilteredValue)(
      search,
      "periodEarn",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "dateFormal"
    ),
    render: (date) => NxDate.formatDate(date, "DD MMM YYYY"),
  },
  {
    title: "PERIOD REDEEM",
    width: 150,
    children: [
      {
        key: "redeemPeriodStart",
        title: "START",
        dataIndex: "redeemPeriodStart",
        width: 150,
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
          "dateFormal"
        ),
        render: (date) => NxDate.formatDate(date, "DD MMM YYYY"),
      },
      {
        key: "redeemPeriodEnd",
        title: "END",
        dataIndex: "redeemPeriodEnd",
        width: 150,
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
          "dateFormal"
        ),
        render: (date) => NxDate.formatDate(date, "DD MMM YYYY"),
      },
    ]
  },
  {
    key: "billingPeriod",
    title: "BILLING PERIOD",
    dataIndex: "billingPeriod",
    width: 150,
    sorter: true,
    align: "center",
    ...(isFrontEnd ? getColumnSearchPropsUseFilteredValueFE : getColumnSearchPropsUseFilteredValue)(
      search,
      "billingPeriod",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "timeUnit",
    title: "TIME UNIT",
    dataIndex: "timeUnit",
    width: 150,
    sorter: true,
    align: "center",
    ...(isFrontEnd ? getColumnSearchPropsUseFilteredValueFE : getColumnSearchPropsUseFilteredValue)(
      search,
      "timeUnit",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "currency",
    title: "CURRENCY",
    dataIndex: "currency",
    width: 150,
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
    key: "uom",
    title: "UOM",
    dataIndex: "uom",
    width: 150,
    sorter: true,
    align: "center",
    ...(isFrontEnd ? getColumnSearchPropsUseFilteredValueFE : getColumnSearchPropsUseFilteredValue)(
      search,
      "uom",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "quantity",
    title: "QUANTITY",
    dataIndex: "quantity",
    width: 150,
    sorter: true,
    align: "center",
    ...(isFrontEnd ? getColumnSearchPropsUseFilteredValueFE : getColumnSearchPropsUseFilteredValue)(
      search,
      "quantity",
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
    width: 150,
    sorter: true,
    align: "center",
    ...(isFrontEnd ? getColumnSearchPropsUseFilteredValueFE : getColumnSearchPropsUseFilteredValue)(
      search,
      "amount",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "cashBalance",
    title: "CASH BALANCE",
    dataIndex: "cashBalance",
    width: 150,
    sorter: true,
    align: "center",
    ...(isFrontEnd ? getColumnSearchPropsUseFilteredValueFE : getColumnSearchPropsUseFilteredValue)(
      search,
      "cashBalance",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "type",
    title: "TYPE",
    dataIndex: "type",
    width: 150,
    sorter: true,
    align: "center",
    ...(isFrontEnd ? getColumnSearchPropsUseFilteredValueFE : getColumnSearchPropsUseFilteredValue)(
      search,
      "type",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "accountType",
    title: "ACCOUNT TYPE",
    dataIndex: "accountType",
    width: 160,
    sorter: true,
    align: "center",
    ...(isFrontEnd ? getColumnSearchPropsUseFilteredValueFE : getColumnSearchPropsUseFilteredValue)(
      search,
      "accountType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "classificationType",
    title: "CLASSIFICATION TYPE",
    dataIndex: "classificationType",
    width: 160,
    sorter: true,
    align: "center",
    ...(isFrontEnd ? getColumnSearchPropsUseFilteredValueFE : getColumnSearchPropsUseFilteredValue)(
      search,
      "classificationType",
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
    width: 160,
    sorter: true,
    align: "center",
    ...(isFrontEnd ? getColumnSearchPropsUseFilteredValueFE : getColumnSearchPropsUseFilteredValue)(
      search,
      "source",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "sapCustId",
    title: "SAP CUST ID",
    dataIndex: "sapCustId",
    width: 160,
    sorter: true,
    align: "center",
    ...(isFrontEnd ? getColumnSearchPropsUseFilteredValueFE : getColumnSearchPropsUseFilteredValue)(
      search,
      "sapCustId",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "period",
    title: "PERIOD",
    dataIndex: "period",
    width: 160,
    sorter: true,
    align: "center",
    ...(isFrontEnd ? getColumnSearchPropsUseFilteredValueFE : getColumnSearchPropsUseFilteredValue)(
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
    width: 160,
    sorter: true,
    align: "center",
    ...(isFrontEnd ? getColumnSearchPropsUseFilteredValueFE : getColumnSearchPropsUseFilteredValue)(
      search,
      "mutationDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "mutationType",
    title: "MUTATION TYPE",
    dataIndex: "mutationType",
    width: 160,
    sorter: true,
    align: "center",
    ...(isFrontEnd ? getColumnSearchPropsUseFilteredValueFE : getColumnSearchPropsUseFilteredValue)(
      search,
      "mutationType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "category",
    title: "CATEGORY",
    dataIndex: "category",
    width: 160,
    sorter: true,
    align: "center",
    ...(isFrontEnd ? getColumnSearchPropsUseFilteredValueFE : getColumnSearchPropsUseFilteredValue)(
      search,
      "category",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "volume",
    title: "VOLUME",
    dataIndex: "volume",
    width: 160,
    sorter: true,
    align: "center",
    ...(isFrontEnd ? getColumnSearchPropsUseFilteredValueFE : getColumnSearchPropsUseFilteredValue)(
      search,
      "volume",
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
    width: 160,
    sorter: true,
    align: "center",
    ...(isFrontEnd ? getColumnSearchPropsUseFilteredValueFE : getColumnSearchPropsUseFilteredValue)(
      search,
      "price",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "detailType",
    title: "DETAIL TYPE",
    dataIndex: "detailType",
    width: 160,
    sorter: true,
    align: "center",
    ...(isFrontEnd ? getColumnSearchPropsUseFilteredValueFE : getColumnSearchPropsUseFilteredValue)(
      search,
      "detailType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "description",
    title: "DESCRIPTION",
    dataIndex: "description",
    width: 160,
    sorter: true,
    align: "center",
    ...(isFrontEnd ? getColumnSearchPropsUseFilteredValueFE : getColumnSearchPropsUseFilteredValue)(
      search,
      "description",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  includeStatus && {
    key: "status",
    title: "STATUS",
    dataIndex: "status",
    width: 150,
    fixed: "right",
    render: (status) => {
      const displayText = {
        "active": "Active",
        "inactive": "Inactive",
      };

      return (
        <div className={" flex justify-center"}>
          <NxStatusComponent colour={status}>
            {displayText[status] || toTitleCase(String(status || "")) || "-"}
          </NxStatusComponent>
        </div>
      )
    },
  },
  !isApproval && includeStatus && {
    key: "statusApproval",
    title: "STATUS APPROVAL",
    dataIndex: "statusApproval",
    width: 140,
    align: "center",
    fixed: "right",
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
          <NxStatusComponent colour={status}>
            {displayText[status] || toTitleCase(String(status || "")) || "-"}
          </NxStatusComponent>
        </div>
      );
    },
  },
  {
    key: "mutationStatus",
    title: "MUTATION STATUS",
    dataIndex: "mutationStatus",
    width: 140,
    align: "center",
    fixed: "right",
    render: (status) => {
      const displayText = {
        "approved": "Approved",
        "waitingApproval": "Waiting Approval",
        "pending": "Pending",
        "rejected": "Rejected",
        "WAITING_APPROVAL": "Waiting Approval",
        "WAITING_FOR_APPROVAL": "Waiting Approval",
        "null": "Null",
      };
      return (
        <div className="flex justify-center">
          <NxStatusComponent colour={status}>
            {displayText[status] || toTitleCase(String(status || "")) || "-"}
          </NxStatusComponent>
        </div>
      );
    },
  },
  {
    key: "mutationApprovalStatus",
    title: "MUTATION APPROVAL STATUS",
    dataIndex: "mutationApprovalStatus",
    width: 140,
    align: "center",
    fixed: "right",
    render: (status) => {
      const displayText = {
        "approved": "Approved",
        "waitingApproval": "Waiting Approval",
        "pending": "Pending",
        "rejected": "Rejected",
        "WAITING_APPROVAL": "Waiting Approval",
        "WAITING_FOR_APPROVAL": "Waiting Approval",
        "null": "Null",
      };
      return (
        <div className="flex justify-center">
          <NxStatusComponent colour={status}>
            {displayText[status] || toTitleCase(String(status || "")) || "-"}
          </NxStatusComponent>
        </div>
      );
    },
  },
].filter(Boolean);

export { getSummaryBalanceColumns };
