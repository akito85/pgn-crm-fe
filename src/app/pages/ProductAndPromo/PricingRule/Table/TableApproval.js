import { FilterOutlined } from "@ant-design/icons";
import { Input } from "antd";
import Highlighter from "react-highlight-words";

const getColumnSearchProps = (
  dataIndex,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
) => ({
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
  onFilter: (value, record) =>
    record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
  onFilterDropdownOpenChange: (visible) => {
    if (visible) {
      setTimeout(() => searchInput.current?.select(), 100);
    }
  },
  render: (text) =>
    searchedColumn === dataIndex ? (
      <Highlighter
        highlightStyle={{
          backgroundColor: "#ffc069",
          padding: 0,
        }}
        searchWords={[searchText]}
        autoEscape
        textToHighlight={text ? text.toString() : ""}
      />
    ) : (
      text
    ),
});

export const columnsApproval = (
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
) => [
  {
    title: "NO",
    align: "center",
    width: 60,
    render: (text, object, index) => index + 1,
  },
  {
    title: "HIERARCHY",
    dataIndex: "approvalLevel",
    ...getColumnSearchProps(
      "approvalLevel",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    title: "POSITION",
    dataIndex: "position",
    ...getColumnSearchProps(
      "position",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
];

export const columnsExpandApproval = (
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
) => [
  {
    title: "NO",
    width: 60,
    align: "center",
    render: (text, object, index) => index + 1,
  },
  {
    title: "EMPLOYEE",
    dataIndex: "employeeName",
    ...getColumnSearchProps(
      "employeeName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
];
