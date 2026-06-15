import { useMemo } from "react";
import { Tooltip } from "antd";
import NxTable from "../../../../components/Nx/NxTable";
import StatusComponent from "../../../../components/StatusComponent";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";
import NxDate from "../../../../components/Nx/NxDatePicker";

export const columnsEmployee = [
  {
    title: "NO",
    align: "center",
    width: 60,
    key: "no",
    render: (text, object, index) => index + 1,
    fixed: "left",
  },
  {
    title: "EMPLOYEE NUMBER",
    dataIndex: "empNumber",
    key: "empNumber",
    align: "left",
    width: 150,
    sorter: true,
  },
  {
    title: "FIRST NAME",
    dataIndex: "firstName",
    key: "firstName",
    align: "left",
    width: 150,
    sorter: true,
  },
  {
    title: "LAST NAME",
    dataIndex: "lastName",
    key: "lastName",
    align: "left",
    width: 150,
    sorter: true,
  },
  {
    title: "EMPLOYEE TYPE",
    dataIndex: "empType",
    key: "empType",
    align: "center",
    width: 150,
    sorter: true,
  },
  {
    title: "MOBILE PHONE",
    dataIndex: "phone",
    key: "phone",
    align: "right",
    width: 150,
    sorter: true,
  },
  {
    title: "EMAIL",
    dataIndex: "email",
    key: "email",
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
    title: "JOB",
    dataIndex: "jobName",
    key: "jobName",
    align: "left",
    width: 150,
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
    title: "POSITION",
    dataIndex: "positionName",
    key: "positionName",
    align: "left",
    width: 180,
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
    width: 130,
    sorter: true,
    render: (startDate) => NxDate.formatDate(startDate, "DD MMM YYYY"),
  },
  {
    title: "END DATE",
    dataIndex: "endDate",
    key: "endDate",
    align: "center",
    width: 130,
    sorter: true,
    render: (endDate) => NxDate.formatDate(endDate, "DD MMM YYYY"),
  },
  {
    title: "DESCRIPTION",
    dataIndex: "description",
    key: "description",
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

export const TableEmployee = ({
  idTable = "employee-table",
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
    ["View", "Update", "forward", "terminate"],
    itemActions
  );

  const allColumns = useMemo(
    () => [...columnsEmployee, ...actionColumns],
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
      tableScrolled={{ x: 2500, y: 600 }}
      {...rest}
    />
  );
};
