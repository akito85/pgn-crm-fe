import moment from "moment";
import { dateFormatting, toTitleCase } from "../../../../../../utils";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../../utils/getColumnSearchProps";
import StatusComponent from "../../../../../../components/StatusComponent";

/**
 * Returns the column definitions for the Relationship list table.
 *
 * @param {Object}          params                    - Column configuration options.
 * @param {Object}          params.search             - Current active search/filter values keyed by column dataIndex.
 * @param {React.RefObject} params.searchInput        - Ref to the search input element (used for focus).
 * @param {string}          params.searchedColumn     - The dataIndex of the column currently being searched.
 * @param {string}          params.searchText         - The current search text value.
 * @param {Function}        params.handleSearch       - Callback invoked when a search/filter is confirmed.
 * @param {boolean}         [params.isApproval=false] - When true, omits the statusApproval and status columns.
 * @returns {Array<Object>} Array of Ant Design column definition objects.
 */
const getRelationshipColumns = ({
  search,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
  isApproval = false,
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
    key: "relatedName",
    title: "RELATED NAME",
    dataIndex: "relatedName",
    width: 200,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "relatedName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
    render: (_, record) => record.relatedName,
  },
  {
    key: "relatedNumber",
    title: "RELATED NUMBER",
    dataIndex: "relatedNumber",
    width: 200,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "relatedNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
    render: (_, record) => record.relatedNumber,
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
  !isApproval && {
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
  !isApproval && {
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
