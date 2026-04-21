import { Tooltip } from "antd";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../../../../../utils/getColumnSearchProps";
import SVGIcon from "../../../../../../../../../assets/Icon/index";
import StatusComponent from "../../../../../../../../../components/StatusComponent";
import NxDate from "../../../../../../../../../components/Nx/NxDatePicker";
import { toTitleCase } from "../../../../../../../../../utils";

const getSrRefColumns = (
  search,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
  setServiceRequestRef = () => {},
  setIsOpen = () => {}
) => [
  {
    title: "NO",
    width: 80,
    align: "center",
    render: (_, __, index) => index + 1
  },
  {
    title: "SERVICE REQUEST NUMBER",
    dataIndex: "requestNumber",
    width: 200,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "requestNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    )
  },
  {
    title: "SERVICE REQUEST REFERENCE",
    dataIndex: "reference",
    width: 220,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "reference",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    )
  },
  {
    title: "TYPE",
    dataIndex: "type",
    width: 150,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "type",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    )
  },
  {
    title: "CATEGORY",
    dataIndex: "category",
    width: 160,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "category",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    )
  },
  {
    title: "SUB CATEGORY",
    dataIndex: "subCategory",
    width: 160,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "subCategory",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    )
  },
  {
    title: "CHANNEL",
    dataIndex: "channel",
    width: 140,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "channel",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    )
  },
  {
    title: "REQUEST SOURCE",
    dataIndex: "source",
    width: 150,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "source",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    )
  },
  {
    title: "REQUEST DATE",
    dataIndex: "requestDate",
    width: 200,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "requestDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (date) => NxDate.formatDate(date, "DD MMM YYYY")
  },
  {
    title: "OPEN DATE",
    dataIndex: "openDate",
    width: 200,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "openDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (date) => NxDate.formatDate(date, "DD MMM YYYY")
  },
  {
    title: "RESOLVED DATE",
    dataIndex: "resolvedDate",
    width: 200,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "resolvedDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (date) => NxDate.formatDate(date, "DD MMM YYYY")
  },
  {
    title: "CLOSED DATE",
    dataIndex: "closedDate",
    width: 200,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "closedDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (date) => NxDate.formatDate(date, "DD MMM YYYY")
  },
  {
    title: "AGE (HOUR)",
    dataIndex: "age",
    width: 120,
    sorter: true,
    align: "center",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "age",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (age) => age || "0"
  },
  {
    title: "DESCRIPTION",
    dataIndex: "description",
    width: 250,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "description",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    )
  },
  {
    title: "STATUS APPROVAL",
    dataIndex: "statusApproval",
    width: 160,
    sorter: true,
    align: "center",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "statusApproval",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (status) => {
      const colorMap = {
        approved: "green",
        waitingApproval: "orange",
        pending: "orange",
        rejected: "red"
      };
      const displayText = {
        approved: "Approved",
        waitingApproval: "Waiting Approval",
        pending: "Pending",
        rejected: "Rejected"
      };
      return (
        <div className="flex justify-center">
          <StatusComponent colour={colorMap[status] || "gray"}>
            {displayText[status] || toTitleCase(String(status || "")) || "-"}
          </StatusComponent>
        </div>
      );
    }
  },
  {
    title: "STATUS PRE-REQUISITE",
    dataIndex: "statusPrerequisite",
    width: 180,
    sorter: true,
    align: "center",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "statusPrerequisite",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (status) => {
      const colorMap = {
        completed: "green",
        pending: "red",
        none: "blue"
      };
      const displayText = {
        completed: "Completed",
        pending: "Pending",
        none: "None"
      };
      return (
        <div className="flex justify-center">
          <StatusComponent colour={colorMap[status] || "gray"}>
            {displayText[status] || toTitleCase(String(status || "")) || "-"}
          </StatusComponent>
        </div>
      );
    }
  },
  {
    title: "STATUS",
    dataIndex: "status",
    width: 140,
    sorter: true,
    align: "center",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "status",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (status) => {
      const colorMap = {
        inProgress: "blue",
        onHold: "orange",
        closed: "red",
        canceled: "gray",
        open: "green",
        active: "green",
        pending: "orange"
      };
      const displayText = {
        inProgress: "In Progress",
        onHold: "On Hold",
        closed: "Closed",
        canceled: "Canceled",
        open: "Open"
      };
      return (
        <div className="flex justify-center">
          <StatusComponent colour={colorMap[status] || "gray"}>
            {displayText[status] || toTitleCase(String(status || "")) || "-"}
          </StatusComponent>
        </div>
      );
    }
  },
  {
    key: "action",
    title: "ACTION",
    align: "center",
    width: 120,
    fixed: "right",
    render: (_, record) => (
      <div className="flex w-full justify-center gap-4">
        <Tooltip title="Select">
          <div className="pt-1 cursor-pointer">
            <SVGIcon
              name="IconActionCreate"
              color={"#0075bf"}
              width={20}
              onClick={() => {
                setServiceRequestRef(record.requestNumber);
                setIsOpen(false);
              }}
            />
          </div>
        </Tooltip>
      </div>
    )
  }
];

export { getSrRefColumns };
