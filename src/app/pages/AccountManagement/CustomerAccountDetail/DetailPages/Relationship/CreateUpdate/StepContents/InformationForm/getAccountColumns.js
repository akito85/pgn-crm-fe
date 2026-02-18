import { Tooltip } from "antd";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../../../../../utils/getColumnSearchProps";
import SVGIcon from "../../../../../../../../../assets/Icon/index";

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
    filteredValue: [search?.customerNumber] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "customerNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "identificationType",
    title: "IDENTIFICATION TYPE",
    dataIndex: "identificationType",
    width: 231,
    sorter: true,
    filteredValue: [search?.identificationType] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "identificationType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "customerIdentificationNumber",
    title: "CUSTOMER IDENTIFICATION NUMBER",
    dataIndex: "customerIdentificationNumber",
    width: 343,
    sorter: true,
    filteredValue: [search?.customerIdentificationNumber] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "customerIdentificationNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "customerName",
    title: "CUSTOMER NAME",
    dataIndex: "customerName",
    width: 200,
    sorter: true,
    filteredValue: [search?.customerName] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "customerName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "customerTypeName",
    title: "CUSTOMER TYPE",
    dataIndex: "customerTypeName",
    width: 194,
    sorter: true,
    filteredValue: [search?.customerTypeName] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "customerTypeName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "accountNumber",
    title: "ACCOUNT NUMBER",
    dataIndex: "accountNumber",
    width: 209,
    sorter: true,
    filteredValue: [search?.accountNumber] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "accountNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "accountName",
    title: "ACCOUNT NAME",
    dataIndex: "accountName",
    width: 189,
    sorter: true,
    filteredValue: [search?.accountName] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "accountName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "accountCategory",
    title: "CATEGORY",
    dataIndex: "accountCategory",
    width: 148,
    sorter: true,
    filteredValue: [search?.accountCategory] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "accountCategory",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "sor",
    title: "SOR",
    dataIndex: "sor",
    width: 100,
    sorter: true,
    filteredValue: [search?.sor] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "sor",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "costCenter",
    title: "COST CENTER",
    dataIndex: "costCenter",
    width: 150,
    sorter: true,
    filteredValue: [search?.costCenter] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "costCenter",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "meterReadingCode",
    title: "METER READING CODES",
    dataIndex: "meterReadingCode",
    width: 173,
    sorter: true,
    filteredValue: [search?.meterReadingCode] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "meterReadingCode",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "customerManagement",
    title: "CUSTOMER MANAGEMENT",
    dataIndex: "customerManagement",
    width: 246,
    sorter: true,
    filteredValue: [search?.customerManagement] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "customerManagement",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "classificationType",
    title: "CLASSIFICATION TYPE",
    dataIndex: "classificationType",
    width: 235,
    sorter: true,
    filteredValue: [search?.classificationType] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "classificationType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "accountSegment",
    title: "SEGMENT",
    dataIndex: "accountSegment",
    width: 142,
    sorter: true,
    filteredValue: [search?.accountSegment] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "accountSegment",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "accountGroupType",
    title: "ACCOUNT GROUP TYPE",
    dataIndex: "accountGroupType",
    width: 239,
    sorter: true,
    filteredValue: [search?.accountGroupType] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "accountGroupType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "premiseAddress",
    title: "PREMISE ADDRESS",
    dataIndex: "premiseAddress",
    width: 280,
    sorter: true,
    filteredValue: [search?.premiseAddress] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "premiseAddress",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "subDistrict",
    title: "SUBDISTRICT",
    dataIndex: "subDistrict",
    width: 169,
    sorter: true,
    filteredValue: [search?.subDistrict] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "subDistrict",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "district",
    title: "DISTRICT",
    dataIndex: "district",
    width: 138,
    sorter: true,
    filteredValue: [search?.district] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "district",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "city",
    title: "CITY",
    dataIndex: "city",
    width: 150,
    sorter: true,
    filteredValue: [search?.city] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "city",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "country",
    title: "COUNTRY",
    dataIndex: "country",
    width: 141,
    sorter: true,
    filteredValue: [search?.country] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "country",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "longitude",
    title: "LONGITUDE",
    dataIndex: "longitude",
    width: 155,
    sorter: true,
    filteredValue: [search?.longitude] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "longitude",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "latitude",
    title: "LATITUDE",
    dataIndex: "latitude",
    width: 141,
    sorter: true,
    filteredValue: [search?.latitude] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "latitude",
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
