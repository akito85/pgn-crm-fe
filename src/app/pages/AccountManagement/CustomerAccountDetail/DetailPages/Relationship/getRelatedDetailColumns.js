import { hasValue, renderColumn, renderDateColumn } from "../../../../../../utils";
import { getColumnSearchPropsUseFilteredValueFE } from "../../../../../../utils/getColumnSearchProps";
import { sorterFunction } from "../../../../../../utils/sorterFunction";

const getRelatedDetailColumns = (
  search,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch
) => [
  {
    key: "no",
    title: "NO",
    width: 60,
    align: "center",
    render: (_, __, index) => index + 1,
  },
  {
    key: "accountNumber",
    title: "ACCOUNT NUMBER",
    dataIndex: "accountNumber",
    width: 200,
    sorter: (a, b) => sorterFunction("accountNumber", a, b),
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "accountNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) => {
      return renderColumn("accountNumber", searchedColumn, searchText, text, false, "input", search)
    },
  },
  {
    key: "accountName",
    title: "ACCOUNT NAME",
    dataIndex: "accountName",
    width: 200,
    sorter: (a, b) => sorterFunction("accountName", a, b),
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "accountName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) => {
      return renderColumn("accountName", searchedColumn, searchText, text, false, "input", search)
    },
  },
  {
    title: "CATEGORY",
    dataIndex: "accountCategory",
    width: 120,
    sorter: (a, b) => sorterFunction("accountCategory", a, b),
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "accountCategory",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) => {
      return renderColumn("accountCategory", searchedColumn, searchText, text, false, "input", search)
    },
  },
  {
    key: "sor",
    title: "SOR",
    dataIndex: "sor",
    width: 150,
    sorter: (a, b) => sorterFunction("sor", a, b),
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "sor",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) => {
      return renderColumn("sor", searchedColumn, searchText, text, false, "input", search)
    },
  },
  {
    key: "costCenter",
    title: "COST CENTER",
    dataIndex: "costCenter",
    width: 150,
    sorter: (a, b) => sorterFunction("costCenter", a, b),
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "costCenter",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) => {
      return renderColumn("costCenter", searchedColumn, searchText, text, false, "input", search)
    },
  },
  {
    key: "meterReadingCode",
    title: "METER READING CODES",
    dataIndex: "meterReadingCode",
    width: 200,
    sorter: (a, b) => sorterFunction("meterReadingCode", a, b),
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "meterReadingCode",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) => {
      return renderColumn("meterReadingCode", searchedColumn, searchText, text, false, "input", search)
    },
  },
  {
    key: "customerManagement",
    title: "CUSTOMER MANAGEMENT",
    dataIndex: "customerManagement",
    width: 200,
    sorter: (a, b) => sorterFunction("customerManagement", a, b),
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "customerManagement",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) => {
      return renderColumn("customerManagement", searchedColumn, searchText, text, false, "input", search)
    },
  },
  {
    key: "classificationType",
    title: "CLASSIFICATION TYPE",
    dataIndex: "classificationType",
    width: 180,
    sorter: (a, b) => sorterFunction("classificationType", a, b),
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "classificationType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) => {
      return renderColumn("classificationType", searchedColumn, searchText, text, false, "input", search)
    },
  },
  {
    key: "accountSegment",
    title: "SEGMENT",
    dataIndex: "accountSegment",
    width: 120,
    sorter: (a, b) => sorterFunction("accountSegment", a, b),
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "accountSegment",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) => {
      return renderColumn("accountSegment", searchedColumn, searchText, text, false, "input", search)
    },
  },
  {
    key: "accountGroupType",
    title: "ACCOUNT GROUP TYPE",
    dataIndex: "accountGroupType",
    width: 180,
    sorter: (a, b) => sorterFunction("accountGroupType", a, b),
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "accountGroupType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) => {
      return renderColumn("accountGroupType", searchedColumn, searchText, text, false, "input", search)
    },
  },
  {
    key: "premiseAddress",
    title: "PREMISE ADDRESS",
    dataIndex: "premiseAddress",
    width: 250,
    sorter: (a, b) => sorterFunction("premiseAddress", a, b),
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "premiseAddress",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) => {
      return renderColumn("premiseAddress", searchedColumn, searchText, text, false, "input", search)
    },
  },
  {
    key: "subDistrict",
    title: "SUBDISTRICT",
    dataIndex: "subDistrict",
    width: 120,
    sorter: (a, b) => sorterFunction("subDistrict", a, b),
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "subDistrict",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) => {
      return renderColumn("subDistrict", searchedColumn, searchText, text, false, "input", search)
    },
  },
  {
    key: "district",
    title: "DISTRICT",
    dataIndex: "district",
    width: 120,
    sorter: (a, b) => sorterFunction("district", a, b),
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "district",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) => {
      return renderColumn("district", searchedColumn, searchText, text, false, "input", search)
    },
  },
  {
    key: "city",
    title: "CITY",
    dataIndex: "city",
    width: 120,
    sorter: (a, b) => sorterFunction("district", a, b),
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "district",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) => {
      return renderColumn("district", searchedColumn, searchText, text, false, "input", search)
    },
  },
  {
    key: "country",
    title: "COUNTRY",
    dataIndex: "country",
    width: 120,
    sorter: (a, b) => sorterFunction("country", a, b),
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "country",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) => {
      return renderColumn("country", searchedColumn, searchText, text, false, "input", search)
    },
  },
  {
    key: "longitude",
    title: "LONGITUDE",
    dataIndex: "longitude",
    width: 120,
    sorter: (a, b) => sorterFunction("longitude", a, b),
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "longitude",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) => {
      return renderColumn("longitude", searchedColumn, searchText, text, false, "input", search)
    },
  },
  {
    key: "latitude",
    title: "LATITUDE",
    dataIndex: "latitude",
    width: 120,
    sorter: (a, b) => sorterFunction("latitude", a, b),
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "latitude",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) => {
      return renderColumn("latitude", searchedColumn, searchText, text, false, "input", search)
    },
  },
];

export { getRelatedDetailColumns };
