import { Tooltip } from "antd";
import StatusComponent from "../../../../components/StatusComponent";
import NxDate from "../../../../components/Nx/NxDatePicker";
import { getColumnSearchPropsUseFilteredValue } from "../../../../utils/getColumnSearchProps";

const STATUS_OPTIONS = [
  { label: "Active", value: "ACTIVE" },
  { label: "Draft", value: "DRAFT" },
  { label: "Inactive", value: "INACTIVE" },
];

/**
 * Column definitions for the Position Hierarchy list table.
 *
 * @param {Object}          params
 * @param {Object}          params.search          - Active filter values keyed by column dataIndex.
 * @param {React.RefObject} params.searchInput     - Ref to the search input (for auto-focus).
 * @param {string}          params.searchedColumn  - dataIndex of the currently searched column.
 * @param {string}          params.searchText      - Current search text value.
 * @param {Function}        params.handleSearch    - Callback: (selectedKeys, confirm, dataIndex) => void
 * @returns {Array<Object>}
 */
export const getPositionHierarchyColumns = ({
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
    render: (text, object, index) => index + 1,
    fixed: "left",
  },
  {
    title: "NAME",
    dataIndex: "name",
    key: "name",
    align: "left",
    width: 250,
    sorter: true,
    ellipsis: { showTitle: false },
    ...getColumnSearchPropsUseFilteredValue(
      search, "name", searchInput, searchedColumn, searchText, handleSearch,
      true
    ),
    render: (text) =>
      text ? (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      ) : (
        ""
      ),
  },
  {
    title: "START DATE",
    dataIndex: "startDate",
    key: "startDate",
    align: "center",
    width: 140,
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
    width: 140,
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
    align: "left",
    width: 300,
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
      ) : (
        ""
      ),
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
      true, "select", STATUS_OPTIONS
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
