import { useMemo } from "react";
import { Tooltip } from "antd";
import NxTable from "../../../components/Nx/NxTable";

export const columnsAuditTrail = [
  {
    title: "NO",
    align: "center",
    width: 60,
    key: "no",
    render: (text, object, index) => index + 1,
    fixed: "left",
  },
  {
    title: "DATE",
    dataIndex: "createdDate",
    key: "createdDate",
    align: "center",
    width: 180,
    sorter: true,
  },
  {
    title: "CREATED BY",
    dataIndex: "createdBy",
    key: "createdBy",
    align: "left",
    width: 160,
    sorter: true,
  },
  {
    title: "USER LEVEL",
    dataIndex: "userLevel",
    key: "userLevel",
    align: "center",
    width: 130,
    sorter: true,
  },
  {
    title: "OPERATION",
    dataIndex: "operation",
    key: "operation",
    align: "center",
    width: 130,
    sorter: true,
  },
  {
    title: "TABLE NAME",
    dataIndex: "tableName",
    key: "tableName",
    align: "left",
    width: 200,
    sorter: true,
  },
  {
    title: "DATA ID",
    dataIndex: "dataId",
    key: "dataId",
    align: "center",
    width: 100,
    sorter: true,
  },
  {
    title: "OLD VALUE",
    dataIndex: "oldValue",
    key: "oldValue",
    align: "left",
    ellipsis: { showTitle: false },
    render: (text) =>
      text ? (
        <Tooltip placement="topLeft" title={text}>
          <span>{text}</span>
        </Tooltip>
      ) : (
        ""
      ),
  },
  {
    title: "NEW VALUE",
    dataIndex: "newValue",
    key: "newValue",
    align: "left",
    ellipsis: { showTitle: false },
    render: (text) =>
      text ? (
        <Tooltip placement="topLeft" title={text}>
          <span>{text}</span>
        </Tooltip>
      ) : (
        ""
      ),
  },
  {
    title: "REMARK",
    dataIndex: "remark",
    key: "remark",
    align: "left",
    width: 160,
    ellipsis: { showTitle: false },
    render: (text) =>
      text ? (
        <Tooltip placement="topLeft" title={text}>
          <span>{text}</span>
        </Tooltip>
      ) : (
        ""
      ),
  },
];

export const TableAuditTrail = ({
  idTable = "audit-trail-table",
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
  ...rest
}) => {
  const allColumns = useMemo(() => columnsAuditTrail, []);

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
      columnDefinitions={columnsAuditTrail}
      fixedColumns={fixedColumns}
      setFixedColumns={setFixedColumns}
      useInfiniteScroll={useInfiniteScroll}
      onLoadMore={onLoadMore}
      hasMore={hasMore}
      showExport={false}
      showAdvanceSearch={true}
      showSearchBar={true}
      showRefresh={false}
      tableScrolled={{ x: 1400, y: 600 }}
      {...rest}
    />
  );
};
