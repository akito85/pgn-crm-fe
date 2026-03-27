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
    filteredValue: [search?.relationshipTypeName] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "relationshipTypeName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) => text ? text.toUpperCase() : "-",
  },
  {
    key: "relationshipCategoryName",
    title: "CATEGORY",
    dataIndex: "relationshipCategoryName",
    width: 150,
    sorter: true,
    filteredValue: [search?.relationshipCategoryName] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "relationshipCategoryName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) => text ? text.toUpperCase() : "-",
  },
  {
    key: "subjectName",
    title: "RELATED NAME",
    dataIndex: "subjectName",
    width: 200,
    sorter: true,
    filteredValue: [search?.subjectName] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "subjectName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text, record) => record.subjectName || record.objectName || "-",
  },
  {
    key: "subjectNumber",
    title: "RELATED NUMBER",
    dataIndex: "subjectNumber",
    width: 200,
    sorter: true,
    filteredValue: [search?.subjectNumber] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "subjectNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text, record) => record.subjectNumber || record.objectNumber || "-",
  },
  {
    key: "startDate",
    title: "START DATE",
    dataIndex: "startDate",
    width: 150,
    sorter: true,
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
    render: (startDate) => startDate ? moment(startDate).format(dateFormatting.date) : "-",
  },
  {
    key: "endDate",
    title: "END DATE",
    dataIndex: "endDate",
    width: 150,
    sorter: true,
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
    render: (endDate) => endDate ? moment(endDate).format(dateFormatting.date) : "-",
  },
  includeStatus && {
    key: "statusApproval",
    title: "STATUS APPROVAL",
    dataIndex: "statusApproval",
    width: 180,
    sorter: true,
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
