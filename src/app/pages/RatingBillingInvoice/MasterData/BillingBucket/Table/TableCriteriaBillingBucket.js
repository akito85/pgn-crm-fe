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

export const columnsTableCriteriaBillingBucket = (
  listOption = {},
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
) => [
  {
    required: true,
    title: "ACCOUNT CATEGORY",
    width: 240,
    onFilter: (value, record) => onFilter("accountCategory", value, record),
    sorter: (a, b) => sorter("accountCategory", a, b),
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
      handleSearch,
    ),
  },
  {
    required: true,
    title: "SERVICE TYPE",
    width: 240,
    onFilter: (value, record) => onFilter("serviceType", value, record),
    sorter: (a, b) => sorter("serviceType", a, b),
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
      handleSearch,
    ),
  },
  {
    required: true,
    title: "CUSTOMER SEGMENT",
    width: 240,
    onFilter: (value, record) => onFilter("customerSegment", value, record),
    sorter: (a, b) => sorter("customerSegment", a, b),
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
      handleSearch,
    ),
  },
  {
    required: true,
    title: "ACCOUNT GROUP",
    width: 240,
    onFilter: (value, record) => onFilter("accountGroup", value, record),
    sorter: (a, b) => sorter("accountGroup", a, b),
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
      handleSearch,
    ),
  },
  {
    required: true,
    title: "INDUSTRIAL SECTOR",
    width: 240,
    onFilter: (value, record) => onFilter("industrialSector", value, record),
    sorter: (a, b) => sorter("industrialSector", a, b),
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
      handleSearch,
    ),
  },
  {
    required: true,
    title: "BUDGET",
    width: 240,
    onFilter: (value, record) => onFilter("budget", value, record),
    sorter: (a, b) => sorter("budget", a, b),
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
      handleSearch,
    ),
  },
  {
    required: true,
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
      handleSearch,
    ),
  },
  {
    required: true,
    title: "COST CENTER",
    width: 240,
    onFilter: (value, record) => onFilter("area", value, record),
    sorter: (a, b) => sorter("area", a, b),
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
      handleSearch,
    ),
  },
  {
    required: true,
    title: "PROVINCE",
    width: 240,
    onFilter: (value, record) => onFilter("province", value, record),
    sorter: (a, b) => sorter("province", a, b),
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
      handleSearch,
    ),
  },
  {
    required: true,
    title: "CITY",
    width: 240,
    onFilter: (value, record) => onFilter("city", value, record),
    sorter: (a, b) => sorter("city", a, b),
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
      handleSearch,
    ),
  },
  {
    required: true,
    title: "DISTRICT",
    width: 240,
    onFilter: (value, record) => onFilter("district", value, record),
    sorter: (a, b) => sorter("district", a, b),
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
      handleSearch,
    ),
  },
  {
    required: true,
    title: "SUB-DISTRICT",
    width: 240,
    onFilter: (value, record) => onFilter("subDistrict", value, record),
    sorter: (a, b) => sorter("subDistrict", a, b),
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
      handleSearch,
    ),
  },
  {
    required: true,
    title: "ACCOUNT",
    width: 240,
    onFilter: (value, record) => onFilter("customer", value, record),
    sorter: (a, b) => sorter("customer", a, b),
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
      handleSearch,
    ),
  },
  {
    required: true,
    title: "G-SIZES",
    width: 240,
    onFilter: (value, record) => onFilter("gsizes", value, record),
    sorter: (a, b) => sorter("gsizes", a, b),
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
