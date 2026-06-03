import {  hasValue, renderColumn, renderDateColumn } from "../../../../../utils";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../utils/getColumnSearchProps";

export const columns = (
  search,
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => { },
) => [
    {
      title: "NO",
      dataIndex: "no",
      align: "center",
      width: 90,
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "NAME",
      dataIndex: "annName",
      sorter: true,
      align: "left",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "annName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => renderColumn('annName', searchedColumn, searchText, text, false, 'input', search)

    },
    {
      title: "START DATE",
      dataIndex: "startDate",
      sorter: true,
      align: "center",
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
      width: 140,
      render: (v) => renderDateColumn('startDate', hasValue(search['startDate']), searchText, v, 'date', search),
    },
    {
      title: "END DATE",
      dataIndex: "endDate",
      sorter: true,
      align: "center",
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
      width: 140,
      render: (v) => renderDateColumn('endDate', hasValue(search['endDate']), searchText, v, 'date', search),
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
        handleSearch
      ),
      ellipsis: {
        showTitle: false,
      },
      sorter: true,
      render: (text) => renderColumn('description', searchedColumn, searchText, text, true, 'input', search)
    },
    {
      title: "STATUS",
      dataIndex: "status",
      sorter: true,
      fixed: "right",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "status",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
      width: 120,
      render: (text) => renderColumn('description', searchedColumn, searchText, text, false, 'status', search)
    },
  ];
