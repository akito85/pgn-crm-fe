import React, { useEffect, useState, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spin, Tag } from "antd";
import BaseContainer from "../../../../components/BaseContainer";
import TablePaginationNew from "../../../../components/TablePaginationNew";
import moment from "moment";
import { hasValue, renderColumn, renderDateColumn } from "../../../../utils";
import { getColumnSearchPropsUseFilteredValue } from "../../../../utils/getColumnSearchProps";
import { getDetailPrabillingLog } from "../../../../redux/slices/rating_billing_invoice/praBilling";

const PrabillingDetailLog = ({ data, tabHeader }) => {
  const { detail_prabilling_log, loading_log } = useSelector(
    (state) => state.rbi_prabilling
  );

  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    if (tabHeader === "Prabilling Log" && data?.initCode) {
      console.log('Fetching logs for:', data.initCode);
      const backendPage = page - 1;
      
      dispatch(
        getDetailPrabillingLog({
          initCode: data.initCode,
          page: backendPage,
          size: pageSize,
        })
      );
    }
  }, [tabHeader, dispatch, data?.initCode, page, pageSize, sort, search]);

  // Handle search column
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setPage(1);
      }
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
  };

  // Handle reset filter
  const handleReset = (clearFilters, dataIndex) => {
    clearFilters();
    setSearch((prevState) => {
      const newSearch = { ...prevState };
      delete newSearch[dataIndex];
      return newSearch;
    });
    setPage(1);
  };

  // onSort
  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  // Render status tag
  const renderStatus = (status) => {
    let color;
    let text = status || 'INFO';

    switch (status?.toUpperCase()) {
      case 'SUCCESS':
        color = 'success';
        break;
      case 'ERROR':
      case 'FAILED':
        color = 'error';
        break;
      case 'WARNING':
        color = 'warning';
        break;
      case 'PROCESSING':
      case 'IN_PROGRESS':
        color = 'processing';
        break;
      default:
        color = 'default';
    }

    return <Tag color={color}>{text.toUpperCase()}</Tag>;
  };

  // Columns definition
  const columns = useMemo(
    () => [
      {
        key: "no",
        title: "NO",
        width: 60,
        align: "center",
        fixed: "left",
        render: (text, object, index) => (page - 1) * pageSize + index + 1,
      },
      {
        key: "seq",
        title: "SEQUENCE",
        dataIndex: "seq",
        width: 100,
        align: "center",
        sorter: true,
        filteredValue: [search?.seq] || null,
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
            hasValue(search["seq"]),
            searchText,
            text,
            false,
            "input",
            search
          ),
      },
      {
        key: "processName",
        title: "PROCESS NAME",
        dataIndex: "processName",
        width: 250,
        sorter: true,
        filteredValue: [search?.processName] || null,
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
            hasValue(search["processName"]),
            searchText,
            text,
            false,
            "input",
            search
          ),
      },
      {
        key: "activityName",
        title: "ACTIVITY NAME",
        dataIndex: "activityName",
        width: 250,
        sorter: true,
        filteredValue: [search?.activityName] || null,
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
            hasValue(search["activityName"]),
            searchText,
            text,
            false,
            "input",
            search
          ),
      },
      {
        key: "status",
        title: "STATUS",
        dataIndex: "status",
        width: 120,
        align: "center",
        sorter: true,
        // render: (status) => renderStatus(status),
      },
      {
        key: "message",
        title: "MESSAGE",
        dataIndex: "message",
        width: 350,
        sorter: true,
        filteredValue: [search?.message] || null,
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
            hasValue(search["message"]),
            searchText,
            text,
            true,
            "input",
            search
          ),
      },
      {
        key: "createdDtm",
        title: "CREATED DATE",
        dataIndex: "createdDtm",
        width: 180,
        align: "center",
        sorter: true,
        filteredValue: [search?.createdDtm] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "createdDtm",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
          "datetime"
        ),
        render: (text) =>
          renderDateColumn(
            "createdDtm",
            hasValue(search["createdDtm"]),
            searchText,
            text,
            "datetime",
            search
          ),
      },
      {
        key: "createdBy",
        title: "CREATED BY",
        dataIndex: "createdBy",
        width: 150,
        align: "center",
        sorter: true,
        filteredValue: [search?.createdBy] || null,
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
            hasValue(search["createdBy"]),
            searchText,
            text,
            false,
            "input",
            search
          ),
      },
    ],
    [page, pageSize, search, searchText, searchedColumn]
  );

  // Change table pagination
  const handleChangePage = (pageChange, pageSizeChange) => {
    if (pageSize !== pageSizeChange) {
      setPage(1);
      setPageSize(pageSizeChange);
    } else {
      setPage(pageChange);
    }
  };

  // Extract data dari response
  const logData = detail_prabilling_log?.content || [];
  const totalElements = detail_prabilling_log?.totalElements || 0;

  return (
    <Spin spinning={loading_log}>
      <BaseContainer header={"PRABILLING PROCESS LOG"}>
        <div className="my-5">
          <TablePaginationNew
            columns={columns}
            dataSource={logData}
            totalData={totalElements}
            current={page}
            pageSize={pageSize}
            onChange={handleChangePage}
            tableScrolled={{ x: 1800, y: 600 }}
            onSort={onSort}
            rowKey={(record) => record.id}
          />
        </div>
      </BaseContainer>
    </Spin>
  );
};

export default PrabillingDetailLog;