import { FilterOutlined } from "@ant-design/icons";
import { Input } from "antd";
import Highlighter from "react-highlight-words";

const getColumnSearchProps = (
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
        style={{ padding: 8 }}
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
          style={{ marginBottom: 8, display: "block" }}
        />
      </div>
    ),
    filterIcon: (filtered) => (
      <FilterOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (data) => {
      const label = data?.label || data || "";
      if (searchedColumn === dataIndex) {
        return (
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={label ? label.toString() : ""}
          />
        );
      }
      return label || "";
    },
  };
  if (excludeRender) {
    delete obj.render;
  }
  return obj;
};

export const columnsTableCategoryInformation = (
  listOption = {},
  searchInput,
  searchedColumn,
  searchText,
  handleSearch
) => [
  {
    key: "category",
    title: "CATEGORY",
    dataIndex: "category",
    dataIndexForm: "category",
    width: 200,
    sorter: true,
    required: true,
    inputType: "select",
    option: listOption["vaCategory"],
    ...getColumnSearchProps("category", searchInput, searchedColumn, searchText, handleSearch),
  },
  {
    key: "totalDigit",
    title: "TOTAL DIGIT",
    dataIndex: "totalDigit",
    dataIndexForm: "totalDigit",
    width: 160,
    sorter: true,
    required: true,
    inputType: "text",
    ...getColumnSearchProps(
      "totalDigit",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) => {
      if (searchedColumn === "totalDigit") {
        return (
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        );
      }
      return text || "";
    },
  },
  {
    key: "staticCode",
    title: "STATIC CODE",
    dataIndex: "staticCode",
    dataIndexForm: "staticCode",
    width: 160,
    sorter: true,
    required: true,
    inputType: "text",
    ...getColumnSearchProps(
      "staticCode",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) => {
      if (searchedColumn === "staticCode") {
        return (
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        );
      }
      return text || "";
    },
  },
  {
    key: "nomenklatur1",
    title: "NOMENKLATUR 1",
    dataIndex: "nomenklatur1",
    dataIndexForm: "nomenklatur1",
    width: 200,
    sorter: true,
    required: true,
    inputType: "select",
    option: listOption["nomenklatur1"],
    ...getColumnSearchProps("nomenklatur1", searchInput, searchedColumn, searchText, handleSearch),
  },
  {
    key: "nomenklatur2",
    title: "NOMENKLATUR 2",
    dataIndex: "nomenklatur2",
    dataIndexForm: "nomenklatur2",
    width: 200,
    sorter: true,
    required: true,
    inputType: "select",
    option: listOption["nomenklatur2"],
    ...getColumnSearchProps("nomenklatur2", searchInput, searchedColumn, searchText, handleSearch),
  },
  {
    key: "display",
    title: "DISPLAY",
    dataIndex: "display",
    dataIndexForm: "display",
    width: 200,
    sorter: true,
    required: true,
    inputType: "select",
    option: listOption["display"],
    ...getColumnSearchProps("display", searchInput, searchedColumn, searchText, handleSearch),
  },
];
