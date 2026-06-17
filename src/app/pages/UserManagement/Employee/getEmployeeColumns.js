import { Tooltip } from "antd";
import NxDate from "../../../../components/Nx/NxDatePicker";
import StatusComponent from "../../../../components/StatusComponent";
import { getColumnSearchPropsUseFilteredValue } from "../../../../utils/getColumnSearchProps";

const EMPLOYEE_STATUS_OPTIONS = [
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
  { label: "Terminated", value: "TERMINATED" },
];

/**
 * Returns column definitions for the Employee list table.
 *
 * @param {Object}          params
 * @param {Object}          params.search          - Active filter values keyed by column dataIndex.
 * @param {React.RefObject} params.searchInput     - Ref to the search input (for auto-focus).
 * @param {string}          params.searchedColumn  - dataIndex of the currently searched column.
 * @param {string}          params.searchText      - Current search text value.
 * @param {Function}        params.handleSearch    - Callback: (selectedKeys, confirm, dataIndex) => void
 * @returns {Array<Object>}
 */
export const getEmployeeColumns = ({
  search,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
}) => [
  {
    title: "NO",
    align: "center",
    width: 60,
    key: "no",
    render: (_, __, index) => index + 1,
    fixed: "left",
  },
  {
    title: "EMPLOYEE NUMBER",
    dataIndex: "empNumber",
    key: "empNumber",
    align: "left",
    width: 150,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search, "empNumber", searchInput, searchedColumn, searchText, handleSearch
    ),
  },
  {
    title: "FIRST NAME",
    dataIndex: "firstName",
    key: "firstName",
    align: "left",
    width: 150,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search, "firstName", searchInput, searchedColumn, searchText, handleSearch
    ),
  },
  {
    title: "LAST NAME",
    dataIndex: "lastName",
    key: "lastName",
    align: "left",
    width: 150,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search, "lastName", searchInput, searchedColumn, searchText, handleSearch
    ),
  },
  {
    title: "EMPLOYEE TYPE",
    dataIndex: "empType",
    key: "empType",
    align: "center",
    width: 150,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search, "empType", searchInput, searchedColumn, searchText, handleSearch
    ),
  },
  {
    title: "MOBILE PHONE",
    dataIndex: "phone",
    key: "phone",
    align: "right",
    width: 150,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search, "phone", searchInput, searchedColumn, searchText, handleSearch
    ),
  },
  {
    title: "EMAIL",
    dataIndex: "email",
    key: "email",
    align: "left",
    width: 200,
    sorter: true,
    ellipsis: { showTitle: false },
    ...getColumnSearchPropsUseFilteredValue(
      search, "email", searchInput, searchedColumn, searchText, handleSearch,
      true  // excludeRender — we provide our own render below
    ),
    render: (text) =>
      text ? (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      ) : "",
  },
  {
    title: "JOB",
    dataIndex: "jobName",
    key: "jobName",
    align: "left",
    width: 150,
    sorter: true,
    ellipsis: { showTitle: false },
    ...getColumnSearchPropsUseFilteredValue(
      search, "jobName", searchInput, searchedColumn, searchText, handleSearch,
      true
    ),
    render: (text) =>
      text ? (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      ) : "",
  },
  {
    title: "POSITION",
    dataIndex: "positionName",
    key: "positionName",
    align: "left",
    width: 180,
    sorter: true,
    ellipsis: { showTitle: false },
    ...getColumnSearchPropsUseFilteredValue(
      search, "positionName", searchInput, searchedColumn, searchText, handleSearch,
      true
    ),
    render: (text) =>
      text ? (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      ) : "",
  },
  {
    title: "START DATE",
    dataIndex: "startDate",
    key: "startDate",
    align: "center",
    width: 130,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search, "startDate", searchInput, searchedColumn, searchText, handleSearch,
      true, "dateFormal"
    ),
    render: (startDate) => NxDate.formatDate(startDate, "DD MMM YYYY"),
  },
  {
    title: "END DATE",
    dataIndex: "endDate",
    key: "endDate",
    align: "center",
    width: 130,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search, "endDate", searchInput, searchedColumn, searchText, handleSearch,
      true, "dateFormal"
    ),
    render: (endDate) => NxDate.formatDate(endDate, "DD MMM YYYY"),
  },
  {
    title: "DESCRIPTION",
    dataIndex: "description",
    key: "description",
    width: 220,
    sorter: true,
    ellipsis: { showTitle: false },
    ...getColumnSearchPropsUseFilteredValue(
      search, "description", searchInput, searchedColumn, searchText, handleSearch,
      true
    ),
    render: (text) =>
      text ? (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      ) : "",
  },
  {
    title: "STATUS",
    dataIndex: "status",
    key: "status",
    align: "center",
    width: 120,
    sorter: true,
    fixed: "right",
    ...getColumnSearchPropsUseFilteredValue(
      search, "status", searchInput, searchedColumn, searchText, handleSearch,
      true, "select", EMPLOYEE_STATUS_OPTIONS
    ),
    render: (index) => {
      const text = index
        ? index.charAt(0).toUpperCase() + index.slice(1).toLowerCase()
        : index;
      return text ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "22px",
            overflow: "hidden",
          }}
        >
          <StatusComponent colour={index} size="small">
            {text}
          </StatusComponent>
        </div>
      ) : (
        text
      );
    },
  },
];
