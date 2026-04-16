import { toTitleCase } from "../../../../../../../utils";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../../../utils/getColumnSearchProps";
import StatusComponent from "../../../../../../../components/StatusComponent";
import NxDate from "../../../../../../../components/Nx/NxDatePicker";

/**
 * Returns the column definitions for the Invoice Relation list table.
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
const getInvoiceRelationColumns = ({
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
    width: 40,
    fixed: isApproval ? "left" : undefined,
    render: (_, __, index) => index + 1,
  },
  {
    key: "accountName",
    title: "ACCOUNT NAME",
    dataIndex: "accountName",
    width: 200,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "accountName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "accountNumber",
    title: "ACCOUNT NUMBER",
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
  },
  {
    key: "startDate",
    title: "START DATE",
    dataIndex: "startDate",
    width: 140,
    align: "center",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "startDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
    render: (startDate) => NxDate.formatDate(startDate, "DD MMM YYYY"),
  },
  {
    key: "endDate",
    title: "END DATE",
    dataIndex: "endDate",
    width: 140,
    align: "center",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "endDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
    render: (endDate) => NxDate.formatDate(endDate, "DD MMM YYYY"),
  },
  !isApproval && {
    key: "statusApproval",
    title: "STATUS APPROVAL",
    dataIndex: "statusApproval",
    width: 170,
    sorter: true,
    align: "center",
    fixed: "right",
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
    fixed: "right",
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

export { getInvoiceRelationColumns };