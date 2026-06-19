import { getColumnSearchPropsUseFilteredValue } from "../../../../utils/getColumnSearchProps";
import NxStatusComponent from "../../../../components/Nx/NxStatusComponent";

const formatStatus = (value) => {
  switch (value) {
    case "WAITING APPROVAL":
    case "WAITING_FOR_APPROVAL":
    case "WAITING_APPROVAL":
      return "Waiting Approval";
    default:
      return value
        ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
        : value;
  }
};

/**
 * Returns column definitions for the Pricing list table.
 *
 * @param {Object}          params
 * @param {Object}          params.search          - Active column search values keyed by dataIndex.
 * @param {React.RefObject} params.searchInput     - Ref to the search input element.
 * @param {string}          params.searchedColumn  - dataIndex of the currently searched column.
 * @param {string}          params.searchText      - Current search text value.
 * @param {Function}        params.handleSearch    - Called when a column search is confirmed.
 * @returns {Array<Object>} Ant Design column definitions.
 */
const getPricingColumns = ({ search, searchInput, searchedColumn, searchText, handleSearch }) => [
  {
    title: "NO",
    key: "no",
    width: 50,
    align: "center",
    render: (_, __, index) => index + 1,
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
    title: "PRODUCT",
    key: "product",
    sorter: true,
    dataIndex: "product",
    ellipsis: { showTitle: false },
    ...getColumnSearchPropsUseFilteredValue(search, "product", searchInput, searchedColumn, searchText, handleSearch, true),
  },
  {
    title: "PRICING",
    key: "pricing",
    sorter: true,
    dataIndex: "pricing",
    ellipsis: { showTitle: false },
    ...getColumnSearchPropsUseFilteredValue(search, "pricing", searchInput, searchedColumn, searchText, handleSearch, true),
  },
  {
    title: "MAKER POSITION",
    key: "makerPosition",
    sorter: true,
    dataIndex: "makerPosition",
    ellipsis: { showTitle: false },
    ...getColumnSearchPropsUseFilteredValue(search, "makerPosition", searchInput, searchedColumn, searchText, handleSearch, true),
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
    key: "priceDescription",
    sorter: true,
    dataIndex: "priceDescription",
    ellipsis: { showTitle: false },
    ...getColumnSearchPropsUseFilteredValue(search, "priceDescription", searchInput, searchedColumn, searchText, handleSearch, true),
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

export default getPricingColumns;
