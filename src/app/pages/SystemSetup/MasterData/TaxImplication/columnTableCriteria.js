import { FilterOutlined } from "@ant-design/icons";
import { Input, Tooltip } from "antd";
import moment from "moment";
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

const onFilter = (dataIndex, value, record) => {
  const fixSearchText = value.toLowerCase();
  switch (dataIndex) {
    case "description":
      return record[dataIndex]?.toLowerCase().includes(fixSearchText);
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
        case "description":
          const desc = obj[fieldSort]
          return desc.toLowerCase();
      default:
        return obj[fieldSort].label?.toLowerCase();
    }
  };
  let fa = handleDataSort(a);
  let fb = handleDataSort(b);
  return fa?.localeCompare(fb);
};

export const columnsTableCriteria = (
  listOption = {},
  searchInput,
  searchedColumn,
  searchText,
  handleSearch
) => [
  {
    title: "SA TYPE",
    width: 240,
    onFilter: (value, record) => onFilter("saType", value, record),
    sorter: (a, b) => sorter("saType", a, b),
    dataIndex: "saType",
    dataIndexForm: "saType",
    indexValue: 266,
    inputType: "select",
    option: listOption["saType"],
    url: "getSaType",
    required: { required: true, message: "Please input your" },
    ...getColumnSearchPropsCriteria(
      "saType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    title: "WAPU FLAG",
    width: 240,
    onFilter: (value, record) => onFilter("wapuFlag", value, record),
    sorter: (a, b) => sorter("wapuFlag", a, b),
    dataIndex: "wapuFlag",
    dataIndexForm: "wapuFlag",
    indexValue: 265,
    inputType: "select",
    option: [
      { label: "Yes", value: true },
      { label: "No", value: false },
    ],
    url: "",
    required: { required: true, message: "Please input your" },
    ...getColumnSearchPropsCriteria(
      "wapuFlag",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    title: "CLASSIFICATION TYPE",
    width: 240,
    onFilter: (value, record) => onFilter("classificationType", value, record),
    sorter: (a, b) => sorter("classificationType", a, b),
    dataIndex: "classificationType",
    dataIndexForm: "classificationType",
    indexValue: 252,
    inputType: "select",
    option: listOption["classificationType"],
    url: "getClassificationType",
    required: { required: true, message: "Please input your" },
    ...getColumnSearchPropsCriteria(
      "classificationType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    title: "ACCOUNT TYPE",
    width: 240,
    onFilter: (value, record) => onFilter("accountType", value, record),
    sorter: (a, b) => sorter("accountType", a, b),
    dataIndex: "accountType",
    dataIndexForm: "accountType",
    indexValue: 251,
    inputType: "select",
    option: listOption["accountType"],
    url: "getAccountType",
    required: { required: true, message: "Please input your" },
    ...getColumnSearchPropsCriteria(
      "accountType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    title: "CORPORATE FLAG",
    width: 240,
    onFilter: (value, record) => onFilter("corporateFlag", value, record),
    sorter: (a, b) => sorter("corporateFlag", a, b),
    dataIndex: "corporateFlag",
    dataIndexForm: "corporateFlag",
    indexValue: 253,
    inputType: "select",
    option: [
      { label: "Yes", value: true },
      { label: "No", value: false },
    ],
    url: "",
    required: { required: true, message: "Please input your" },
    ...getColumnSearchPropsCriteria(
      "corporateFlag",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    title: "ACCOUNT CATEGORY",
    width: 240,
    onFilter: (value, record) => onFilter("accountCategory", value, record),
    sorter: (a, b) => sorter("accountCategory", a, b),
    dataIndex: "accountCategory",
    dataIndexForm: "accountCategory",
    indexValue: 247,
    inputType: "select",
    option: listOption["accountCategory"],
    url: "getAccountCategory",
    required: { required: true, message: "Please input your" },
    ...getColumnSearchPropsCriteria(
      "accountCategory",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    title: "ACCOUNT SEGMENT",
    width: 240,
    onFilter: (value, record) => onFilter("accountSegment", value, record),
    sorter: (a, b) => sorter("accountSegment", a, b),
    dataIndex: "accountSegment",
    dataIndexForm: "accountSegment",
    indexValue: 250,
    inputType: "select",
    option: listOption["accountSegment"],
    url: "",
    required: { required: true, message: "Please input your" },
    ...getColumnSearchPropsCriteria(
      "accountSegment",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    title: "ACCOUNT GROUP TYPE",
    width: 240,
    onFilter: (value, record) => onFilter("accountGroupType", value, record),
    sorter: (a, b) => sorter("accountGroupType", a, b),
    dataIndex: "accountGroupType",
    dataIndexForm: "accountGroupType",
    indexValue: 248,
    inputType: "select",
    option: listOption["accountGroupType"],
    url: "getAccountGroup",
    dependDataIndex: "accountSegment",
    required: { required: true, message: "Please input your" },
    ...getColumnSearchPropsCriteria(
      "accountGroupType",
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
    indexValue: 264,
    inputType: "select",
    option: listOption["sor"],
    url: "getSor",
    required: { required: true, message: "Please input your" },
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
    onFilter: (value, record) => onFilter("costCenter", value, record),
    sorter: (a, b) => sorter("costCenter", a, b),
    dataIndex: "costCenter",
    dataIndexForm: "costCenter",
    indexValue: 254,
    inputType: "select",
    option: listOption["costCenter"],
    url: "getArea",
    required: { required: true, message: "Please input your" },
    ...getColumnSearchPropsCriteria(
      "costCenter",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    title: "PREMISE COUNTRY",
    width: 240,
    onFilter: (value, record) => onFilter("premiseCountry", value, record),
    sorter: (a, b) => sorter("premiseCountry", a, b),
    dataIndex: "premiseCountry",
    dataIndexForm: "premiseCountry",
    indexValue: 257,
    inputType: "select",
    option: listOption["premiseCountry"],
    url: "getPremiseCountry",
    required: { required: true, message: "Please input your" },
    ...getColumnSearchPropsCriteria(
      "premiseCountry",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    title: "PREMISE PROVINCE",
    width: 240,
    onFilter: (value, record) => onFilter("premiseProvince", value, record),
    sorter: (a, b) => sorter("premiseProvince", a, b),
    dataIndex: "premiseProvince",
    dataIndexForm: "premiseProvince",
    indexValue: 259,
    inputType: "select",
    option: listOption["premiseProvince"],
    url: "getPremiseProvince",
    dependDataIndex: "premiseCountry",
    required: { required: true, message: "Please input your" },
    ...getColumnSearchPropsCriteria(
      "premiseProvince",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    title: "PREMISE CITY",
    width: 240,
    onFilter: (value, record) => onFilter("premiseCity", value, record),
    sorter: (a, b) => sorter("premiseCity", a, b),
    dataIndex: "premiseCity",
    dataIndexForm: "premiseCity",
    indexValue: 256,
    inputType: "select",
    option: listOption["premiseCity"],
    url: "getPremiseCity",
    dependDataIndex: "premiseProvince",
    required: { required: true, message: "Please input your" },
    ...getColumnSearchPropsCriteria(
      "premiseCity",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    title: "PREMISE DISTRICT",
    width: 240,
    onFilter: (value, record) => onFilter("premiseDistrict", value, record),
    sorter: (a, b) => sorter("premiseDistrict", a, b),
    dataIndex: "premiseDistrict",
    dataIndexForm: "premiseDistrict",
    indexValue: 258,
    inputType: "select",
    option: listOption["premiseDistrict"],
    url: "getPremiseDistrict",
    dependDataIndex: "premiseCity",
    required: { required: true, message: "Please input your" },
    ...getColumnSearchPropsCriteria(
      "premiseDistrict",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    title: "PREMISE SUB-DISTRICT",
    width: 240,
    onFilter: (value, record) => onFilter("premiseSubdistrict", value, record),
    sorter: (a, b) => sorter("premiseSubdistrict", a, b),
    dataIndex: "premiseSubdistrict",
    dataIndexForm: "premiseSubdistrict",
    indexValue: 260,
    inputType: "select",
    option: listOption["premiseSubdistrict"],
    url: "getPremiseSubdistrict",
    dependDataIndex: "premiseDistrict",
    required: { required: true, message: "Please input your" },
    ...getColumnSearchPropsCriteria(
      "premiseSubdistrict",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    title: "ACCOUNT NUMBER",
    width: 240,
    onFilter: (value, record) => onFilter("accountNumber", value, record),
    sorter: (a, b) => sorter("accountNumber", a, b),
    dataIndex: "accountNumber",
    dataIndexForm: "accountNumber",
    indexValue: 249,
    inputType: "select",
    option: listOption["accountNumber"],
    url: "getAccountNumber",
    required: { required: true, message: "Please input your" },
    ...getColumnSearchPropsCriteria(
      "accountNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
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
    ...getColumnSearchPropsCriteria(
      "startDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date"
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
    ...getColumnSearchPropsCriteria(
      "endDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date"
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
  {
    title: "DESCRIPTION",
    width: 240,
    inputType: "textarea",
    indexValue: 1,
    dataIndex: "description",
    dataIndexForm: "description",
    onFilter: (value, record) => onFilter("description", value, record),
    sorter: (a, b) => sorter("description", a, b),
    ...getColumnSearchPropsCriteria(
      "description",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    // render: (text) =>
    //   renderColumn(
    //     "description",
    //     hasValue(search["description"]),
    //     searchText,
    //     text,
    //     true,
    //     "input",
    //     search
    //   ),
    ellipsis: {
      showTitle: false,
    },
    render: (text) => {
      if (searchedColumn === "description") {
        return (
          <Tooltip placement="topLeft" title={text}>
            <Highlighter
              highlightStyle={{
                backgroundColor: "#ffc069",
                padding: 0,
              }}
              searchWords={[searchText]}
              autoEscape
              textToHighlight={text ? text.toString() : ""}
            />
          </Tooltip>
        );
      } else {
        if (text) {
          return (
            <Tooltip placement="topLeft" title={text}>
              {text}
            </Tooltip>
          );
        }
        return "";
      }
    },
  },
];
