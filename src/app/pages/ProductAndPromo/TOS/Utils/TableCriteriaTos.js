import { FilterOutlined } from "@ant-design/icons";
import { Input } from "antd";
import Highlighter from "react-highlight-words";

const getColumnSearchProps = (
  dataIndex,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
  excludeRender = false,
  onFilter = (value, record) =>
    record[dataIndex]?.toString()?.toLowerCase()?.includes(value.toLowerCase())
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
    // onFilter: onFilter,
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
    return obj[fieldSort]?.label.toString().toLowerCase();
  };
  let fa = handleDataSort(a);
  let fb = handleDataSort(b);
  return fa.localeCompare(fb);
};

export const columnsTableCriteriaTOS = (
  listOption = {},
  searchInput,
  searchedColumn,
  searchText,
  handleSearch
) => [
  {
    title: "ACCOUNT CATEGORY",
    width: 240,
    onFilter: (value, record) => onFilter("accountCategory", value, record),
    sorter: (a, b) => sorter("accountCategory", a, b),
    dataIndex: "accountCategory",
    dataIndexForm: "accountCategory",
    indexValue: 35,
    inputType: "select",
    option: listOption["accountCategory"],
    url: "getAccountCategory",
    ...getColumnSearchProps(
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
    onFilter: (value, record) => onFilter("serviceType", value, record),
    sorter: (a, b) => sorter("serviceType", a, b),
    dataIndex: "serviceType",
    dataIndexForm: "serviceType",
    indexValue: 34,
    inputType: "select",
    option: listOption["serviceType"],
    url: "getAccountClass",
    ...getColumnSearchProps(
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
    onFilter: (value, record) => onFilter("customerSegment", value, record),
    sorter: (a, b) => sorter("customerSegment", a, b),
    dataIndex: "customerSegment",
    dataIndexForm: "customerSegment",
    indexValue: 32,
    inputType: "select",
    option: listOption["customerSegment"],
    url: "",
    ...getColumnSearchProps(
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
    onFilter: (value, record) => onFilter("accountGroup", value, record),
    sorter: (a, b) => sorter("accountGroup", a, b),
    dataIndex: "accountGroup",
    dataIndexForm: "accountGroup",
    indexValue: 33,
    inputType: "select",
    option: listOption["accountGroup"],
    url: "getAccountGroup",
    dependDataIndex: "customerSegment",
    ...getColumnSearchProps(
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
    onFilter: (value, record) => onFilter("industrialSector", value, record),
    sorter: (a, b) => sorter("industrialSector", a, b),
    dataIndex: "industrialSector",
    dataIndexForm: "industrialSector",
    indexValue: 31,
    inputType: "select",
    option: listOption["industrialSector"],
    url: "getIndustrialSector",
    ...getColumnSearchProps(
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
    onFilter: (value, record) => onFilter("budget", value, record),
    sorter: (a, b) => sorter("budget", a, b),
    dataIndex: "budget",
    dataIndexForm: "budget",
    indexValue: 30,
    inputType: "select",
    option: listOption["budget"],
    url: "getBudget",
    ...getColumnSearchProps(
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
    onFilter: (value, record) => onFilter("sor", value, record),
    sorter: (a, b) => sorter("sor", a, b),
    dataIndex: "sor",
    dataIndexForm: "sor",
    indexValue: 11,
    inputType: "select",
    option: listOption["sor"],
    url: "getSor",
    ...getColumnSearchProps(
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
    onFilter: (value, record) => onFilter("area", value, record),
    sorter: (a, b) => sorter("area", a, b),
    dataIndex: "area",
    dataIndexForm: "area",
    indexValue: 29,
    inputType: "select",
    option: listOption["costCenter"],
    url: "getArea",
    ...getColumnSearchProps(
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
    onFilter: (value, record) => onFilter("province", value, record),
    sorter: (a, b) => sorter("province", a, b),
    dataIndex: "province",
    dataIndexForm: "province",
    indexValue: 28,
    inputType: "select",
    option: listOption["province"],
    url: "getProvince",
    ...getColumnSearchProps(
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
    onFilter: (value, record) => onFilter("city", value, record),
    sorter: (a, b) => sorter("city", a, b),
    dataIndex: "city",
    dataIndexForm: "city",
    indexValue: 139,
    inputType: "select",
    option: listOption["city"],
    url: "getCity",
    dependDataIndex: "province",
    ...getColumnSearchProps(
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
    onFilter: (value, record) => onFilter("district", value, record),
    sorter: (a, b) => sorter("district", a, b),
    dataIndex: "district",
    dataIndexForm: "district",
    indexValue: 27,
    inputType: "select",
    option: listOption["district"],
    url: "getDistrict",
    dependDataIndex: "city",
    ...getColumnSearchProps(
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
    onFilter: (value, record) => onFilter("subDistrict", value, record),
    sorter: (a, b) => sorter("subDistrict", a, b),
    dataIndex: "subDistrict",
    dataIndexForm: "subDistrict",
    indexValue: 26,
    inputType: "select",
    option: listOption["subDistrict"],
    url: "getSubDistrict",
    dependDataIndex: "district",
    ...getColumnSearchProps(
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
    onFilter: (value, record) => onFilter("customer", value, record),
    sorter: (a, b) => sorter("customer", a, b),
    dataIndex: "customer",
    dataIndexForm: "customer",
    indexValue: 25,
    inputType: "select",
    option: listOption["customer"],
    url: "",
    ...getColumnSearchProps(
      "customer",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    title: "PRODUCT",
    width: 240,
    onFilter: (value, record) => onFilter("product", value, record),
    sorter: (a, b) => sorter("product", a, b),
    dataIndex: "product",
    dataIndexForm: "product",
    indexValue: 38,
    inputType: "select",
    option: listOption["product"],
    url: "",
    ...getColumnSearchProps(
      "product",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    title: "G-SIZES",
    width: 240,
    onFilter: (value, record) => onFilter("gsizes", value, record),
    sorter: (a, b) => sorter("gsizes", a, b),
    dataIndex: "gsizes",
    dataIndexForm: "gsizes",
    indexValue: 36,
    inputType: "select",
    option: listOption["gsizes"],
    url: "getGsizes",
    ...getColumnSearchProps(
      "gsizes",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
];
