import { Tooltip } from "antd";
import NxTable from "../../../../components/Nx/NxTable";
import { renderDateConverter } from "../../../../utils";

export const columnsMonitoringSession = [
  {
    title: "NO",
    align: "center",
    width: 60,
    key: "no",
    render: (text, object, index) => index + 1,
    fixed: "left",
  },
  {
    title: "USERNAME",
    dataIndex: "username",
    key: "username",
    align: "left",
    width: 220,
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
    title: "LAST ACCESSED MENU",
    dataIndex: "lastAccessMenu",
    key: "lastAccessMenu",
    align: "left",
    width: 280,
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
    title: "LAST ACCESSED",
    dataIndex: "lastAccess",
    key: "lastAccess",
    align: "left",
    width: 200,
    sorter: true,
    render: (text) => (text ? renderDateConverter(text, "datetime") : ""),
  },
];

export const TableMonitoringSession = ({
  idTable = "monitoring-session-table",
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
  ...rest
}) => {
  return (
    <NxTable
      idTable={idTable}
      userId={userId}
      dataSource={dataSource}
      columns={columnsMonitoringSession}
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
      showRefresh={false}
      tableScrolled={{ x: 900, y: 600 }}
      {...rest}
    />
  );
};
