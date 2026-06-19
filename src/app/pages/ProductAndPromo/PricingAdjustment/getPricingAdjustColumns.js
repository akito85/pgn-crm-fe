import { getColumnSearchPropsUseFilteredValue } from "../../../../utils/getColumnSearchProps";
import NxStatusComponent from "../../../../components/Nx/NxStatusComponent";

const formatStatus = (value) => {
  switch (value) {
    case "WAITING APPROVAL":
    case "WAITING_FOR_APPROVAL":
    case "WAITING_APPROVAL":
    case "WAITING FOR APPROVAL":
      return "Waiting Approval";
    default:
      return value
        ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
        : value;
  }
};

/**
 * Returns column definitions for the Pricing Adjustment list table.
 *
 * @param {Object}          params
 * @param {Object}          params.search          - Active column search values keyed by dataIndex.
 * @param {React.RefObject} params.searchInput     - Ref to the search input element.
 * @param {string}          params.searchedColumn  - dataIndex of the currently searched column.
 * @param {string}          params.searchText      - Current search text value.
 * @param {Function}        params.handleSearch    - Called when a column search is confirmed.
 * @returns {Array<Object>} Ant Design column definitions.
 */
const getPricingAdjustColumns = ({ search, searchInput, searchedColumn, searchText, handleSearch }) => [
  {
    title: "NO",
    key: "no",
    width: 50,
    align: "center",
    render: (_, __, index) => index + 1,
  },
  {
    title: "ADJUSTMENT NAME",
    key: "name",
    sorter: true,
    dataIndex: "name",
    ellipsis: { showTitle: false },
    ...getColumnSearchPropsUseFilteredValue(search, "name", searchInput, searchedColumn, searchText, handleSearch, true),
  },
  {
    title: "PRICE CODE",
    key: "priceCode",
    sorter: true,
    dataIndex: "priceCode",
    ellipsis: { showTitle: false },
    ...getColumnSearchPropsUseFilteredValue(search, "priceCode", searchInput, searchedColumn, searchText, handleSearch, true),
  },
  {
    title: "PRICING DETAIL VALUE",
    key: "pricing",
    sorter: true,
    dataIndex: "pricing",
    ellipsis: { showTitle: false },
    ...getColumnSearchPropsUseFilteredValue(search, "pricing", searchInput, searchedColumn, searchText, handleSearch, true),
  },
  {
    title: "CRITERIA",
    key: "criterias",
    sorter: true,
    dataIndex: "criterias",
    ellipsis: { showTitle: false },
    ...getColumnSearchPropsUseFilteredValue(search, "criterias", searchInput, searchedColumn, searchText, handleSearch, true),
  },
  {
    title: "DESCRIPTION",
    key: "criterias",
    sorter: true,
    dataIndex: "description",
    ellipsis: { showTitle: false },
    ...getColumnSearchPropsUseFilteredValue(search, "description", searchInput, searchedColumn, searchText, handleSearch, true),
  },
  {
    title: "STATUS",
    width: 160,
    sorter: true,
    fixed: "right",
    dataIndex: "status",
    key: "status",
    ...getColumnSearchPropsUseFilteredValue(search, "status", searchInput, searchedColumn, searchText, handleSearch, true),
    render: (value) => {
      const text = formatStatus(value);
      return (
        <div className="flex justify-center">
          <NxStatusComponent colour={text}>
            {text}
          </NxStatusComponent>
        </div>
      )
    },
  },
  {
    title: "STATUS APPROVAL",
    width: 240,
    sorter: true,
    fixed: "right",
    dataIndex: "statusApproval",
    key: "statusApproval",
    ...getColumnSearchPropsUseFilteredValue(search, "statusApproval", searchInput, searchedColumn, searchText, handleSearch, true),
    render: (value) => {
      const text = formatStatus(value);
      return (
        <div className="flex justify-center">
          <NxStatusComponent colour={text}>
            {text}
          </NxStatusComponent>
        </div>
      )
    },
  },
];

export default getPricingAdjustColumns;
