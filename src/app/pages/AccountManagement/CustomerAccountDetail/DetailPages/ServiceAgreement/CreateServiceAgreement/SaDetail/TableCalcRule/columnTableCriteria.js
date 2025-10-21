import { FilterOutlined } from "@ant-design/icons";
import { Input } from "antd";
import Highlighter from "react-highlight-words";

export const getColumnSearchPropsCriteria = (
  dataIndex,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
  excludeRender = false,
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

export const columnsTableCriteria = (
  listOption = {},
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
) => [
  {
    title: "ACCOUNT CATEGORY",
    width: 240,
    dataIndex: "accountCategory",
    indexValue: 22,
    inputType: "select",
    option: listOption["accountCategory"],
    sorter: true,
    url: "getAccountCategory",
    ...getColumnSearchPropsCriteria(
      "accountCategory",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    title: "SERVICE TYPE",
    width: 240,
    dataIndex: "serviceType",
    indexValue: 21,
    inputType: "select",
    option: listOption["serviceType"],
    sorter: true,
    url: "getAccountClass",
    ...getColumnSearchPropsCriteria(
      "serviceType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    title: "ACCOUNT GROUP",
    width: 240,
    dataIndex: "accountGroup",
    indexValue: 20,
    inputType: "select",
    option: listOption["accountGroup"],
    sorter: true,
    url: "getAccountGroup",
    dependDataIndex: "customerSegment",
    ...getColumnSearchPropsCriteria(
      "accountGroup",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    title: "CUSTOMER SEGMENT",
    width: 240,
    dataIndex: "customerSegment",
    indexValue: 19,
    inputType: "select",
    option: listOption["customerSegment"],
    sorter: true,
    url: "",
    ...getColumnSearchPropsCriteria(
      "customerSegment",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    title: "INDUSTRIAL SECTOR",
    width: 240,
    dataIndex: "industrialSector",
    indexValue: 18,
    inputType: "select",
    option: listOption["industrialSector"],
    sorter: true,
    url: "getIndustrialSector",
    ...getColumnSearchPropsCriteria(
      "industrialSector",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    title: "BUDGET",
    width: 240,
    dataIndex: "budget",
    indexValue: 17,
    inputType: "select",
    option: listOption["budget"],
    sorter: true,
    url: "getBudget",
    ...getColumnSearchPropsCriteria(
      "budget",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    title: "SOR",
    width: 240,
    dataIndex: "sor",
    indexValue: 11,
    inputType: "select",
    option: listOption["sor"],
    sorter: true,
    url: "getSor",
    ...getColumnSearchPropsCriteria(
      "sor",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    title: "COST CENTER",
    width: 240,
    dataIndex: "area",
    indexValue: 16,
    inputType: "select",
    option: listOption["costCenter"],
    sorter: true,
    url: "getArea",
    ...getColumnSearchPropsCriteria(
      "area",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    title: "PROVINCE",
    width: 240,
    dataIndex: "province",
    indexValue: 15,
    inputType: "select",
    option: listOption["province"],
    sorter: true,
    url: "getProvince",
    ...getColumnSearchPropsCriteria(
      "province",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    title: "CITY",
    width: 240,
    dataIndex: "city",
    indexValue: 39,
    inputType: "select",
    option: listOption["city"],
    sorter: true,
    url: "getCity",
    dependDataIndex: "province",
    ...getColumnSearchPropsCriteria(
      "city",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    title: "DISTRICT",
    width: 240,
    dataIndex: "district",
    indexValue: 14,
    inputType: "select",
    option: listOption["district"],
    sorter: true,
    url: "getDistrict",
    dependDataIndex: "city",
    ...getColumnSearchPropsCriteria(
      "district",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    title: "SUB-DISTRICT",
    width: 240,
    dataIndex: "subDistrict",
    indexValue: 13,
    inputType: "select",
    option: listOption["subDistrict"],
    sorter: true,
    url: "getSubDistrict",
    dependDataIndex: "district",
    ...getColumnSearchPropsCriteria(
      "subDistrict",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    title: "CUSTOMER",
    width: 240,
    dataIndex: "customer",
    indexValue: 12,
    inputType: "select",
    option: listOption["customer"],
    sorter: true,
    url: "",
    ...getColumnSearchPropsCriteria(
      "customer",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    title: "G-SIZES",
    width: 240,
    dataIndex: "gsizes",
    indexValue: 23,
    inputType: "select",
    option: listOption["gsizes"],
    sorter: true,
    url: "getGsizes",
    ...getColumnSearchPropsCriteria(
      "gsizes",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
];

export const columnsTableCriteriaDetail = (
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
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
      handleSearch,
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
      handleSearch,
    ),
  },
  {
    title: "ACCOUNT GROUP",
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
      handleSearch,
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
      handleSearch,
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
      handleSearch,
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
      handleSearch,
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
      handleSearch,
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
      handleSearch,
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
      handleSearch,
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
      handleSearch,
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
      handleSearch,
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
      handleSearch,
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
      handleSearch,
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
      handleSearch,
    ),
  },
];
