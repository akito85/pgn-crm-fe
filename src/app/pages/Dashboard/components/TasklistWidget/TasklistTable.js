import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tooltip, message, Spin } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import NxTable from "../../../../../components/Nx/NxTable";
import { getTasklistColumns } from "./getTasklistColumns";
import { nxApplyFixedColumns } from "../../../../../utils/Nx/nxApplyFixedColumns";
import { getApprovalRoute, buildApprovalState } from "../../../../../utils/approvalRouteHelper";

const TasklistTable = ({
  data = [],
  totalElement = 0,
  page = 0,
  onSort = () => {},
  handleSearch = () => {},
  handleLoadMore = () => {},
  hasMore = false,
  loading = false,
  searchText = "",
  search = {},
  searchedColumn = "",
  searchInput = null,
}) => {
  const navigate = useNavigate();
  const [loadingId, setLoadingId] = useState(null);

  const [fixedColumns, setFixedColumns] = useState(() => ({
    right: ["taskStatus", "priority", "action"],
    left: [],
  }));

  const handleViewAction = (record) => {
    const tappId = record.TAPP_ID || record.tappId;
    const taskId = record.TASK_ID || record.taskId;

    if (!tappId) {
      message.error('Cannot view: Missing approval ID');
      return;
    }

    // Set spinner state first, then defer navigation so React can flush the render
    // before the component unmounts. setLoadingId(null) is intentionally omitted —
    // the component unmounts when navigate() fires, so cleanup is automatic.
    setLoadingId(taskId);
    setTimeout(() => {
      const route = getApprovalRoute(record.MODULE || record.module, record.CATEGORY || record.category, tappId);
      navigate(route, { state: buildApprovalState(record, null) });
    }, 0);
  };

  const actionCols = [
    {
      key: "action",
      title: "ACTION",
      width: 70,
      align: "center",
      render: (_, record) => {
        const tappId = record.TAPP_ID || record.tappId;
        const taskId = record.TASK_ID || record.taskId;
        const isLoading = loadingId === taskId;
        return (
          <Tooltip title="View">
            {isLoading ? (
              <Spin size="small" />
            ) : (
              <EyeOutlined
                onClick={tappId ? () => handleViewAction(record) : undefined}
                style={{
                  fontSize: 18,
                  color: tappId ? "#0075bf" : "#d9d9d9",
                  cursor: tappId ? "pointer" : "not-allowed",
                }}
              />
            )}
          </Tooltip>
        );
      },
    },
  ];

  const baseColumns = useMemo(
    () =>
      getTasklistColumns(
        search,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    [search, searchText, searchedColumn]
  );

  const allColumns = useMemo(() => {
    return [...baseColumns, ...actionCols].map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
  }, [baseColumns, actionCols]);

  const processedColumns = useMemo(() => {
    return nxApplyFixedColumns(allColumns, fixedColumns);
  }, [allColumns, fixedColumns]);

  const columnDefinitions = useMemo(() => {
    return allColumns.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [allColumns]);

  return (
    <NxTable
      idTable="tasklist-widget-table"
      dataSource={data}
      totalData={totalElement}
      current={page}
      tableScrolled={{ y: 400, x: "max-content" }}
      onSort={onSort}
      columns={processedColumns}
      usePagination={false}
      useInfiniteScroll={true}
      hasMore={hasMore}
      onLoadMore={handleLoadMore}
      loadMoreThreshold={20}
      fixedColumns={fixedColumns}
      setFixedColumns={setFixedColumns}
      columnDefinitions={columnDefinitions}
      loading={loading}
    />
  );
};

export default TasklistTable;
