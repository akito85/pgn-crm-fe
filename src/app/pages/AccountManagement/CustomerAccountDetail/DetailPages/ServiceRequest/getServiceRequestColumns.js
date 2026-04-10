import moment from "moment";
import { toTitleCase } from "../../../../../../utils";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../../utils/getColumnSearchProps";
import StatusComponent from "../../../../../../components/StatusComponent";

const getServiceRequestColumns = (
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
    width: 50,
    render: (_, __, index) => index + 1,
  },
  {
    key: "serviceRequestNumber",
    title: "SERVICE REQUEST NUMBER",
    dataIndex: "serviceRequestNumber",
    width: 220,
    sorter: true,
    filteredValue: [search?.serviceRequestNumber] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "serviceRequestNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "serviceRequestReference",
    title: "SERVICE REQUEST REFERENCE",
    dataIndex: "serviceRequestReference",
    width: 230,
    sorter: true,
    filteredValue: [search?.serviceRequestReference] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "serviceRequestReference",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (reference) => (
      <span className="underline cursor-pointer text-blue-600">
        {reference || "-"}
      </span>
    ),
  },
  {
    key: "type",
    title: "TYPE",
    dataIndex: "type",
    width: 150,
    sorter: true,
    filteredValue: [search?.type] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "type",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "category",
    title: "CATEGORY",
    dataIndex: "category",
    width: 160,
    sorter: true,
    filteredValue: [search?.category] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "category",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "subCategory",
    title: "SUB CATEGORY",
    dataIndex: "subCategory",
    width: 160,
    sorter: true,
    filteredValue: [search?.subCategory] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "subCategory",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "channel",
    title: "CHANNEL",
    dataIndex: "channel",
    width: 140,
    sorter: true,
    filteredValue: [search?.channel] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "channel",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "requestSource",
    title: "REQUEST SOURCE",
    dataIndex: "requestSource",
    width: 150,
    sorter: true,
    filteredValue: [search?.requestSource] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "requestSource",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "requestDate",
    title: "REQUEST DATE",
    dataIndex: "requestDate",
    width: 180,
    sorter: true,
    filteredValue: [search?.requestDate] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "requestDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (date) => (date ? moment(date).format("DD MMM YYYY HH:mm:ss") : "-"),
  },
  {
    key: "openDate",
    title: "OPEN DATE",
    dataIndex: "openDate",
    width: 180,
    sorter: true,
    filteredValue: [search?.openDate] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "openDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (date) => (date ? moment(date).format("DD MMM YYYY HH:mm:ss") : "-"),
  },
  {
    key: "resolvedDate",
    title: "RESOLVED DATE",
    dataIndex: "resolvedDate",
    width: 180,
    sorter: true,
    filteredValue: [search?.resolvedDate] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "resolvedDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (date) => (date ? moment(date).format("DD MMM YYYY HH:mm:ss") : "-"),
  },
  {
    key: "closedDate",
    title: "CLOSED DATE",
    dataIndex: "closedDate",
    width: 180,
    sorter: true,
    filteredValue: [search?.closedDate] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "closedDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (date) => (date ? moment(date).format("DD MMM YYYY HH:mm:ss") : "-"),
  },
  {
    key: "age",
    title: "AGE (HOUR)",
    dataIndex: "age",
    width: 120,
    sorter: true,
    align: "center",
    filteredValue: [search?.age] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "age",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (age) => age || "0",
  },
  {
    key: "description",
    title: "DESCRIPTION",
    dataIndex: "description",
    width: 200,
    sorter: true,
    filteredValue: [search?.description] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "description",
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
        draft: "Draft",
        DRAFT: "Draft",
        approved: "Approved",
        APPROVED: "Approved",
        waitingApproval: "Waiting Approval",
        WAITING_APPROVAL: "Waiting Approval",
        rejected: "Rejected",
        REJECTED: "Rejected",
        pending: "Pending",
        PENDING: "Pending",
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
    key: "statusPrerequisite",
    title: "STATUS PRE-REQUISITE",
    dataIndex: "statusPrerequisite",
    width: 180,
    sorter: true,
    align: "center",
    filteredValue: [search?.statusPrerequisite] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "statusPrerequisite",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (status) => {
      const displayText = {
        completed: "Completed",
        COMPLETED: "Completed",
        approve: "Approve",
        APPROVE: "Approve",
        approved: "Approve",
        APPROVED: "Approve",
        pending: "Pending",
        PENDING: "Pending",
        none: "None",
        NONE: "None",
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
    width: 130,
    sorter: true,
    align: "center",
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
        inProgress: "In Progress",
        IN_PROGRESS: "In Progress",
        onHold: "On Hold",
        ON_HOLD: "On Hold",
        closed: "Closed",
        CLOSED: "Closed",
        canceled: "Canceled",
        CANCELED: "Canceled",
        open: "Open",
        OPEN: "Open",
        active: "Active",
        ACTIVE: "Active",
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

export { getServiceRequestColumns };
