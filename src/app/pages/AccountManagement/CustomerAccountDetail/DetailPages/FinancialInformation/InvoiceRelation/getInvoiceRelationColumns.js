import { toTitleCase } from "../../../../../../../utils";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../../../utils/getColumnSearchProps";
import StatusComponent from "../../../../../../../components/StatusComponent";
import NxDate from "../../../../../../../components/Nx/NxDatePicker";

const getInvoiceRelationColumns = (
  search,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch
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
    key: "relatedAccountName",
    title: "ACCOUNT NAME",
    dataIndex: "relatedAccountName",
    width: 200,
    sorter: true,
    filteredValue: [search?.relatedAccountName] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "relatedAccountName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "relatedAccountNumber",
    title: "ACCOUNT NUMBER",
    dataIndex: "relatedAccountNumber",
    width: 200,
    sorter: true,
    filteredValue: [search?.relatedAccountNumber] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "relatedAccountNumber",
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
    filteredValue: [search?.relatedAccountNumber] || null,
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
    filteredValue: [search?.relatedAccountNumber] || null,
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
    filteredValue: [search?.relatedAccountNumber] || null,
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
  {
    key: "status",
    title: "STATUS",
    dataIndex: "status",
    width: 120,
    sorter: true,
    filteredValue: [search?.status] || null,
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
];

export { getInvoiceRelationColumns };