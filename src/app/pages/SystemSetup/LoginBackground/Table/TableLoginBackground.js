import { useMemo } from "react";
import { Tooltip } from "antd";
import NxTable from "../../../../../components/Nx/NxTable";
import StatusComponent from "../../../../../components/StatusComponent";
import { useColumnActionPermission } from "../../../../../components/ColumnActionPermission";

export const columnsLoginBackground = [
  {
    title: "NO",
    align: "center",
    width: 60,
    key: "no",
    render: (text, object, index) => index + 1,
    fixed: "left",
  },
  {
    title: "BACKGROUND NAME",
    dataIndex: "backgroundName",
    key: "backgroundName",
    align: "left",
    sorter: true,
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
    render: (value) => {
      const text = value
        ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
        : value;
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
          <StatusComponent colour={value} size="small">
            {text}
          </StatusComponent>
        </div>
      ) : (
        text
      );
    },
  },
];

export const TableLoginBackground = ({
  idTable = "login-background-table",
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
  fixedColumns,
  setFixedColumns,
  useInfiniteScroll = false,
  onLoadMore = () => {},
  hasMore = false,
  itemActions = [],
  ...rest
}) => {
  const actionColumns = useColumnActionPermission(
    ["View", "Update", "Activate"],
    itemActions
  );

  const allColumns = useMemo(
    () => [...columnsLoginBackground, ...actionColumns],
    [actionColumns]
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
      columnDefinitions={columnsLoginBackground}
      fixedColumns={fixedColumns}
      setFixedColumns={setFixedColumns}
      useInfiniteScroll={useInfiniteScroll}
      onLoadMore={onLoadMore}
      hasMore={hasMore}
      showExport={false}
      showAdvanceSearch={true}
      showSearchBar={true}
      showRefresh={false}
      tableScrolled={{ x: 1300, y: 600 }}
      {...rest}
    />
  );
};
