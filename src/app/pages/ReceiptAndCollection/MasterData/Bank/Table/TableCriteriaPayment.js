import { FilterOutlined } from "@ant-design/icons";
import { Input } from "antd";
import moment from "moment";
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

export const columnsTableCriteria = (
  listOption = {},
  searchInput,
  searchedColumn,
  searchText,
  handleSearch
) => [
  {
    sorter: true,
    required: true,
    title: "ACCOUNT CATEGORY",
    width: 240,
    dataIndex: "accountCategory",
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
    sorter: true,
    required: true,
    title: "SERVICE TYPE",
    width: 240,
    dataIndex: "serviceType",
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
    sorter: true,
    required: true,
    title: "CUSTOMER SEGMENT",
    width: 240,
    dataIndex: "customerSegment",
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
    sorter: true,
    required: true,
    title: "ACCOUNT GROUP TYPE",
    width: 240,
    dataIndex: "accountGroup",
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
    sorter: true,
    required: true,
    title: "INDUSTRIAL SECTOR",
    width: 240,
    dataIndex: "industrialSector",
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
    sorter: true,
    required: true,
    title: "BUDGET",
    width: 240,
    dataIndex: "budget",
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
    sorter: true,
    required: true,
    title: "SOR",
    width: 240,
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
    sorter: true,
    required: true,
    title: "COST CENTER",
    width: 240,
    dataIndex: "area",
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
    sorter: true,
    required: true,
    title: "PROVINCE",
    width: 240,
    dataIndex: "province",
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
    sorter: true,
    required: true,
    title: "CITY",
    width: 240,
    dataIndex: "city",
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
    sorter: true,
    required: true,
    title: "DISTRICT",
    width: 240,
    dataIndex: "district",
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
    sorter: true,
    required: true,
    title: "SUB-DISTRICT",
    width: 240,
    dataIndex: "subDistrict",
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
    required: true,
    sorter: true,
    title: "ACCOUNT",
    width: 240,
    dataIndex: "customer",
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
    required: true,
    sorter: true,
    title: "G-SIZES",
    width: 240,
    dataIndex: "gsizes",
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
