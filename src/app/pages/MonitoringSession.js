import React, { useRef } from "react";
import LayoutMenu from "../../components/SidebarMenu/LayoutMenu";
import BaseContainer from "../../components/BaseContainer";
import TablePagination from "../../components/TablePagination";
import { useDispatch, useSelector } from "react-redux";
import { getMonitoringSession } from "../../redux/slices/monitoring_session";
import { useEffect } from "react";
import { useState } from "react";
import { Spin } from "antd";
import { renderColumn, renderDateColumn } from "../../utils";
// import { getColumnSearchPropsPaging } from "../../utils/getColumnSearchProps";

const MonitoringSession = () => {
  const { data, loading } = useSelector((state) => state.monitoring_session);
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState("");
  const searchInput = useRef(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  useEffect(() => {
    dispatch(
      getMonitoringSession({
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize,
        sort,
      }),
    );
  }, [search, page, pageSize, sort, dispatch]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch(
      selectedKeys.length === 0 ? "" : `${dataIndex}~${selectedKeys[0]}`,
    );
  };

  const column = [
    {
      key: "no",
      title: "NO",
      dataIndex: "no",
      width: "5%",
      render: (t, r, i) => (page - 1) * pageSize + i + 1,
    },
    {
      key: "no",
      title: "USERNAME",
      dataIndex: "username",
      width: "25%",
      sorter: true,
      // ...getColumnSearchPropsPaging(
      //   "username",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
      render: (text) =>
        renderColumn(
          "username",
          searchedColumn,
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      key: "no",
      title: "LAST ACCESSED MENU",
      dataIndex: "lastAccessMenu",
      width: "25%",
      sorter: true,
      // ...getColumnSearchPropsPaging(
      //   "lastAccessMenu",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
      render: (text) =>
        renderColumn(
          "lastAccessMenu",
          searchedColumn,
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      key: "no",
      title: "LAST ACCESSED",
      dataIndex: "lastAccess",
      width: "25%",
      // ...getColumnSearchPropsPaging(
      //   "lastAccess",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch,
      //   false,
      //   'datetime'
      // ),
      render: (v) =>
        renderDateColumn(
          "lastAccess",
          searchedColumn,
          searchText,
          v,
          "datetime",
          search,
        ),
    },
  ];

  const handleChange = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };
  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };
  return (
    <LayoutMenu>
      <Spin spinning={loading}>
        <BaseContainer header={"MONITORING SESSION"}>
          <TablePagination
            totalData={data?.page?.totalElements}
            columns={column}
            pageSize={pageSize}
            current={page}
            dataSource={data?.result}
            onChange={handleChange}
            onSizeChanger={handleChange}
            onSort={onSort}
          />
        </BaseContainer>
      </Spin>
    </LayoutMenu>
  );
};

export default MonitoringSession;
