import { hasValue, renderColumn, renderDateColumn } from "../../../../../utils";
import {  getColumnSearchPropsUseFilteredValue } from "../../../../../utils/getColumnSearchProps";

export const columns = (
  search,
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => { },
  handleOpenDetail = () => { }
) => [
    {
      title: "NO",
      dataIndex: "no",
      align: "center",
      width: 90,
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "START DATE",
      dataIndex: "startDate",
      key: "startDate",
      sorter: true,
      align: "center",
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
      render: (v) => renderDateColumn('startDate', hasValue(search['startDate']), searchText, v, 'date', search),
    },
    {
      title: "END DATE",
      dataIndex: "endDate",
      key: "endDate",
      sorter: true,
      align: "center",
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
      render: (v) => renderDateColumn('endDate', hasValue(search['endDate']), searchText, v, 'date', search),
    },
    {
      title: "TURN ON REMARK",
      dataIndex: "remarkOn",
      align: "left",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "remarkOn",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
      ellipsis: {
        showTitle: false,
      },
      sorter: true,
      render: (text) => renderColumn('remarkOn', searchedColumn, searchText, text, true, 'input', search)
    },
    {
      title: "TURN OFF REMARK",
      dataIndex: "remarkOff",
      align: "left",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "remarkOff",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      ellipsis: {
        showTitle: false,
      },
      sorter: true,
      render: (text) => renderColumn('remarkOff', searchedColumn, searchText, text, true, 'input', search)
    },
    {
      title: "STATUS",
      dataIndex: "status",
      sorter: true,
      width: 120,
      fixed:'right',
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "status",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => renderColumn('status', searchedColumn, searchText, text, false, 'status', search)

    },
  ];
