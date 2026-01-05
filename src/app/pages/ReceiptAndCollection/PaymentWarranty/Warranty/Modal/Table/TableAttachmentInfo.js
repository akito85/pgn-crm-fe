import Highlighter from "react-highlight-words";
import { Tooltip } from "antd";
import moment from "moment";
import { dateFormatting } from "../../../../../../../utils";
import { getColumnSearchPropsPaging } from "../../../../../../../utils/getColumnSearchProps";

export const columnsAttachmentInfo = (
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {}
) => [
  {
    key: "no",
    title: "NO",
    isClassification: true,
    width: 60,
    render: (text, object, index) => (page - 1) * pageSize + index + 1,
  },
  {
    key: "category",
    title: "CATEGORY",
    dataIndex: "category",
    width: 180,
    sorter: (a, b) => a?.category?.localeCompare(b?.category),
    ...getColumnSearchPropsPaging(
      "category",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    onFilter: (value, record) =>
      record["category"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  },
  {
    key: "fileName",
    title: "FILENAME",
    dataIndex: "fileName",
    width: 150,
    sorter: (a, b) => a?.fileName?.localeCompare(b?.fileName),
    ...getColumnSearchPropsPaging(
      "fileName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    onFilter: (value, record) =>
      record["fileName"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  },
  {
    key: "fileSize",
    title: "FILE SIZE",
    dataIndex: "fileSize",
    width: 180,
    sorter: (a, b) => a?.fileSize?.localeCompare(b?.fileSize),
    ...getColumnSearchPropsPaging(
      "fileSize",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    onFilter: (value, record) =>
      record["fileSize"]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  },
];