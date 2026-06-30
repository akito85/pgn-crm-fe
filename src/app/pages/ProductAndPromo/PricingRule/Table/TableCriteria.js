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
    dataIndexForm: "accountCategory",
    indexValue: 22,
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
    dataIndex: "serviceType",
    onFilter: (value, record) => onFilter("serviceType", value, record),
    sorter: (a, b) => sorter("serviceType", a, b),
    dataIndexForm: "serviceType",
    indexValue: 21,
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
    dataIndex: "customerSegment",
    onFilter: (value, record) => onFilter("customerSegment", value, record),
    sorter: (a, b) => sorter("customerSegment", a, b),
    dataIndexForm: "customerSegment",
    indexValue: 19,
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
    dataIndex: "accountGroup",
    onFilter: (value, record) => onFilter("accountGroup", value, record),
    sorter: (a, b) => sorter("accountGroup", a, b),
    dataIndexForm: "accountGroup",
    indexValue: 20,
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
    dataIndex: "industrialSector",
    onFilter: (value, record) => onFilter("industrialSector", value, record),
    sorter: (a, b) => sorter("industrialSector", a, b),
    dataIndexForm: "industrialSector",
    indexValue: 18,
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
    dataIndex: "budget",
    onFilter: (value, record) => onFilter("budget", value, record),
    sorter: (a, b) => sorter("budget", a, b),
    dataIndexForm: "budget",
    indexValue: 17,
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
    dataIndex: "sor",
    onFilter: (value, record) => onFilter("sor", value, record),
    sorter: (a, b) => sorter("sor", a, b),
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
    dataIndex: "area",
    onFilter: (value, record) => onFilter("area", value, record),
    sorter: (a, b) => sorter("area", a, b),
    dataIndexForm: "area",
    indexValue: 16,
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
    dataIndex: "province",
    onFilter: (value, record) => onFilter("province", value, record),
    sorter: (a, b) => sorter("province", a, b),
    dataIndexForm: "province",
    indexValue: 15,
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
    dataIndex: "city",
    onFilter: (value, record) => onFilter("city", value, record),
    sorter: (a, b) => sorter("city", a, b),
    dataIndexForm: "city",
    indexValue: 39,
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
    dataIndex: "district",
    onFilter: (value, record) => onFilter("district", value, record),
    sorter: (a, b) => sorter("district", a, b),
    dataIndexForm: "district",
    indexValue: 14,
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
    dataIndex: "subDistrict",
    onFilter: (value, record) => onFilter("subDistrict", value, record),
    sorter: (a, b) => sorter("subDistrict", a, b),
    dataIndexForm: "subDistrict",
    indexValue: 13,
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
    dataIndex: "customer",
    onFilter: (value, record) => onFilter("customer", value, record),
    sorter: (a, b) => sorter("customer", a, b),
    dataIndexForm: "customer",
    indexValue: 12,
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
    title: "G-SIZES",
    width: 240,
    dataIndex: "gsizes",
    onFilter: (value, record) => onFilter("gsizes", value, record),
    sorter: (a, b) => sorter("gsizes", a, b),
    dataIndexForm: "gsizes",
    indexValue: 23,
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
