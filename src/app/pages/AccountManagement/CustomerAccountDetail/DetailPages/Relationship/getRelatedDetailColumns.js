import moment from "moment";
import { renderColumn } from "../../../../../../utils";
import { getColumnSearchPropsUseFilteredValueFE } from "../../../../../../utils/getColumnSearchProps";
import { sorterFunction } from "../../../../../../utils/sorterFunction";
import StatusComponent from "../../../../../../components/StatusComponent";

const getRelatedDetailColumns = (
  page,
  pageSize,
  search,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch
) => [
  {
    title: "NO",
    width: 50,
    align: "center",
    render: (text, object, index) => (page - 1) * pageSize + index + 1,
  },
  {
    title: "DIRECTION FLAG",
    dataIndex: "directionFlag",
    width: 150,
    sorter: (a, b) => sorterFunction("directionFlag", a, b),
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "directionFlag",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn("directionFlag", searchedColumn, searchText, text, false, "input", search),
  },
  {
    title: "CATEGORY",
    dataIndex: "category",
    width: 150,
    sorter: (a, b) => sorterFunction("category", a, b),
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "category",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn("category", searchedColumn, searchText, text, false, "input", search),
  },
  {
    title: "SUBJECT TABLE",
    dataIndex: "subjectTable",
    width: 150,
    sorter: (a, b) => sorterFunction("subjectTable", a, b),
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "subjectTable",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn("subjectTable", searchedColumn, searchText, text, false, "input", search),
  },
  {
    title: "SUBJECT ID",
    dataIndex: "subjectId",
    width: 150,
    sorter: (a, b) => sorterFunction("subjectId", a, b),
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "subjectId",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn("subjectId", searchedColumn, searchText, text, false, "input", search),
  },
  {
    title: "SUBJECT NAME",
    dataIndex: "subjectName",
    width: 150,
    sorter: (a, b) => sorterFunction("subjectName", a, b),
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "subjectName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn("subjectName", searchedColumn, searchText, text, false, "input", search),
  },
  {
    title: "OBJECT TABLE",
    dataIndex: "objectTable",
    width: 150,
    sorter: (a, b) => sorterFunction("objectTable", a, b),
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "objectTable",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn("objectTable", searchedColumn, searchText, text, false, "input", search),
  },
  {
    title: "OBJECT ID",
    dataIndex: "objectId",
    width: 150,
    sorter: (a, b) => sorterFunction("objectId", a, b),
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "objectId",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn("objectId", searchedColumn, searchText, text, false, "input", search),
  },
  {
    title: "OBJECT NAME",
    dataIndex: "objectName",
    width: 150,
    sorter: (a, b) => sorterFunction("objectName", a, b),
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "objectName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn("objectName", searchedColumn, searchText, text, false, "input", search),
  },
  {
    title: "RELATION CODE",
    dataIndex: "relationCode",
    width: 150,
    sorter: (a, b) => sorterFunction("relationCode", a, b),
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "relationCode",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn("relationCode", searchedColumn, searchText, text, false, "input", search),
  },
  {
    title: "START DATE",
    dataIndex: "startDate",
    width: 200,
    sorter: (a, b) => sorterFunction("startDate", a, b, "date"),
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "startDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date"
    ),
    render: (text) => (text ? moment(text).format("DD MMM YYYY") : ""),
  },
  {
    title: "END DATE",
    dataIndex: "endDate",
    width: 200,
    sorter: (a, b) => sorterFunction("endDate", a, b, "date"),
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "endDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date"
    ),
    render: (text) => (text ? moment(text).format("DD MMM YYYY") : ""),
  },
  {
    title: "STATUS",
    dataIndex: "status",
    width: 100,
    sorter: (a, b) => sorterFunction("status", a, b),
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "status",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "status"
    ),
    render: (text) => (
      <div className="flex justify-center">
        <StatusComponent colour={text}>{text}</StatusComponent>
      </div>
    ),
  },
];

export default getRelatedDetailColumns;
