import { Tooltip } from "antd";
import SVGIcon from "../../../../../assets/Icon/index";
import { getColumnSearchPropsUseFilteredValueFE } from "../../../../../utils/getColumnSearchProps";
import { sorterFunction } from "../../../../../utils/sorterFunction";

/**
 * Returns the column definitions for the Gas Deposit Detail Attachment table.
 *
 * Each column includes search/filter props via `getColumnSearchPropsUseFilteredValueFE`
 * for client-side filtering, and uses `sorterFunction` for client-side sorting.
 * The action column renders a "View" tooltip with an eye icon that triggers `handleShow`.
 *
 * @param {Object} search - Current active search/filter values keyed by column dataIndex.
 * @param {React.RefObject} searchInput - Ref to the search input element (used for focus).
 * @param {string} searchedColumn - The dataIndex of the column currently being searched.
 * @param {string} searchText - The current search text value.
 * @param {Function} handleSearch - Callback invoked when a search/filter is confirmed.
 * @param {Function} [handleShow=()=>{}] - Callback invoked when the View action is clicked, receives the row record.
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
    sorter: (a, b) => sorterFunction("fileCategoryName", a, b),
    ...getColumnSearchPropsUseFilteredValueFE(
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
    title: "FILE NAME",
    dataIndex: "fileName",
    width: 300,
    sorter: (a, b) => sorterFunction("fileName", a, b),
    ...getColumnSearchPropsUseFilteredValueFE(
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
    title: "FILE SIZE",
    dataIndex: "fileSize",
    width: 100,
    align: "center",
    sorter: (a, b) => sorterFunction("fileSize", a, b),
    ...getColumnSearchPropsUseFilteredValueFE(
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