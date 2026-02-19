import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tooltip, message } from "antd";
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

  const [fixedColumns, setFixedColumns] = useState(() => ({
    right: ["taskStatus", "priority", "action"],
    left: [],
  }));

  const handleViewAction = (record) => {
    const tappId = record.TAPP_ID || record.tappId;
    
    if (!tappId) {
      message.error('Cannot view: Missing approval ID');
      return;
    }
    
    const route = getApprovalRoute(record.MODULE || record.module, record.CATEGORY || record.category, tappId);
    navigate(route, { state: buildApprovalState(record, null) });
  };

  const actionCols = [
    {
      key: "action",
      title: "ACTION",
      width: 70,
      align: "center",
      render: (_, record) => {
        const tappId = record.TAPP_ID || record.tappId;
        return (
          <Tooltip title="View">
            <EyeOutlined
              onClick={tappId ? () => handleViewAction(record) : undefined}
              style={{
                fontSize: 18,
                color: tappId ? "#0075bf" : "#d9d9d9",
                cursor: tappId ? "pointer" : "not-allowed",
              }}
            />
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
