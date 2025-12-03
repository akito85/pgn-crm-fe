import Highlighter from "react-highlight-words";
import { FilterOutlined } from "@ant-design/icons";
import { Input } from "antd";
import SVGIcon from "../../../../../assets/Icon/index";
import { Tooltip } from "antd";
import { EyeOutlined } from "@ant-design/icons";

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

export const columnAttachmentData = (
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  handleDelete = () => {},
  previewFileAttachment = () => {},
  type,
) => {
  const res = [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => index + 1,
    },
    {
      title: "CATEGORY",
      dataIndex: "category",
      align: "center",
      ...getColumnSearchProps(
        "categoryName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
    },
    {
      title: "FILE NAME",
      dataIndex: "fileName",
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchProps(
        "fileName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
      render: (filename) => (
        <Tooltip placement="topLeft" title={filename}>
          {filename}
        </Tooltip>
      ),
    },
    {
      title: "UPLOAD BY",
      dataIndex: "uploadBy",
      ...getColumnSearchProps(
        "uploadBy",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
    },
    {
      title: "UPLOAD DATE",
      dataIndex: "uploadDate",
      ...getColumnSearchProps(
        "uploadDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
    },
    {
      title: "FILE SIZE",
      dataIndex: "fileSize",
      align: "center",
      ...getColumnSearchProps(
        "fileSize",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
    },
    {
      title: "ACTION",
      align: "center",
      dataIndex: "action",
      width: 120,
      fixed: "right",
      render: (v, r, i) => {
        return (
          <div className="flex w-full justify-center gap-6">
            <Tooltip title="Preview">
              <EyeOutlined
                onClick={
                  r.type !== "exist"
                    ? () => previewFileAttachment(r.base64)
                    : undefined
                }
                style={{ fontSize: "24px", color: "#0075bf" }}
              />
            </Tooltip>

            <Tooltip title="Delete">
              <SVGIcon
                name="IconDelete"
                width={24}
                className={
                  r.type === "exist" ? "disabled cursor-not-allowed" : undefined
                }
                onClick={r.type !== "exist" ? () => handleDelete(r) : undefined}
              />
            </Tooltip>
          </div>
        );
      },
      key: "action",
    },
  ];
  return type !== "detail"
    ? res.filter(
        (column) =>
          column.dataIndex !== "uploadBy" || column.dataIndex !== "uploadDate",
      )
    : res;
};
