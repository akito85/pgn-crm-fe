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
    dataIndex: "accountCategory",
    onFilter: (value, record) => onFilter("accountCategory", value, record),
    sorter: (a, b) => sorter("accountCategory", a, b),
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
    dataIndex: "serviceType",
    onFilter: (value, record) => onFilter("serviceType", value, record),
    sorter: (a, b) => sorter("serviceType", a, b),
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
    dataIndex: "customerSegment",
    onFilter: (value, record) => onFilter("customerSegment", value, record),
    sorter: (a, b) => sorter("customerSegment", a, b),
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
    dataIndex: "accountGroup",
    onFilter: (value, record) => onFilter("accountGroup", value, record),
    sorter: (a, b) => sorter("accountGroup", a, b),
    indexValue: 20,
    inputType: "select",
    option: listOption["accountGroup"],
    url: "getAccountGroup",
    dependDataIndex: "customerSegment",
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
    onFilter: (value, record) => onFilter("industrialSector", value, record),
    sorter: (a, b) => sorter("industrialSector", a, b),
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
    dataIndex: "budget",
    onFilter: (value, record) => onFilter("budget", value, record),
    sorter: (a, b) => sorter("budget", a, b),
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
    dataIndex: "sor",
    onFilter: (value, record) => onFilter("sor", value, record),
    sorter: (a, b) => sorter("sor", a, b),
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
    dataIndex: "area",
    onFilter: (value, record) => onFilter("area", value, record),
    sorter: (a, b) => sorter("area", a, b),
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
    dataIndex: "province",
    onFilter: (value, record) => onFilter("province", value, record),
    sorter: (a, b) => sorter("province", a, b),
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
    dataIndex: "city",
    onFilter: (value, record) => onFilter("city", value, record),
    sorter: (a, b) => sorter("city", a, b),
    indexValue: 39,
    inputType: "select",
    option: listOption["city"],
    url: "getCity",
    dependDataIndex: "province",
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
    onFilter: (value, record) => onFilter("district", value, record),
    sorter: (a, b) => sorter("district", a, b),
    indexValue: 14,
    inputType: "select",
    option: listOption["district"],
    url: "getDistrict",
    dependDataIndex: "city",
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
    onFilter: (value, record) => onFilter("subDistrict", value, record),
    sorter: (a, b) => sorter("subDistrict", a, b),
    indexValue: 13,
    inputType: "select",
    option: listOption["subDistrict"],
    url: "getSubDistrict",
    dependDataIndex: "district",
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
    onFilter: (value, record) => onFilter("customer", value, record),
    sorter: (a, b) => sorter("customer", a, b),
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
    dataIndex: "gsizes",
    onFilter: (value, record) => onFilter("gsizes", value, record),
    sorter: (a, b) => sorter("gsizes", a, b),
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
    dataIndex: "accountCategoryId",
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
    dataIndex: "serviceTypeId",
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
    title: "ACCOUNT GROUP TYPE",
    width: 240,
    dataIndex: "accountGroupId",
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
    title: "CUSTOMER SEGMENT",
    width: 240,
    dataIndex: "customerSegmentId",
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
    title: "INDUSTRIAL SECTOR",
    width: 240,
    dataIndex: "industrialSectorId",
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
    dataIndex: "budgetId",
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
    dataIndex: "sorId",
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
    dataIndex: "costCenterId",
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
    dataIndex: "provinceId",
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
    dataIndex: "cityId",
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
    dataIndex: "districtId",
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
    dataIndex: "subDistrictId",
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
    dataIndex: "customerId",
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
    dataIndex: "gsizesId",
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
