import React, { useEffect, useState, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spin, Tag, Tooltip } from "antd";
import CardContainer from "../../../../components/CardContainer";
import TableRBI from "../../../../components/TableRBI";
import { getColumnSearchPropsUseFilteredValue } from "../../../../utils/getColumnSearchProps";
import { getDetailPrabillingLog } from "../../../../redux/slices/rating_billing_invoice/praBilling";
import { applyFixedColumns } from "../../../../utils/applyFixedColumns";
import { hasValue, renderColumn, renderDateColumn } from "../../../../utils";
import moment from "moment";

const PrabillingDetailLog = ({ data, tabHeader }) => {
  const { detail_prabilling_log, loading_log } = useSelector(
    (state) => state.rbi_prabilling
  );

  const dispatch = useDispatch();
  const searchInput = useRef(null);

  const prabillData = data?.prabillInitPopulate || {};

  const [page, setPage] = useState(1);
  const [loadMoreSize] = useState(20); // Load more 20 data each time
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");

  const [fixedColumns, setFixedColumns] = useState(() => ({
    left: ["no"],
    right: ["status"],
  }));

  // Initial fetch
  useEffect(() => {
    if (tabHeader === "Prabilling Log" && prabillData?.initCode) {
      dispatch(
        getDetailPrabillingLog({
          initCode: prabillData.initCode,
          page: 0, // Initial page is 0
          size: 100, // Initial load 100
          sort: sort || "createdDtm~desc",
          search: Object.keys(search).length > 0 ? JSON.stringify(search) : "",
          isLoadMore: false,
        })
      );
      setPage(1);
    }
  }, [tabHeader, dispatch, prabillData?.initCode, sort, search]);

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

  // Load more handler
  const handleLoadMore = async () => {
    const nextPage = page + 1;
    const totalPages = detail_prabilling_log?.totalPages || 0;

    // Check if there's more data to load
    if (nextPage <= totalPages) {
      await dispatch(
        getDetailPrabillingLog({
          initCode: prabillData.initCode,
          page: nextPage - 1, // Backend uses 0-based indexing
          size: loadMoreSize, // Load 20 more
          sort: sort || "createdDtm~desc",
          search: Object.keys(search).length > 0 ? JSON.stringify(search) : "",
          isLoadMore: true,
        })
      );
      setPage(nextPage);
    }
  };

  const onSort = (_, __, sorter) => {
    const dataSort =
      sorter && sorter.order !== undefined
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : "";

    setSort(dataSort);
  };

  const baseColumns = useMemo(
    () => [
      {
        key: "no",
        title: "NO",
        width: 60,
        align: "center",
        render: (text, object, index) => index + 1,
      },
      {
        key: "seq",
        title: "SEQUENCE",
        dataIndex: "seq",
        width: 110,
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
            text != null ? text : "",
            false,
            "input",
            search
          ),
      },
      {
        key: "processName",
        title: "PROCESS NAME",
        dataIndex: "processName",
        width: 170,
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
            text || "",
            false,
            "input",
            search
          ),
      },
      {
        key: "activityName",
        title: "ACTIVITY NAME",
        dataIndex: "activityName",
        width: 170,
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
            text || "",
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
        filteredValue: [search?.status] || null,
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
          const statusUpper = status ? status.toUpperCase() : "INFO";

          const statusConfig = {
            SUCCESS: { text: "Success", type: "status" },
            ERROR: { text: "Failed", type: "status" },
            FAILED: { text: "Failed", type: "status" },
            WARNING: { text: "In Progress", type: "status" },
            PROCESSING: { text: "In Progress", type: "status" },
            IN_PROGRESS: { text: "In Progress", type: "status" },
            INFO: { text: "Open", type: "status" },
          };

          const config = statusConfig[statusUpper] || {
            text: "Unknown",
            type: "status",
          };

          const displayText = config.text;

          return renderColumn(
            "status",
            hasValue(search["status"]),
            searchText,
            displayText,
            false,
            "status",
            search
          );
        },
      },
      {
        key: "message",
        title: "MESSAGE",
        dataIndex: "message",
        width: 280,
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
            text || "",
            true,
            "input",
            search
          ),
      },
      {
        key: "createdDtm",
        title: "CREATED DATE",
        dataIndex: "createdDtm",
        width: 150,
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
        render: (text) => {
          const formattedDate = text
            ? moment(text).format("DD MMM YYYY HH:mm:ss")
            : "-";
          return renderDateColumn(
            "createdDtm",
            hasValue(search["createdDtm"]),
            searchText,
            formattedDate,
            "datetime",
            search
          );
        },
      },
      {
        key: "createdBy",
        title: "CREATED BY",
        dataIndex: "createdBy",
        width: 100,
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
            text || "",
            false,
            "input",
            search
          ),
      },
    ],
    [search, searchText, searchedColumn]
  );

  const allColumns = useMemo(() => {
    const columnsWithKeys = baseColumns.map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
    return columnsWithKeys;
  }, [baseColumns]);

  const processedColumns = useMemo(() => {
    return applyFixedColumns(allColumns, fixedColumns);
  }, [allColumns, fixedColumns]);

  const columnDefinitions = useMemo(() => {
    return allColumns.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [allColumns]);

  const logData = Array.isArray(detail_prabilling_log?.content)
    ? detail_prabilling_log.content
    : [];
  const totalElements = detail_prabilling_log?.totalElements || 0;

  // Calculate if there's more data
  const hasMore = logData.length < totalElements;

  return (
    <Spin spinning={loading_log}>
      <div className="-mt-6">
        <CardContainer
          header={
            <div className="flex -my-4 justify-between items-center">
              <p className="mt-[15px]">PRABILLING PROCESS LOG</p>
            </div>
          }
        >
          <div className="my-0">
            <TableRBI
              idTable="prabilling-log-table"
              dataSource={logData}
              columns={processedColumns}
              totalData={totalElements}
              tableScrolled={{ x: 700, y: 600 }}
              onSort={onSort}
              showExport={false}
              columnDefinitions={columnDefinitions}
              fixedColumns={fixedColumns}
              setFixedColumns={setFixedColumns}
              loading={loading_log}
              usePagination={false}
              useInfiniteScroll={true}
              onLoadMore={handleLoadMore}
              hasMore={hasMore}
              loadMoreThreshold={20}
              rowKey={(record) => record.id}
            />
          </div>
        </CardContainer>
      </div>
    </Spin>
  );
};

export default PrabillingDetailLog;
