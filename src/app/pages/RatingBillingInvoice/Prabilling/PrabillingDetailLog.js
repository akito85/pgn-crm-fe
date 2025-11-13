import React, { useEffect, useState, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spin, Tag, Tooltip } from "antd";
import BaseContainer from "../../../../components/BaseContainer";
import TablePaginationNew from "../../../../components/TablePaginationNew";
import { getColumnSearchPropsUseFilteredValue } from "../../../../utils/getColumnSearchProps";
import { getDetailPrabillingLog } from "../../../../redux/slices/rating_billing_invoice/praBilling";

const PrabillingDetailLog = ({ data, tabHeader }) => {
  const { detail_prabilling_log, loading_log } = useSelector(
    (state) => state.rbi_prabilling
  );

  const dispatch = useDispatch();
  const searchInput = useRef(null);
  
  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");

  // Fetch data
  useEffect(() => {
    if (tabHeader === "Prabilling Log" && data?.initCode) {
      dispatch(
        getDetailPrabillingLog({
          initCode: data.initCode,
          page: page - 1,
          size: pageSize,
          sort: sort,
          search: Object.keys(search).length > 0 ? JSON.stringify(search) : "",
        })
      );
    }
  }, [tabHeader, dispatch, data?.initCode, page, pageSize, sort, search]);

  // Handle search
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

  // Handle reset search
  const handleReset = (clearFilters, dataIndex) => {
    clearFilters();
    setSearch((prevState) => {
      const newSearch = { ...prevState };
      delete newSearch[dataIndex];
      return newSearch;
    });
    setSearchText("");
  };

  // Handle sort
  const onSort = (_, __, sorter) => {
    const dataSort =
      sorter.order !== undefined
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : "";
    
    setSort(dataSort);
  };

  // Render status tag
  const renderStatus = (status) => {
    if (!status) return <Tag color="default">INFO</Tag>;

    let color;
    const statusUpper = status.toUpperCase();

    switch (statusUpper) {
      case "SUCCESS":
        color = "success";
        break;
      case "ERROR":
      case "FAILED":
        color = "error";
        break;
      case "WARNING":
        color = "warning";
        break;
      case "PROCESSING":
      case "IN_PROGRESS":
        color = "processing";
        break;
      default:
        color = "default";
    }

    return <Tag color={color}>{statusUpper}</Tag>;
  };

  // Columns definition
  const columns = useMemo(
    () => [
      {
        key: "no",
        title: "NO",
        width: 60,
        align: "center",
        render: (text, object, index) => (page - 1) * pageSize + index + 1,
      },
      {
        key: "seq",
        title: "SEQUENCE",
        dataIndex: "seq",
        width: 100,
        align: "center",
        sorter: true,
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
        render: (text) => (text != null ? text : "-"),
      },
      {
        key: "processName",
        title: "PROCESS NAME",
        dataIndex: "processName",
        width: 250,
        sorter: true,
        filteredValue: search?.processName ? [search.processName] : null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "processName",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) => text || "-",
      },
      {
        key: "activityName",
        title: "ACTIVITY NAME",
        dataIndex: "activityName",
        width: 250,
        sorter: true,
        filteredValue: search?.activityName ? [search.activityName] : null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "activityName",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) => text || "-",
      },
      {
        key: "status",
        title: "STATUS",
        dataIndex: "status",
        width: 120,
        align: "center",
        sorter: true,
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
        render: (status) => renderStatus(status),
      },
      {
        key: "message",
        title: "MESSAGE",
        dataIndex: "message",
        width: 400,
        sorter: true,
        filteredValue: search?.message ? [search.message] : null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "message",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) => (
          <Tooltip title={text}>
            <div style={{ 
              overflow: "hidden", 
              textOverflow: "ellipsis",
              whiteSpace: "nowrap" 
            }}>
              {text || "-"}
            </div>
          </Tooltip>
        ),
      },
      {
        key: "createdDtm",
        title: "CREATED DATE",
        dataIndex: "createdDtm",
        width: 180,
        align: "center",
        sorter: true,
        filteredValue: search?.createdDtm ? [search.createdDtm] : null,
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
        render: (text) => {
          if (!text) return "-";
          try {
            return new Date(text).toLocaleString('id-ID', {
              year: 'numeric',
              month: 'short',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            });
          } catch (e) {
            return text;
          }
        },
      },
      {
        key: "createdBy",
        title: "CREATED BY",
        dataIndex: "createdBy",
        width: 150,
        align: "center",
        sorter: true,
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
        render: (text) => text || "-",
      },
    ],
    [page, pageSize, search, searchText, searchedColumn]
  );

  // Change table pagination
  const handleChangePage = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  // Extract data dari response
  const logData = Array.isArray(detail_prabilling_log?.content) 
    ? detail_prabilling_log.content 
    : [];
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
            onSort={onSort}
            tableScrolled={{ x: 1800, y: 600 }}
            rowKey={(record) => record.id}
            useFixColumn={true}
            defaultFixedColumns={{
              no: "left",
            }}
            type="BE"
            loading={loading_log}
          />
        </div>
      </BaseContainer>
    </Spin>
  );
};

export default PrabillingDetailLog;