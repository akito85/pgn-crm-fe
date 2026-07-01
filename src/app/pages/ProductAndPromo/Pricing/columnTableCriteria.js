import { FilterOutlined } from "@ant-design/icons";
import { Input } from "antd";
import Highlighter from "react-highlight-words";

export const getColumnSearchPropsCriteria = (
  dataIndex,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
  excludeRender = false
) => {
  let obj = {
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
      </div>
    ),
    filterIcon: (filtered) => (
      <FilterOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (data) => {
      const label = data?.label || "";
      if (searchedColumn === dataIndex) {
        return (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={label ? label.toString() : ""}
          />
        );
      } else {
        return label || "";
      }
    },
  };
  if (excludeRender) {
    delete obj.render;
  }
  return obj;
};

const onFilter = (dataIndex, value, record) =>
  record[dataIndex]?.label.toLowerCase().includes(value.toLowerCase());

const sorter = (fieldSort, a, b) => {
  const handleDataSort = (obj) => {
    return obj[fieldSort].label.toString().toLowerCase();
  };
  let fa = handleDataSort(a);
  let fb = handleDataSort(b);
  return fa.localeCompare(fb);
};

export const columnsTableCriteria = (
  listOption = {},
  searchInput,
  searchedColumn,
  searchText,
  handleSearch
) => [
  {
    title: "ACCOUNT CATEGORY",
    width: 240,
    onFilter: (value, record) => onFilter("accountCategoryId", value, record),
    sorter: (a, b) => sorter("accountCategoryId", a, b),
    dataIndex: "accountCategoryId",
    dataIndexForm: "accountCategory",
    indexValue: 22,
    inputType: "select",
    option: listOption["accountCategory"],
    url: "getAccountCategory",
    ...getColumnSearchPropsCriteria(
      "accountCategory",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    title: "SERVICE TYPE",
    width: 240,
    onFilter: (value, record) => onFilter("serviceTypeId", value, record),
    sorter: (a, b) => sorter("serviceTypeId", a, b),
    dataIndex: "serviceTypeId",
    dataIndexForm: "serviceType",
    indexValue: 21,
    inputType: "select",
    option: listOption["serviceType"],
    url: "getAccountClass",
    ...getColumnSearchPropsCriteria(
      "serviceType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    title: "CUSTOMER SEGMENT",
    width: 240,
    onFilter: (value, record) => onFilter("customerSegmentId", value, record),
    sorter: (a, b) => sorter("customerSegmentId", a, b),
    dataIndex: "customerSegmentId",
    dataIndexForm: "customerSegment",
    indexValue: 19,
    inputType: "select",
    option: listOption["customerSegment"],
    url: "",
    ...getColumnSearchPropsCriteria(
      "customerSegment",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    title: "ACCOUNT GROUP TYPE",
    width: 240,
    onFilter: (value, record) => onFilter("accountGroupId", value, record),
    sorter: (a, b) => sorter("accountGroupId", a, b),
    dataIndex: "accountGroupId",
    dataIndexForm: "accountGroup",
    indexValue: 20,
    inputType: "select",
    option: listOption["accountGroup"],
    url: "getAccountGroup",
    dependDataIndex: "customerSegmentId",
    ...getColumnSearchPropsCriteria(
      "accountGroup",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    title: "INDUSTRIAL SECTOR",
    width: 240,
    onFilter: (value, record) => onFilter("industrialSectorId", value, record),
    sorter: (a, b) => sorter("industrialSectorId", a, b),
    dataIndex: "industrialSectorId",
    dataIndexForm: "industrialSector",
    indexValue: 18,
    inputType: "select",
    option: listOption["industrialSector"],
    url: "getIndustrialSector",
    ...getColumnSearchPropsCriteria(
      "industrialSector",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    title: "BUDGET",
    width: 240,
    onFilter: (value, record) => onFilter("budgetId", value, record),
    sorter: (a, b) => sorter("budgetId", a, b),
    dataIndex: "budgetId",
    dataIndexForm: "budget",
    indexValue: 17,
    inputType: "select",
    option: listOption["budget"],
    url: "getBudget",
    ...getColumnSearchPropsCriteria(
      "budget",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    title: "SOR",
    width: 240,
    onFilter: (value, record) => onFilter("sorId", value, record),
    sorter: (a, b) => sorter("sorId", a, b),
    dataIndex: "sorId",
    dataIndexForm: "sor",
    indexValue: 11,
    inputType: "select",
    option: listOption["sor"],
    url: "getSor",
    ...getColumnSearchPropsCriteria(
      "sor",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    title: "COST CENTER",
    width: 240,
    onFilter: (value, record) => onFilter("areaId", value, record),
    sorter: (a, b) => sorter("areaId", a, b),
    dataIndex: "areaId",
    dataIndexForm: "area",
    indexValue: 16,
    inputType: "select",
    option: listOption["costCenter"],
    url: "getArea",
    ...getColumnSearchPropsCriteria(
      "area",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    title: "PROVINCE",
    width: 240,
    onFilter: (value, record) => onFilter("provinceId", value, record),
    sorter: (a, b) => sorter("provinceId", a, b),
    dataIndex: "provinceId",
    dataIndexForm: "province",
    indexValue: 15,
    inputType: "select",
    option: listOption["province"],
    url: "getProvince",
    ...getColumnSearchPropsCriteria(
      "province",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    title: "CITY",
    width: 240,
    onFilter: (value, record) => onFilter("cityId", value, record),
    sorter: (a, b) => sorter("cityId", a, b),
    dataIndex: "cityId",
    dataIndexForm: "city",
    indexValue: 39,
    inputType: "select",
    option: listOption["city"],
    url: "getCity",
    dependDataIndex: "provinceId",
    ...getColumnSearchPropsCriteria(
      "city",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    title: "DISTRICT",
    width: 240,
    onFilter: (value, record) => onFilter("districtId", value, record),
    sorter: (a, b) => sorter("districtId", a, b),
    dataIndex: "districtId",
    dataIndexForm: "district",
    indexValue: 14,
    inputType: "select",
    option: listOption["district"],
    url: "getDistrict",
    dependDataIndex: "cityId",
    ...getColumnSearchPropsCriteria(
      "district",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    title: "SUB-DISTRICT",
    width: 240,
    onFilter: (value, record) => onFilter("subDistrictId", value, record),
    sorter: (a, b) => sorter("subDistrictId", a, b),
    dataIndex: "subDistrictId",
    dataIndexForm: "subDistrict",
    indexValue: 13,
    inputType: "select",
    option: listOption["subDistrict"],
    url: "getSubDistrict",
    dependDataIndex: "districtId",
    ...getColumnSearchPropsCriteria(
      "subDistrict",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    title: "CUSTOMER",
    width: 240,
    onFilter: (value, record) => onFilter("customerId", value, record),
    sorter: (a, b) => sorter("customerId", a, b),
    dataIndex: "customerId",
    dataIndexForm: "customer",
    indexValue: 12,
    inputType: "select",
    option: listOption["customer"],
    url: "",
    ...getColumnSearchPropsCriteria(
      "customer",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    title: "G-SIZES",
    width: 240,
    onFilter: (value, record) => onFilter("gsizesId", value, record),
    sorter: (a, b) => sorter("gsizesId", a, b),
    dataIndex: "gsizesId",
    dataIndexForm: "gsizes",
    indexValue: 23,
    inputType: "select",
    option: listOption["gsizes"],
    url: "getGsizes",
    ...getColumnSearchPropsCriteria(
      "gsizes",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
];

export const columnsTableCriteriaDetail = (
  searchInput,
  searchedColumn,
  searchText,
  handleSearch
) => [
  {
    title: "ACCOUNT CATEGORY",
    width: 240,
    dataIndex: "accountCategory",
    indexValue: 22,
    inputType: "select",
    sorter: true,
    ...getColumnSearchPropsCriteria(
      "accountCategory",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    title: "SERVICE TYPE",
    width: 240,
    dataIndex: "serviceType",
    indexValue: 21,
    inputType: "select",
    sorter: true,
    ...getColumnSearchPropsCriteria(
      "serviceType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    title: "CUSTOMER SEGMENT",
    width: 240,
    dataIndex: "customerSegment",
    indexValue: 19,
    inputType: "select",
    sorter: true,
    ...getColumnSearchPropsCriteria(
      "customerSegment",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    title: "ACCOUNT GROUP TYPE",
    width: 240,
    dataIndex: "accountGroup",
    indexValue: 20,
    inputType: "select",
    sorter: true,
    ...getColumnSearchPropsCriteria(
      "accountGroup",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    title: "INDUSTRIAL SECTOR",
    width: 240,
    dataIndex: "industrialSector",
    indexValue: 18,
    inputType: "select",
    sorter: true,
    ...getColumnSearchPropsCriteria(
      "industrialSector",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    title: "BUDGET",
    width: 240,
    dataIndex: "budget",
    indexValue: 17,
    inputType: "select",
    sorter: true,
    ...getColumnSearchPropsCriteria(
      "budget",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    title: "SOR",
    width: 240,
    dataIndex: "sor",
    indexValue: 11,
    inputType: "select",
    sorter: true,
    ...getColumnSearchPropsCriteria(
      "sor",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    title: "COST CENTER",
    width: 240,
    dataIndex: "costCenter",
    indexValue: 16,
    inputType: "select",
    sorter: true,
    ...getColumnSearchPropsCriteria(
      "costCenter",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    title: "PROVINCE",
    width: 240,
    dataIndex: "province",
    indexValue: 15,
    inputType: "select",
    sorter: true,
    ...getColumnSearchPropsCriteria(
      "province",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    title: "CITY",
    width: 240,
    dataIndex: "city",
    indexValue: 39,
    inputType: "select",
    sorter: true,
    ...getColumnSearchPropsCriteria(
      "city",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    title: "DISTRICT",
    width: 240,
    dataIndex: "district",
    indexValue: 14,
    inputType: "select",
    sorter: true,
    ...getColumnSearchPropsCriteria(
      "district",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    title: "SUB-DISTRICT",
    width: 240,
    dataIndex: "subDistrict",
    indexValue: 13,
    inputType: "select",
    sorter: true,
    ...getColumnSearchPropsCriteria(
      "subDistrict",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    title: "CUSTOMER",
    width: 240,
    dataIndex: "customer",
    indexValue: 12,
    inputType: "select",
    sorter: true,
    ...getColumnSearchPropsCriteria(
      "customer",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    title: "G-SIZES",
    width: 240,
    dataIndex: "gsizes",
    indexValue: 23,
    inputType: "select",
    sorter: true,
    ...getColumnSearchPropsCriteria(
      "gsizes",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
];
