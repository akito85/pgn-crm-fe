import moment from "moment";
import { toTitleCase } from "../../../../../../utils";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../../utils/getColumnSearchProps";
import StatusComponent from "../../../../../../components/StatusComponent";

/**
 * Returns the column definitions for the Service Request list table.
 *
 * @param {Object}          params                    - Column configuration options.
 * @param {Object}          params.search             - Current active search/filter values keyed by column dataIndex.
 * @param {React.RefObject} params.searchInput        - Ref to the search input element (used for focus).
 * @param {string}          params.searchedColumn     - The dataIndex of the column currently being searched.
 * @param {string}          params.searchText         - The current search text value.
 * @param {Function}        params.handleSearch       - Callback invoked when a search/filter is confirmed.
 * @param {boolean}         [params.isApproval=false] - When true, fixes the NO column left and shows the statusApproval column.
 * @returns {Array<Object>} Array of Ant Design column definition objects.
 */
const getServiceRequestColumns = ({
  search,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
  isApproval = false
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
    key: "serviceRequestNumber",
    title: "SERVICE REQUEST NUMBER",
    dataIndex: "serviceRequestNumber",
    width: 220,
    sorter: true,
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
    key: "status",
    title: "STATUS",
    dataIndex: "status",
    width: 130,
    align: "center",
    fixed: "right",
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
          <StatusComponent colour={status} size="small">
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
    align: "center",
    fixed: "right",
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
          <StatusComponent colour={status} size="small">
            {displayText[status] || toTitleCase(String(status || "")) || "-"}
          </StatusComponent>
        </div>
      );
    },
  },
  !isApproval && {
    key: "statusApproval",
    title: "STATUS APPROVAL",
    dataIndex: "statusApproval",
    width: 170,
    align: "center",
    fixed: "right",
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
          <StatusComponent colour={status} size="small">
            {displayText[status] || toTitleCase(String(status || "")) || "-"}
          </StatusComponent>
        </div>
      );
    },
  },
].filter(Boolean);

export { getServiceRequestColumns };
