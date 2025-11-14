import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spin } from "antd";
import { debounce } from "lodash";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import BreadCrumb from "../../../../components/BreadCrumb";
import BaseContainer from "../../../../components/BaseContainer";
import ButtonComponent from "../../../../components/ButtonComponent";
import SVGIcon from "../../../../assets/Icon/index";
import { 
  getGlobalLogging, 
  clearFilters,
  selectLogging,
  selectLoggingLoading,
  selectLoggingPagination 
} from "../../../../redux/slices/system_setup/logging";
import Toolbar from "../../../../components/Toolbar";
import { hasValue, renderColumn } from "../../../../utils";
import { getColumnSearchPropsUseFilteredValue } from "../../../../utils/getColumnSearchProps";
import TablePaginationNew from "../../../../components/TablePaginationNew";

const LoggingPage = () => {
  const loading_logging = useSelector(selectLoggingLoading);
  const list_logging = useSelector(selectLogging);
  const pagination = useSelector(selectLoggingPagination);

  const dispatch = useDispatch();
  const searchInput = useRef(null);

  // Local state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState({});
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");

  // Debounced fetch
  const debouncedFetch = useMemo(
    () => debounce((searchParams, currentPage, currentPageSize) => {
      dispatch(getGlobalLogging({ 
        page: currentPage - 1,
        pageSize: currentPageSize, 
        search: searchParams,
        sort: "createdDtm~desc" 
      }));
    }, 500),
    [dispatch]
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedFetch.cancel();
    };
  }, [debouncedFetch]);

  // Fetch data dengan debounce
  useEffect(() => {
    debouncedFetch(search, page, pageSize);
  }, [search, page, pageSize, debouncedFetch]);

  // Handle search - API menggunakan global search, jadi kita ambil value dari kolom manapun
  const handleSearch = useCallback((selectedKeys, confirm, dataIndex) => {
    confirm();
    const searchValue = selectedKeys[0];
    
    setSearchText(searchValue);
    setSearchedColumn(dataIndex);
    
    // Set search dengan hanya satu key-value untuk global search
    setSearch({ [dataIndex]: searchValue });
    
    // Reset ke page 1
    setPage(1);
  }, []);

  // Handle reset search
  const handleReset = useCallback((clearFilters, dataIndex) => {
    clearFilters();
    setSearch({});
    setSearchText("");
    setSearchedColumn("");
  }, []);

  // Column definitions
  const columns = useMemo(
    () => [
      {
        title: "NO",
        width: 60,
        align: "center",
        fixed: "left",
        render: (text, record, index) => (page - 1) * pageSize + index + 1,
      },
      {
        title: "ACTIVITY ID",
        dataIndex: "id",
        sorter: (a, b) => (a.id || 0) - (b.id || 0),
        align: "center",
        width: 100,
        fixed: "left",
        filteredValue: search?.id ? [search.id] : null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "id",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "id",
            hasValue(search.id),
            searchText,
            text,
            false,
            "input",
            search
          ),
      },
      {
        title: "SEQ",
        dataIndex: "seq",
        sorter: (a, b) => (a.seq || 0) - (b.seq || 0),
        align: "center",
        width: 80,
        filteredValue: search?.seq ? [search.seq] : null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "seq",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "seq",
            hasValue(search.seq),
            searchText,
            text,
            false,
            "input",
            search
          ),
      },
      {
        title: "PROCESS NAME",
        dataIndex: "processName",
        sorter: (a, b) =>
          (a.processName || "").localeCompare(b.processName || ""),
        align: "left",
        width: 250,
        filteredValue: search?.processName ? [search.processName] : null,
        ellipsis: {
          showTitle: false,
        },
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "processName",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "processName",
            hasValue(search.processName),
            searchText,
            text,
            true,
            "input",
            search
          ),
      },
      {
        title: "ACTIVITY NAME",
        dataIndex: "activityName",
        sorter: (a, b) =>
          (a.activityName || "").localeCompare(b.activityName || ""),
        align: "left",
        width: 300,
        filteredValue: search?.activityName ? [search.activityName] : null,
        ellipsis: {
          showTitle: false,
        },
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "activityName",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "activityName",
            hasValue(search.activityName),
            searchText,
            text,
            true,
            "input",
            search
          ),
      },
      {
        title: "STATUS",
        dataIndex: "status",
        sorter: (a, b) => (a.status || "").localeCompare(b.status || ""),
        align: "center",
        width: 120,
        filteredValue: search?.status ? [search.status] : null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "status",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (status) => {
          return renderColumn(
            "status",
            hasValue(search.status),
            searchText,
            status,
            false,
            "status",
            search
          );
        },
      },
      {
        title: "MESSAGE",
        dataIndex: "message",
        sorter: (a, b) => (a.message || "").localeCompare(b.message || ""),
        align: "left",
        width: 300,
        filteredValue: search?.message ? [search.message] : null,
        ellipsis: {
          showTitle: false,
        },
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "message",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "message",
            hasValue(search.message),
            searchText,
            text,
            true,
            "input",
            search
          ),
      },
      {
        title: "CREATED DATE",
        dataIndex: "createdDtm",
        sorter: (a, b) => {
          const dateA = a.createdDtm ? new Date(a.createdDtm) : new Date(0);
          const dateB = b.createdDtm ? new Date(b.createdDtm) : new Date(0);
          return dateA - dateB;
        },
        align: "center",
        width: 180,
        filteredValue: search?.createdDtm ? [search.createdDtm] : null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "createdDtm",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "createdDtm",
            hasValue(search.createdDtm),
            searchText,
            text,
            false,
            "input",
            search
          ),
      },
      {
        title: "CREATED BY",
        dataIndex: "createdBy",
        sorter: (a, b) =>
          (a.createdBy || "").localeCompare(b.createdBy || ""),
        align: "center",
        width: 120,
        filteredValue: search?.createdBy ? [search.createdBy] : null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "createdBy",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "createdBy",
            hasValue(search.createdBy),
            searchText,
            text,
            false,
            "input",
            search
          ),
      },
      {
        title: "XS1",
        dataIndex: "xs1",
        align: "center",
        width: 150,
        sorter: (a, b) => (a.xs1 || "").localeCompare(b.xs1 || ""),
        filteredValue: search?.xs1 ? [search.xs1] : null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "xs1",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "xs1",
            hasValue(search.xs1),
            searchText,
            text,
            false,
            "input",
            search
          ),
      },
    ],
    [page, pageSize, search, searchText, searchedColumn, handleSearch]
  );

  const routes = useMemo(() => [
    {
      path: "",
      breadcrumbName: "System",
    },
    {
      path: "",
      breadcrumbName: "Global Logging",
    },
  ], []);

  // Handle change page
  const handleChangePage = useCallback((pageChange, pageSizeChange) => {
    const shouldResetPage = pageSize !== pageSizeChange;
    setPage(shouldResetPage ? 1 : pageChange);
    setPageSize(pageSizeChange);
  }, [pageSize]);

  // Handle refresh dengan clear semua filter
  const handleRefresh = useCallback(() => {
    dispatch(clearFilters());
    setSearch({});
    setSearchText("");
    setSearchedColumn("");
    setPage(1);
  }, [dispatch]);

  const itemGrantAccess = useMemo(() => [
    {
      action: "Refresh",
      render: (
        <ButtonComponent
          type="submit"
          border={false}
          icon={<SVGIcon name="IconButtonRefresh" width={24} />}
          onClick={handleRefresh}
        >
          Refresh
        </ButtonComponent>
      ),
    },
  ], [handleRefresh]);

  return (
    <Spin spinning={loading_logging}>
      <LayoutMenu>
        <BreadCrumb routes={routes} />

        <div className="w-full justify-end flex gap-2">
          <Toolbar items={itemGrantAccess} />
        </div>

        <BaseContainer header="GLOBAL LOGGING ACTIVITIES">
          <div className="my-5">
            <TablePaginationNew
              columns={columns}
              dataSource={list_logging}
              totalData={pagination.totalElements}
              current={page}
              pageSize={pageSize}
              onChange={handleChangePage}
              tableScrolled={{ x: 2000, y: 600 }}
              rowKey={(record) => record.id}
            />
          </div>
        </BaseContainer>
      </LayoutMenu>
    </Spin>
  );
};

export default LoggingPage;