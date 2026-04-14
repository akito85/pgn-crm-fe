import moment from "moment";
import { dateFormatting, toTitleCase } from "../../../../../../utils";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../../utils/getColumnSearchProps";
import StatusComponent from "../../../../../../components/StatusComponent";

const getRelationshipColumns = (
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
    width: 50,
    render: (_, __, index) => index + 1,
  },
  {
    key: "relationshipTypeName",
    title: "TYPE",
    dataIndex: "relationshipTypeName",
    width: 150,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "relationshipTypeName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
    render: (text) => text ? text.toUpperCase() : "-",
  },
  {
    key: "relationshipCategoryName",
    title: "CATEGORY",
    dataIndex: "relationshipCategoryName",
    width: 150,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "relationshipCategoryName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
    render: (text) => text ? text.toUpperCase() : "-",
  },
  {
    key: "acountName",
    title: "RELATED NAME",
    dataIndex: "acountName",
    width: 200,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "acountName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
    render: (_, record) => record.acountName,
  },
  {
    key: "accountNumber",
    title: "RELATED NUMBER",
    dataIndex: "accountNumber",
    width: 200,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "accountNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
    render: (_, record) => record.accountNumber,
  },
  {
    key: "startDate",
    title: "START DATE",
    dataIndex: "startDate",
    width: 150,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "startDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
    render: (startDate) => startDate ? moment(startDate).format(dateFormatting.date) : "-",
  },
  {
    key: "endDate",
    title: "END DATE",
    dataIndex: "endDate",
    width: 150,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "endDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
    render: (endDate) => endDate ? moment(endDate).format(dateFormatting.date) : "-",
  },
  includeStatus && {
    key: "statusApproval",
    title: "STATUS APPROVAL",
    dataIndex: "statusApproval",
    width: 180,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "statusApproval",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
    render: (status) => {
      const displayText = {
        "APPROVED": "Approved",
        "WAITING_APPROVAL": "Waiting Approval",
        "WAITING APPROVAL": "Waiting Approval",
        "WAITING_FOR_APPROVAL": "Waiting Approval",
        "WAITING FOR APPROVAL": "Waiting Approval",
        "PENDING": "Pending",
        "REJECTED": "Rejected",
        "DRAFT": "Draft",
      };
      return (
        <div className="flex justify-center">
          <StatusComponent colour={status}>
            {displayText[status?.toUpperCase()] || toTitleCase(String(status || "")) || "-"}
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
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "status",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
    render: (status) => {
      const displayText = {
        "ACTIVE": "Active",
        "INACTIVE": "Inactive",
      };
      return (
        <div className="flex justify-center">
          <StatusComponent colour={status}>
            {displayText[status?.toUpperCase()] || toTitleCase(String(status || "")) || "-"}
          </StatusComponent>
        </div>
      );
    },
  },
].filter(Boolean);

export { getRelationshipColumns };
