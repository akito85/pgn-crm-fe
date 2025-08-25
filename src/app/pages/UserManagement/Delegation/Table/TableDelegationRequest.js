import { Tooltip } from "antd";
import { dateFormatting } from "../../../../../utils";
import {  getColumnSearchPropsUseFilteredValue } from "../../../../../utils/getColumnSearchProps";
import moment from "moment";
import Highlighter from "react-highlight-words";

export const delegationRequest = (
  search,
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {}
) => [
  {
    title: "NO",
    dataIndex: "no",
    align: "center",
    width: 60,
    render: (text, object, index) => (page - 1) * pageSize + index + 1,
  },
  {
    title: "DELEGATION TO",
    dataIndex: "delegateTo",
    key: "delegateTo",
    sorter: true,
    align: "left",
    filteredValue: [search?.delegateTo] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "delegateTo",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    title: "POSITION",
    dataIndex: "positionFromDelegator",
    key: "positionFromDelegator",
    sorter: true,
    align: "left",
    filteredValue: [search?.positionFromDelegator] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "positionFromDelegator",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    ellipsis: {
      showTitle: false,
    },
    render: (text) =>
      searchedColumn === "positionFromDelegator" ? (
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
        ""
      ),
  },
  {
    title: "START DATE",
    dataIndex: "startDate",
    key: "startDate",
    sorter: true,
    align: "center",
    filteredValue: [search?.startDate] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
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
        ""
      ) : (
        moment(text).format(dateFormatting.date)
      ),
  },
  {
    title: "END DATE",
    dataIndex: "endDate",
    key: "endDate",
    sorter: true,
    align: "center",
    filteredValue: [search?.endDate] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "endDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date"
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
        ""
      ) : (
        moment(text).format(dateFormatting.date)
      ),
  },
  {
    title: "REQUEST REMARK",
    dataIndex: "requestRemark",
    align: "left",
    filteredValue: [search?.requestRemark] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "requestRemark",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    ellipsis: {
      showTitle: false,
    },
    sorter: true,
    render: (text) =>
      searchedColumn === "requestRemark" ? (
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
        ""
      ),
  },
  {
    title: "APPROVAL REMARK",
    dataIndex: "approvalRemark",
    align: "left",
    filteredValue: [search?.approvalRemark] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "approvalRemark",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    ellipsis: {
      showTitle: false,
    },
    sorter: true,
    render: (text) =>
      searchedColumn === "approvalRemark" ? (
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
        ""
      ),
  },
];
