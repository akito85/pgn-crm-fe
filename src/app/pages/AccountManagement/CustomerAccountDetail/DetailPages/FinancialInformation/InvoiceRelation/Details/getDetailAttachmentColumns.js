import { Tooltip } from "antd";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../../../../utils/getColumnSearchProps";
import SVGIcon from "../../../../../../../../assets/Icon/index";

/**
 * Returns the column definitions for the Invoice Relation Detail Attachment table.
 *
 * Each column includes search/filter props via `getColumnSearchPropsUseFilteredValue`
 * for server-side filtering, with `filteredValue` set per column. Sorting is handled
 * server-side via `sorter: true`. The action column renders a "View" tooltip with an
 * eye icon that triggers `handleShow`.
 *
 * @param {Object}           search          - Current active search/filter values keyed by column dataIndex.
 * @param {React.RefObject}  searchInput     - Ref to the search input element (used for focus).
 * @param {string}           searchedColumn  - The dataIndex of the column currently being searched.
 * @param {string}           searchText      - The current search text value.
 * @param {Function}         handleSearch    - Callback invoked when a search/filter is confirmed.
 * @param {Function}         [handleShow=()=>{}] - Callback invoked when the View action is clicked, receives the row record.
 * @returns {Array<Object>} Array of Ant Design column definition objects.
 */
const getDetailAttachmentColumns = (
  search,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
  handleShow = () => {},
) => [
  {
    key: "no",
    title: "NO",
    align: "center",
    width: 80,
    render: (_, __, index) => index + 1,
  },
  {
    key: "fileCategoryName",
    title: "TYPE",
    dataIndex: "fileCategoryName",
    width: 75,
    sorter: true,
    filteredValue: [search?.fileCategoryName] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "fileCategoryName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "fileName",
    title: "FILE NAME",
    dataIndex: "fileName",
    width: 300,
    sorter: true,
    filteredValue: [search?.fileName] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "fileName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "fileSize",
    title: "FILE SIZE",
    dataIndex: "fileSize",
    width: 100,
    sorter: true,
    align: "center",
    filteredValue: [search?.fileSize] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "fileSize",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "action",
    title: "ACTION",
    align: "center",
    width: 100,
    fixed: "right",
    render: (_, record) => {
      return (
        <div className="flex w-full justify-center gap-6 py-1">
          <Tooltip title="View">
            <SVGIcon
              name="IconEye"
              color={"#0075bf"}
              width={20}
              onClick={() => {
                handleShow(record);
              }}
            />
          </Tooltip>
        </div>
      );
    },
  },
];

export { getDetailAttachmentColumns };