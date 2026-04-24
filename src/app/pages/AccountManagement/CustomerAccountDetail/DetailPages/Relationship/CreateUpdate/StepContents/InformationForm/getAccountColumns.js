import { Tooltip } from "antd";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../../../../../utils/getColumnSearchProps";
import SVGIcon from "../../../../../../../../../assets/Icon/index";

/**
 * Builds Ant Design column definitions for the account selection table.
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
const getAccountColumns = (
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
    key: "identificationType",
    title: "IDENTIFICATION TYPE",
    dataIndex: "identificationType",
    width: 231,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "identificationType",
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
    key: "customerTypeName",
    title: "CUSTOMER TYPE",
    dataIndex: "customerTypeName",
    width: 194,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "customerTypeName",
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
    width: 209,
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
    key: "accountName",
    title: "ACCOUNT NAME",
    dataIndex: "accountName",
    width: 189,
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
    key: "accountCategory",
    title: "CATEGORY",
    dataIndex: "accountCategory",
    width: 148,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "accountCategory",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "sor",
    title: "SOR",
    dataIndex: "sor",
    width: 100,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "sor",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "costCenter",
    title: "COST CENTER",
    dataIndex: "costCenter",
    width: 150,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "costCenter",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "meterReadingCode",
    title: "METER READING CODES",
    dataIndex: "meterReadingCode",
    width: 173,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "meterReadingCode",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "customerManagement",
    title: "CUSTOMER MANAGEMENT",
    dataIndex: "customerManagement",
    width: 246,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "customerManagement",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "classificationType",
    title: "CLASSIFICATION TYPE",
    dataIndex: "classificationType",
    width: 235,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "classificationType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "accountSegment",
    title: "SEGMENT",
    dataIndex: "accountSegment",
    width: 142,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "accountSegment",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "accountGroupType",
    title: "ACCOUNT GROUP TYPE",
    dataIndex: "accountGroupType",
    width: 239,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "accountGroupType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "premiseAddress",
    title: "PREMISE ADDRESS",
    dataIndex: "premiseAddress",
    width: 280,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "premiseAddress",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "subDistrict",
    title: "SUBDISTRICT",
    dataIndex: "subDistrict",
    width: 169,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "subDistrict",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "district",
    title: "DISTRICT",
    dataIndex: "district",
    width: 138,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "district",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "city",
    title: "CITY",
    dataIndex: "city",
    width: 150,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "city",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "country",
    title: "COUNTRY",
    dataIndex: "country",
    width: 141,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "country",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "longitude",
    title: "LONGITUDE",
    dataIndex: "longitude",
    width: 155,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "longitude",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "latitude",
    title: "LATITUDE",
    dataIndex: "latitude",
    width: 141,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "latitude",
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

export { getAccountColumns };
