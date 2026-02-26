import React, { useState, useRef, useMemo, useEffect } from "react";
import { Button, Space } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import TasklistTable from "./TasklistTable";
import TasklistErrorFallback from "./TasklistErrorFallback";
import { useGetTasklistPaginationQuery } from "../../../../../redux/slices/tasklist/tasklistSlice";

const TasklistWidget = () => {
  const searchInput = useRef(null);

  // State management
  const [page, setPage] = useState(1);
  const [loadMoreSize] = useState(20);
  const [sort, setSort] = useState("createdAt~desc");
  const [search, setSearch] = useState({});
  const [filters, setFilters] = useState({ status: "PENDING" });
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [accumulatedData, setAccumulatedData] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0); // Force refetch on refresh

  // RTK Query
  const {
    data: tasklistData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetTasklistPaginationQuery(
    {
      page: page - 1, // Backend uses 0-indexed
      size: loadMoreSize * page, // Request all data up to current page
      sort,
      filters,
      search,
      refreshKey, // Force refetch when refreshKey changes
    },
    {
      refetchOnMountOrArgChange: true, // Refetch when component mounts or args change
    }
  );

  // Update accumulated data when new data arrives
  useEffect(() => {
    if (tasklistData?.TASKS) {
      // If page is 1, replace data; otherwise append (for load more)
      if (page === 1) {
        setAccumulatedData(tasklistData.TASKS);
      } else {
        setAccumulatedData((prev) => {
          // Avoid duplicates by checking if data already exists
          const existingIds = new Set(prev.map((item) => item.TASK_ID));
          const newTasks = tasklistData.TASKS.filter(
            (task) => !existingIds.has(task.TASK_ID)
          );
          return [...prev, ...newTasks];
        });
      }
    }
  }, [tasklistData, page]);

  // Reset accumulated data when filters or search change
  useEffect(() => {
    setPage(1);
    setAccumulatedData([]);
    setRefreshKey((prev) => prev + 1); // Force refetch
  }, [sort, search, filters]);

  // Memoized data transformation
  const dataSourceWithKeys = useMemo(() => {
    if (!accumulatedData || accumulatedData.length === 0) return [];
    return accumulatedData.map((item, index) => ({
      ...item,
      key: `${item.TASK_ID}-${index}`,
    }));
  }, [accumulatedData]);

  const hasMore =
    dataSourceWithKeys.length < (tasklistData?.TOTAL_ELEMENTS || 0);

  // Handler functions
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

  const onSort = (_, __, sortInfo) => {
    const dataSort = sortInfo.order
      ? `${sortInfo.field}~${sortInfo.order === "ascend" ? "asc" : "desc"}`
      : "";
    setSort(dataSort);
    setPage(1);
  };

  const handleLoadMore = async () => {
    const nextPage = page + 1;
    const totalPages = tasklistData?.TOTAL_PAGES || 0;

    if (nextPage <= totalPages) {
      setPage(nextPage);
    }
  };

  const handleRefresh = () => {
    // Reset to first page and clear accumulated data
    setPage(1);
    setAccumulatedData([]);
    // Force refetch by incrementing refreshKey
    setRefreshKey((prev) => prev + 1);
  };

  // Error handling
  if (isError) {
    return <TasklistErrorFallback error={error} onRetry={refetch} />;
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex justify-end items-center">
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
            loading={isFetching}
          >
            Refresh
          </Button>
        </Space>
      </div>

      <TasklistTable
        data={dataSourceWithKeys}
        totalElement={tasklistData?.TOTAL_ELEMENTS || 0}
        page={page}
        onSort={onSort}
        handleSearch={handleSearch}
        handleLoadMore={handleLoadMore}
        hasMore={hasMore}
        loading={isLoading || isFetching}
        searchText={searchText}
        search={search}
        searchedColumn={searchedColumn}
        searchInput={searchInput}
      />
    </div>
  );
};

export default TasklistWidget;
