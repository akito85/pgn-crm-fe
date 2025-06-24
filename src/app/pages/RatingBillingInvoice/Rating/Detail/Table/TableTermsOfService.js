import Highlighter from "react-highlight-words";
import moment from "moment";
import { Tooltip } from "antd";
import { dateFormatting } from "../../../../../../utils";
import { getColumnSearchPropsPaging } from "../../../../../../utils/getColumnSearchProps";

export const columnsTermOfService = (
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {}
) => [
  {
    title: "NO",
    width: 50,
    dataIndex: "no",
    align: "center",
    render: (text, object, index) => (page - 1) * pageSize + index + 1,
  },
  {
    title: "TERM OF SERVICE",
    dataIndex: "tosName",
    sorter: true,
    align: "left",
    ...getColumnSearchPropsPaging(
      "tosName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    title: "START DATE",
    sorter: true,
    align: "center",
    dataIndex: "startDate",
    ...getColumnSearchPropsPaging(
      "startDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date"
    ),
    render: (text) =>
      searchedColumn === "startDate" ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[
            searchText
              ? moment(searchText, "YYYY-MM-DD").format(dateFormatting.date)
              : "",
          ]}
          autoEscape
          textToHighlight={text ? moment(text).format(dateFormatting.date) : ""}
        />
      ) : text === null ? (
        "-"
      ) : (
        moment(text).format(dateFormatting.date)
      ),
  },
  {
    title: "END DATE",
    sorter: true,
    align: "center",
    dataIndex: "endDate",
    ...getColumnSearchPropsPaging(
      "startDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "endDate"
    ),
    render: (text) =>
      searchedColumn === "endDate" ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[
            searchText
              ? moment(searchText, "YYYY-MM-DD").format(dateFormatting.date)
              : "",
          ]}
          autoEscape
          textToHighlight={text ? moment(text).format(dateFormatting.date) : ""}
        />
      ) : text === null ? (
        "-"
      ) : (
        moment(text).format(dateFormatting.date)
      ),
  },
  {
    sorter: true,
    title: "REMARK",
    dataIndex: "description",
    ellipsis: {
      showTitle: false,
    },
    ...getColumnSearchPropsPaging("description"),
    render: (text) =>
      searchedColumn === "description" ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : text ? (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      ) : (
        "-"
      ),
  },
];

export const columnsDetailTermOfService = (
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {}
) => [
  {
    title: "NO",
    width: 50,
    dataIndex: "no",
    align: "center",
    render: (text, object, index) => (page - 1) * pageSize + index + 1,
  },
  {
    title: "ATTRIBUTE",
    dataIndex: "attribute",
    sorter: true,
    align: "left",
    ...getColumnSearchPropsPaging(
      "attribute",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    title: "VALUE",
    dataIndex: "value",
    sorter: true,
    align: "right",
    ...getColumnSearchPropsPaging(
      "Value",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
];
