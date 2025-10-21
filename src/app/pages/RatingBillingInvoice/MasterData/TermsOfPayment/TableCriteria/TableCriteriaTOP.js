import { FilterOutlined } from "@ant-design/icons";
import { Input, DatePicker } from "antd";
import Highlighter from "react-highlight-words";
import moment from "moment";

const getColumnSearchProps = (
  dataIndex,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
  excludeRender = false,
  typeFilter = "input",
) => {
  let obj = {
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
      const onDataChange = (value, dateString) => {
        setSelectedKeys(dateString ? [dateString] : []);
        handleSearch(dateString ? [dateString] : [], confirm, dataIndex);
      };
      return (
        <div
          style={{
            padding: 8,
          }}
          onKeyDown={(e) => e.stopPropagation()}
        >
          {typeFilter === "date" ? (
            <DatePicker onChange={onDataChange} format={"DD MMM YYYY"} />
          ) : null}
          {typeFilter === "datetime" ? (
            <DatePicker onChange={onDataChange} showTime={true} />
          ) : null}
          {typeFilter === "datePeriod" ? (
            <DatePicker onChange={onDataChange} picker="month" />
          ) : null}
          {typeFilter === "input" ? (
            <Input
              ref={searchInput}
              placeholder={`Search`}
              value={selectedKeys[0]}
              onChange={(e) =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onPressEnter={() =>
                handleSearch(selectedKeys, confirm, dataIndex)
              }
              style={{
                marginBottom: 8,
                display: "block",
              }}
            />
          ) : null}
        </div>
      );
    },
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

const onFilter = (dataIndex, value, record) => {
  const fixSearchText = value.toLowerCase();
  switch (dataIndex) {
    case "startDate":
    case "endDate":
      const date = record[dataIndex]
        ? moment(record[dataIndex]).format("DD MMM YYYY")
        : "";
      return date.toLowerCase().includes(fixSearchText);
    default:
      return record[dataIndex]?.label?.toLowerCase().includes(fixSearchText);
  }
};

const sorter = (fieldSort, a, b) => {
  const handleDataSort = (obj) => {
    switch (fieldSort) {
      case "startDate":
      case "endDate":
        const date = obj[fieldSort]
          ? moment(obj[fieldSort]).format("DD MMM YYYY")
          : "";
        return date.toLowerCase();
      default:
        return obj[fieldSort].label?.toLowerCase();
    }
  };
  let fa = handleDataSort(a);
  let fb = handleDataSort(b);
  return fa.localeCompare(fb);
};

export const columnsTableCriteriaTOP = (
  listOption = {},
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
) => [
  {
    sorter: true,
    title: "ACCOUNT CATEGORY",
    width: 240,
    dataIndex: "accountCategory",
    dataIndexForm: "accountCategory",
    indexValue: 22,
    inputType: "select",
    required: true,
    option: listOption["accountCategory"],
    url: "getAccountCategory",
    onFilter: (value, record) => onFilter("accountCategory", value, record),
    sorter: (a, b) => sorter("accountCategory", a, b),
    ...getColumnSearchProps(
      "accountCategory",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    sorter: true,
    title: "SERVICE TYPE",
    width: 240,
    dataIndex: "serviceType",
    dataIndexForm: "serviceType",
    indexValue: 21,
    required: true,
    inputType: "select",
    option: listOption["serviceType"],
    url: "getAccountClass",
    onFilter: (value, record) => onFilter("serviceType", value, record),
    sorter: (a, b) => sorter("serviceType", a, b),
    ...getColumnSearchProps(
      "serviceType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    sorter: true,
    title: "CUSTOMER SEGMENT",
    width: 240,
    dataIndex: "customerSegment",
    dataIndexForm: "customerSegment",
    indexValue: 19,
    inputType: "select",
    required: true,
    option: listOption["customerSegment"],
    url: "",
    onFilter: (value, record) => onFilter("customerSegment", value, record),
    sorter: (a, b) => sorter("customerSegment", a, b),
    ...getColumnSearchProps(
      "customerSegment",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    sorter: true,
    title: "ACCOUNT GROUP",
    width: 240,
    dataIndex: "accountGroup",
    dataIndexForm: "accountGroup",
    indexValue: 20,
    inputType: "select",
    required: true,
    option: listOption["accountGroup"],
    url: "getAccountGroup",
    dependDataIndex: "customerSegment",
    onFilter: (value, record) => onFilter("accountGroup", value, record),
    sorter: (a, b) => sorter("accountGroup", a, b),
    ...getColumnSearchProps(
      "accountGroup",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    sorter: true,
    title: "INDUSTRIAL SECTOR",
    width: 240,
    dataIndex: "industrialSector",
    dataIndexForm: "industrialSector",
    indexValue: 18,
    inputType: "select",
    required: true,
    option: listOption["industrialSector"],
    url: "getIndustrialSector",
    onFilter: (value, record) => onFilter("industrialSector", value, record),
    sorter: (a, b) => sorter("industrialSector", a, b),
    ...getColumnSearchProps(
      "industrialSector",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    sorter: true,
    title: "BUDGET",
    width: 240,
    dataIndex: "budget",
    dataIndexForm: "budget",
    indexValue: 17,
    inputType: "select",
    required: true,
    option: listOption["budget"],
    url: "getBudget",
    onFilter: (value, record) => onFilter("budget", value, record),
    sorter: (a, b) => sorter("budget", a, b),
    ...getColumnSearchProps(
      "budget",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    sorter: true,
    title: "SOR",
    width: 240,
    dataIndex: "sor",
    dataIndexForm: "sor",
    indexValue: 11,
    inputType: "select",
    required: true,
    option: listOption["sor"],
    url: "getSor",
    onFilter: (value, record) => onFilter("sor", value, record),
    sorter: (a, b) => sorter("sor", a, b),
    ...getColumnSearchProps(
      "sor",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    sorter: true,
    title: "COST CENTER",
    width: 240,
    dataIndex: "area",
    dataIndexForm: "area",
    indexValue: 16,
    inputType: "select",
    required: true,
    option: listOption["costCenter"],
    url: "getArea",
    onFilter: (value, record) => onFilter("area", value, record),
    sorter: (a, b) => sorter("area", a, b),
    ...getColumnSearchProps(
      "area",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    sorter: true,
    title: "PROVINCE",
    width: 240,
    dataIndex: "province",
    dataIndexForm: "province",
    indexValue: 15,
    inputType: "select",
    required: true,
    option: listOption["province"],
    url: "getProvince",
    onFilter: (value, record) => onFilter("province", value, record),
    sorter: (a, b) => sorter("province", a, b),
    ...getColumnSearchProps(
      "province",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    sorter: true,
    title: "CITY",
    width: 240,
    dataIndex: "city",
    dataIndexForm: "city",
    indexValue: 39,
    inputType: "select",
    option: listOption["city"],
    url: "getCity",
    required: true,
    dependDataIndex: "province",
    onFilter: (value, record) => onFilter("city", value, record),
    sorter: (a, b) => sorter("city", a, b),
    ...getColumnSearchProps(
      "city",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    sorter: true,
    title: "DISTRICT",
    width: 240,
    dataIndex: "district",
    dataIndexForm: "district",
    indexValue: 14,
    required: true,
    inputType: "select",
    option: listOption["district"],
    url: "getDistrict",
    dependDataIndex: "city",
    onFilter: (value, record) => onFilter("district", value, record),
    sorter: (a, b) => sorter("district", a, b),
    ...getColumnSearchProps(
      "district",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    sorter: true,
    title: "SUB-DISTRICT",
    width: 240,
    dataIndex: "subDistrict",
    dataIndexForm: "subDistrict",
    indexValue: 13,
    inputType: "select",
    option: listOption["subDistrict"],
    url: "getSubDistrict",
    required: true,
    dependDataIndex: "district",
    onFilter: (value, record) => onFilter("subDistrict", value, record),
    sorter: (a, b) => sorter("subDistrict", a, b),
    ...getColumnSearchProps(
      "subDistrict",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    sorter: true,
    title: "ACCOUNT",
    width: 240,
    dataIndex: "customer",
    dataIndexForm: "customer",
    indexValue: 12,
    required: true,
    inputType: "select",
    option: listOption["customer"],
    url: "",
    onFilter: (value, record) => onFilter("customer", value, record),
    sorter: (a, b) => sorter("customer", a, b),
    ...getColumnSearchProps(
      "customer",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    sorter: true,
    title: "G-SIZES",
    width: 240,
    dataIndex: "gsizes",
    dataIndexForm: "gsizes",
    indexValue: 23,
    required: true,
    inputType: "select",
    option: listOption["gsizes"],
    url: "getGsizes",
    onFilter: (value, record) => onFilter("gsizes", value, record),
    sorter: (a, b) => sorter("gsizes", a, b),
    ...getColumnSearchProps(
      "gsizes",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    title: "START DATE",
    dataIndex: "startDate",
    dataIndexForm: "startDate",
    indexValue: 1,
    inputType: "startDate",
    align: "center",
    required: true,
    width: 240,
    onFilter: (value, record) => onFilter("startDate", value, record),
    sorter: (a, b) => sorter("startDate", a, b),
    ...getColumnSearchProps(
      "startDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date",
    ),
    render: (index) => {
      const text = index ? moment(index).format("DD MMM YYYY") : "";
      if (searchedColumn === "startDate") {
        return (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        );
      } else {
        return text || "";
      }
    },
  },
  {
    title: "END DATE",
    dataIndex: "endDate",
    dataIndexForm: "endDate",
    inputType: "endDate",
    align: "center",
    indexValue: 1,
    width: 240,
    onFilter: (value, record) => onFilter("endDate", value, record),
    sorter: (a, b) => sorter("endDate", a, b),
    ...getColumnSearchProps(
      "endDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date",
    ),
    render: (index) => {
      const text = index ? moment(index).format("DD MMM YYYY") : "";
      if (searchedColumn === "endDate") {
        return (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        );
      } else {
        return text || "";
      }
    },
  },
];
