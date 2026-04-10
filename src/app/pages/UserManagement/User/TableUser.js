import { useMemo } from "react";
import { Tooltip } from "antd";
import NxTable from "../../../../components/Nx/NxTable";
import StatusComponent from "../../../../components/StatusComponent";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";

export const columnsUser = [
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
    width: 200,
    sorter: true,
  },
  {
    title: "USER TYPE",
    dataIndex: "userType",
    key: "userType",
    align: "center",
    width: 150,
    sorter: true,
  },
  {
    title: "EMPLOYEE",
    dataIndex: "employeeName",
    key: "employeeName",
    align: "left",
    width: 200,
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
    title: "USER LEVEL",
    dataIndex: "userLevel",
    key: "userLevel",
    align: "left",
    width: 160,
    sorter: true,
  },
  {
    title: "EMAIL",
    dataIndex: "email",
    key: "email",
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
    title: "MOBILE PHONE",
    dataIndex: "phone",
    key: "phone",
    align: "left",
    width: 160,
    sorter: true,
  },
  {
    title: "AUTH TYPE",
    dataIndex: "authType",
    key: "authType",
    align: "center",
    width: 150,
    sorter: true,
  },
  {
    title: "GROUP ACCESS",
    dataIndex: "groupAccess",
    key: "groupAccess",
    align: "left",
    width: 200,
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
    title: "DESCRIPTION",
    dataIndex: "description",
    key: "description",
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

export const TableUser = ({
  idTable = "user-table",
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
  ...rest
}) => {
  const actionColumns = useColumnActionPermission(
    ["View", "Update", "Activate", "Generate"],
    itemActions
  );

  const allColumns = useMemo(
    () => [...columnsUser, ...actionColumns],
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
      columnDefinitions={columnDefinitions}
      fixedColumns={fixedColumns}
      setFixedColumns={setFixedColumns}
      useInfiniteScroll={useInfiniteScroll}
      onLoadMore={onLoadMore}
      hasMore={hasMore}
      showExport={true}
      showAdvanceSearch={true}
      showSearchBar={true}
      showRefresh={false}
      tableScrolled={{ x: 2200, y: 600 }}
      {...rest}
    />
  );
};
