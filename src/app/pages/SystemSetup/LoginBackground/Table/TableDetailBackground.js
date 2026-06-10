import { hasValue, renderColumn, renderDateColumn } from "../../../../../utils";
import { getColumnSearchProps } from "../../../../../utils/getColumnSearchProps";
import { sorterFunction } from "../../../../../utils/sorterFunction";

export const columnsDetailLoginBackground = (
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
    width: 90,
    render: (text, object, index) => (page - 1) * pageSize + index + 1,
  },
  {
    title: "ACTOR",
    dataIndex: "createdBy",
    key: "createdBy",
    sorter: (a, b) => sorterFunction('createdBy', a, b),
    align: "left",
    ...getColumnSearchProps(
      "createdBy",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) => renderColumn('createdBy', searchedColumn, searchText, text, false, 'input', search)
  },
  {
    title: "ACTION",
    dataIndex: "operation",
    key: "operation",
    sorter: (a, b) => sorterFunction('operation', a, b),
    align: "center",
    ...getColumnSearchProps(
      "operation",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      false,
      'status'
    ),
    render: (text) => renderColumn('operation', searchedColumn, searchText, text, false, 'input', search)
  },
  {
    title: "ACTION DATE",
    dataIndex: "createdDate",
    key: "createdDate",
    sorter: (a, b) => sorterFunction('createdDate', a,b ,'date'),
    align: "center",
    ...getColumnSearchProps(
      "createdDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "datetime"
    ),
    render:(text) => renderDateColumn('createdDate', hasValue(search['createdDate']), searchText, text, 'datetime', search)
  },
  {
    title: "REMARK",
    dataIndex: "remark",
    align: "left",
    ...getColumnSearchProps(
      "remark",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    ellipsis: {
      showTitle: false,
    },
    sorter: (a, b) => sorterFunction('remark', a, b),
    render: (text) => renderColumn('remark', searchedColumn, searchText, text, true, 'input', search)

  },
];
