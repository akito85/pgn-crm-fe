import { useMemo } from "react";
import { Tooltip } from "antd";
import NxTable from "../../../../components/Nx/NxTable";
import StatusComponent from "../../../../components/StatusComponent";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";
import { getPositionHierarchyColumns } from "./getPositionHierarchyColumns";

export const columnsPositionHierarchy = [
  {
    title: "NO",
    align: "center",
    width: 60,
    key: "no",
    render: (text, object, index) => index + 1,
    fixed: "left",
  },
  {
    title: "NAME",
    dataIndex: "name",
    key: "name",
    align: "left",
    width: 250,
    sorter: true,
    ellipsis: { showTitle: false },
    render: (text) =>
      text ? (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      ) : (
        ""
      ),
  },
  {
    title: "START DATE",
    dataIndex: "startDate",
    key: "startDate",
    align: "center",
    width: 140,
    sorter: true,
  },
  {
    title: "END DATE",
    dataIndex: "endDate",
    key: "endDate",
    align: "center",
    width: 140,
    sorter: true,
  },
  {
    title: "DESCRIPTION",
    dataIndex: "description",
    key: "description",
    align: "left",
    width: 300,
    sorter: true,
    ellipsis: { showTitle: false },
    render: (text) =>
      text ? (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      ) : (
        ""
      ),
  },
  {
    title: "STATUS",
    dataIndex: "status",
    key: "status",
    align: "center",
    width: 120,
    sorter: true,
    fixed: "right",
    render: (index) => {
      const text = index
        ? index.charAt(0).toUpperCase() + index.slice(1).toLowerCase()
        : index;
      return text ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "22px",
            overflow: "hidden",
          }}
        >
          <StatusComponent colour={index} size="small">
            {text}
          </StatusComponent>
        </div>
      ) : (
        text
      );
    },
  },
];

export const TablePositionHierarchy = ({
  idTable = "position-hierarchy-table",
  userId,
  dataSource,
  loading,
  totalData,
  current,
  pageSize,
  onChange,
  onSizeChanger,
  onSort,
  onAdvanceSearch,
  columnDefinitions,
  fixedColumns,
  setFixedColumns,
  useInfiniteScroll = false,
  onLoadMore = () => {},
  hasMore = false,
  itemActions = [],
  search = {},
  searchInput,
  searchedColumn = "",
  columnSearchText = "",
  handleColumnSearch = () => {},
  ...rest
}) => {
  const actionColumns = useColumnActionPermission(
    ["View", "Activate", "Update", "duplicate"],
    itemActions
  );

  const baseColumns = useMemo(
    () =>
      getPositionHierarchyColumns({
        search,
        searchInput,
        searchedColumn,
        searchText: columnSearchText,
        handleSearch: handleColumnSearch,
      }),
    [search, searchInput, searchedColumn, columnSearchText, handleColumnSearch]
  );

  const allColumns = useMemo(
    () => [...baseColumns, ...actionColumns],
    [baseColumns, actionColumns]
  );

  return (
    <NxTable
      idTable={idTable}
      userId={userId}
      dataSource={dataSource}
      columns={allColumns}
      loading={loading}
      totalData={totalData}
      current={current}
      pageSize={pageSize}
      onChange={onChange}
      onSizeChanger={onSizeChanger}
      onSort={onSort}
      onAdvanceSearch={onAdvanceSearch}
      columnDefinitions={columnDefinitions}
      fixedColumns={fixedColumns}
      setFixedColumns={setFixedColumns}
      useInfiniteScroll={useInfiniteScroll}
      onLoadMore={onLoadMore}
      hasMore={hasMore}
      showExport={false}
      showAdvanceSearch={true}
      showSearchBar={true}
      showRefresh={true}
      tableScrolled={{ x: 1400, y: 600 }}
      {...rest}
    />
  );
};
