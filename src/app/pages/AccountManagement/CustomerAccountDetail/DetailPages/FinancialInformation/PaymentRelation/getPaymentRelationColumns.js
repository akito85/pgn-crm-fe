import { toTitleCase } from "../../../../../../../utils";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../../../utils/getColumnSearchProps";
import StatusComponent from "../../../../../../../components/StatusComponent";
import NxDate from "../../../../../../../components/Nx/NxDatePicker";

const getPaymentRelationColumns = (
  search,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
  includeStatus = true,
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
    key: "accountNumber",
    title: "ACCOUNT NUMBER",
    dataIndex: "accountNumber",
    width: 200,
    sorter: true,
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
  {
    key: "priority",
    title: "PRIORITY",
    dataIndex: "priority",
    width: 150,
    align: "center",
    sorter: true,
    filteredValue: [search?.priority] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "priority",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "startDate",
    title: "START DATE",
    dataIndex: "startDate",
    width: 140,
    align: "center",
    filteredValue: [search?.startDate] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "startDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (startDate) => NxDate.formatDate(startDate, "DD MMM YYYY"),
  },
  {
    key: "endDate",
    title: "END DATE",
    dataIndex: "endDate",
    width: 140,
    align: "center",
    filteredValue: [search?.endDate] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "endDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (endDate) => NxDate.formatDate(endDate, "DD MMM YYYY"),
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
        "WAITING_FOR_APPROVAL": "Waiting Approval"
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

export { getPaymentRelationColumns };