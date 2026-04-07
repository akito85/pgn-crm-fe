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

export const columnsTableGLAccountInformation = (
  listOption = {},
  searchInput,
  searchedColumn,
  searchText,
  handleSearch
) => [
  {
    key: "type",
    title: "TYPE",
    dataIndex: "type",
    dataIndexForm: "type",
    width: 200,
    sorter: true,
    required: true,
    inputType: "select",
    option: listOption["glType"],
    ...getColumnSearchProps("type", searchInput, searchedColumn, searchText, handleSearch),
  },
  {
    key: "glAccountNumber",
    title: "GL ACCOUNT NUMBER",
    dataIndex: "glAccountNumber",
    dataIndexForm: "glAccountNumber",
    width: 240,
    sorter: true,
    required: true,
    inputType: "select",
    option: listOption["glAccount"],
    ...getColumnSearchProps("glAccountNumber", searchInput, searchedColumn, searchText, handleSearch),
  },
  {
    key: "glAccountDescription",
    title: "GL ACCOUNT DESCRIPTION",
    dataIndex: "glAccountDescription",
    dataIndexForm: "glAccountDescription",
    width: 280,
    sorter: true,
    inputType: "readonly",
    ...getColumnSearchProps(
      "glAccountDescription",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text, record) => {
      const val = record?.glAccountDescription || "";
      if (searchedColumn === "glAccountDescription") {
        return (
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={val.toString()}
          />
        );
      }
      return val;
    },
  },
  {
    key: "description",
    title: "DESCRIPTION",
    dataIndex: "description",
    dataIndexForm: "description",
    width: 240,
    sorter: true,
    inputType: "text",
    ...getColumnSearchProps(
      "description",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) => {
      if (searchedColumn === "description") {
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
];
