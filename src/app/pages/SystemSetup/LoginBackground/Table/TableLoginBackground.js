import {  hasValue, renderColumn, renderDateColumn } from "../../../../../utils";
import {  getColumnSearchPropsUseFilteredValue } from "../../../../../utils/getColumnSearchProps";

export const columnsLoginBackground = (
  search,
  page,
  pageSize,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  handleInactive = () => {}
) => [
  {
    title: "NO",
    align: "center",
    width: 60,
    render: (text, object, index) => (page - 1) * pageSize + index + 1,
  },
  {
    title: "LOGIN BACKGROUND NAME",
    dataIndex: "backgroundName",
    align: "left",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "backgroundName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    render: (text) => renderColumn('backgroundName', hasValue(search["backgroundName"]), searchText, text, false, 'input', search)
  },
  {
    title: "START DATE",
    sorter: true,
    align: "center",
    dataIndex: "startDate",
    width: 140,
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
    render: (v) => renderDateColumn('startDate', hasValue(search["startDate"]), searchText, v, 'date', search),
  },
  {
    title: "END DATE",
    sorter: true,
    align: "center",
    dataIndex: "endDate",
    width: 140,
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
    render: (v) => renderDateColumn('endDate', hasValue(search["endDate"]), searchText, v, 'date', search),
  },
  {
    title: "DESCRIPTION",
    dataIndex: "description",
    align: "left",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "description",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
    ellipsis: {
      showTitle: false,
    },
    sorter: true,
    render: (text) => renderColumn('description',hasValue(search["description"]), searchText, text, true, 'input', search)
  },
  {
    title: "STATUS",
    dataIndex: "status",
    sorter: true,
    fixed: "right",
    width: 120,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "status",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) => renderColumn('status', hasValue(search["status"]), searchText, text, false, 'status', search)
  },
];
