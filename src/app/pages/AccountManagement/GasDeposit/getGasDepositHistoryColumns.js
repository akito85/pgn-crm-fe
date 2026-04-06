import { toTitleCase } from "../../../../utils";
import { getColumnSearchPropsUseFilteredValue } from "../../../../utils/getColumnSearchProps";
import StatusComponent from "../../../../components/StatusComponent";
import NxDate from "../../../../components/Nx/NxDatePicker";

const getGasDepositHistoryColumns = ({
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
    key: "gdAction",
    title: "ACTION",
    dataIndex: "action",
    width: 100,
    align: "center",
    filteredValue: [search?.action] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "action",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "requestBy",
    title: "REQUEST BY",
    dataIndex: "requestBy",
    width: 120,
    align: "center",
    filteredValue: [search?.requestBy] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "requestBy",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
  },
  {
    key: "requestDate",
    title: "REQUEST DATE",
    dataIndex: "requestDate",
    width: 120,
    align: "center",
    filteredValue: [search?.requestDate] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "requestDate",
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
    key: "objectAccountNumber",
    title: "ACCOUNT NUMBER",
    dataIndex: "objectAccountNumber",
    width: 180,
    sorter: true,
    filteredValue: [search?.objectAccountNumber] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "objectAccountNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "objectAccountName",
    title: "ACCOUNT NAME",
    dataIndex: "objectAccountName",
    width: 180,
    sorter: true,
    filteredValue: [search?.objectAccountName] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "objectAccountName",
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
    width: 120,
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
    width: 120,
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
    width: 120,
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
    width: 120,
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
  {
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
];

export { getGasDepositHistoryColumns };
