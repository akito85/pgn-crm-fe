import { Tooltip } from "antd";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../../../../../utils/getColumnSearchProps";
import SVGIcon from "../../../../../../../../../assets/Icon/index";

/**
 * Builds Ant Design column definitions for the customer selection table.
 *
 * @param {object}   search          - Active search filters keyed by dataIndex.
 * @param {object}   searchInput     - Ref attached to the search input element.
 * @param {string}   searchedColumn  - dataIndex of the currently searched column.
 * @param {string}   searchText      - Current search text value.
 * @param {Function} handleSearch    - Column search submit handler.
 * @param {Function} [handleSelect]  - Called with the selected row record.
 * @param {Function} [handleCancel]  - Closes the parent modal.
 * @returns {object[]} Array of Ant Design column definition objects.
 */
const getCustomerColumns = (
  search,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
  handleSelect = () => {},
  handleCancel = () => {},
) => [
  {
    key: "no",
    title: "NO",
    width: 50,
    align: "center",
    render: (_, __, index) => index + 1,
  },
  {
    key: "customerNumber",
    title: "CUSTOMER NUMBER",
    dataIndex: "customerNumber",
    width: 220,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "customerNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "customerIdentificationType",
    title: "IDENTIFICATION TYPE",
    dataIndex: "customerIdentificationType",
    width: 231,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "customerIdentificationType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "customerIdentificationNumber",
    title: "CUSTOMER IDENTIFICATION NUMBER",
    dataIndex: "customerIdentificationNumber",
    width: 343,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "customerIdentificationNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "customerName",
    title: "CUSTOMER NAME",
    dataIndex: "customerName",
    width: 200,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "customerName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "customerType",
    title: "CUSTOMER TYPE",
    dataIndex: "customerType",
    width: 194,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "customerType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "action",
    title: "ACTION",
    align: "center",
    width: 127,
    fixed: "right",
    render: (_, record) => (
      <div className="flex w-full justify-center gap-4">
        <Tooltip title="Select">
          <div className="pt-1 cursor-pointer">
            <SVGIcon
              name="IconActionCreate"
              color="#0075bf"
              width={20}
              onClick={() => {
                handleSelect(record);
                handleCancel();
              }}
            />
          </div>
        </Tooltip>
      </div>
    ),
  },
];

export { getCustomerColumns };
