import NxTable from "../../../../../components/Nx/NxTable";
import { Tooltip } from "antd";
import StatusComponent from "../../../../../components/StatusComponent";
import { useColumnActionPermission } from "../../../../../components/ColumnActionPermission";

// Define the columns for the account standard table
export const columnsAccountStandard = [
  {
    title: "NO",
    align: "center",
    width: 80,
    key: "no",
    render: (text, object, index) => index + 1,
    fixed: "left",
  },
  {
    title: "ACCOUNT NUMBER",
    dataIndex: "accountNumber",
    key: "accountNumber",
    align: "left",
    width: 150,
    sorter: true,
  },
  {
    title: "ACCOUNT NAME",
    dataIndex: "accountName",
    key: "accountName",
    align: "left",
    width: 200,
    sorter: true,
  },
  {
    title: "ACCOUNT REGISTRATION NUMBER",
    dataIndex: "registrationNumber",
    key: "registrationNumber",
    align: "left",
    width: 200,
    sorter: true,
  },
  {
    title: "CUSTOMER NUMBER",
    dataIndex: "customerNumber",
    key: "customerNumber",
    align: "left",
    width: 150,
    sorter: true,
  },
  {
    title: "CUSTOMER IDENTIFICATION NUMBER",
    dataIndex: "customerIdentificationNumber",
    key: "customerIdentificationNumber",
    align: "left",
    width: 200,
    sorter: true,
  },
  {
    title: "CUSTOMER NAME",
    dataIndex: "customerName",
    key: "customerName",
    align: "left",
    width: 180,
    sorter: true,
  },
  {
    title: "CUSTOMER TYPE",
    dataIndex: "customerType",
    key: "customerType",
    align: "center",
    width: 120,
    sorter: true,
  },
  {
    title: "SOR",
    dataIndex: "sor",
    key: "sor",
    align: "left",
    width: 100,
    sorter: true,
  },
  {
    title: "COST CENTER",
    dataIndex: "costCenter",
    key: "costCenter",
    align: "left",
    width: 120,
    sorter: true,
  },
  {
    title: "METER READING CODE",
    dataIndex: "meterReadingCode",
    key: "meterReadingCode",
    align: "center",
    width: 150,
    sorter: true,
    ellipsis: {
      showTitle: false,
    },
    render: (text) => text ? (
      <Tooltip placement="topLeft" title={text}>
        {text}
      </Tooltip>
    ) : "",
  },
  {
    title: "ACCOUNT SEGMENT",
    dataIndex: "accountSegment",
    key: "accountSegment",
    align: "center",
    width: 150,
    sorter: true,
  },
  {
    title: "ACCOUNT GROUP TYPE",
    dataIndex: "accountGroupType",
    key: "accountGroupType",
    align: "center",
    width: 150,
    sorter: true,
  },
  {
    title: "CATEGORY",
    dataIndex: "accountCategory",
    key: "accountCategory",
    align: "center",
    width: 120,
    sorter: true,
  },
  {
    title: "CLASSIFICATION TYPE",
    dataIndex: "classificationType",
    key: "classificationType",
    align: "center",
    width: 150,
    sorter: true,
  },
  {
    title: "ACCOUNT TYPE",
    dataIndex: "accountType",
    key: "accountType",
    align: "center",
    width: 120,
    sorter: true,
  },
  {
    title: "INDUSTRIAL SECTOR",
    dataIndex: "industrialSector",
    key: "industrialSector",
    align: "center",
    width: 150,
    sorter: true,
  },
  {
    title: "BUDGET YEAR",
    dataIndex: "budgetYear",
    key: "budgetYear",
    align: "center",
    width: 120,
    sorter: true,
  },
  {
    title: "BUDGET",
    dataIndex: "budget",
    key: "budget",
    align: "center",
    width: 120,
    sorter: true,
  },
  {
    title: "TERRITORY",
    dataIndex: "teritory",
    key: "teritory",
    align: "center",
    width: 120,
    sorter: true,
  },
  {
    title: "ACCOUNT GROUP",
    dataIndex: "accountGroup",
    key: "accountGroup",
    align: "center",
    width: 120,
    sorter: true,
  },
  {
    title: "PRIORITY",
    dataIndex: "priority",
    key: "priority",
    align: "center",
    width: 100,
    sorter: true,
  },
  {
    title: "CORPORATE",
    dataIndex: "isCorporate",
    key: "isCorporate",
    align: "center",
    width: 100,
    sorter: true,
  },
  {
    title: "RATING & BILLING EXCEPTION",
    dataIndex: "isException",
    key: "isException",
    align: "center",
    width: 200,
    sorter: true,
  },
  {
    title: "CUSTOMER MANAGEMENT",
    dataIndex: "customerManagement",
    key: "customerManagement",
    align: "left",
    width: 180,
    sorter: true,
    ellipsis: {
      showTitle: false,
    },
    render: (text) => text ? (
      <Tooltip placement="topLeft" title={text}>
        {text}
      </Tooltip>
    ) : "",
  },
  {
    title: "CUSTOMER MANAGEMENT NAME",
    dataIndex: "customerManagementName",
    key: "customerManagementName",
    align: "left",
    width: 200,
    sorter: true,
    ellipsis: {
      showTitle: false,
    },
    render: (text) => text ? (
      <Tooltip placement="topLeft" title={text}>
        {text}
      </Tooltip>
    ) : "",
  },
  {
    title: "DESCRIPTION",
    dataIndex: "accountDescription",
    key: "accountDescription",
    width: 200,
    sorter: true,
    ellipsis: {
      showTitle: false,
    },
    render: (text) => text ? (
      <Tooltip placement="topLeft" title={text}>
        {text}
      </Tooltip>
    ) : "",
  },
  {
    title: "STATUS",
    dataIndex: "accountStatus",
    key: "accountStatus",
    align: "center",
    width: 120,
    sorter: true,
    fixed: "right",
    render: (index) => {
      const text = index
        ? index.charAt(0).toUpperCase() + index.slice(1).toLowerCase()
        : index;
      return text ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "22px", overflow: "hidden" }}>
          <StatusComponent colour={index} size="small">{text}</StatusComponent>
        </div>
      ) : (
        text
      );
    },
  },
];

// Enhanced Account Standard Table Component with NxTable
export const TableAccountStandard = ({
  idTable = "account-standard-table",
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
  handleDownload,
  columnDefinitions,
  fixedColumns,
  setFixedColumns,
  useInfiniteScroll = false,
  onLoadMore = () => {},
  hasMore = false,
  itemActions = [],
  ...rest
}) => {
  // Get action columns from itemActions
  const actionColumns = useColumnActionPermission(
    ["Activate", "View", "Update"],
    itemActions
  );

  // Combine standard columns with action columns
  const allColumns = [
    ...columnsAccountStandard,
    ...actionColumns
  ];

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
      handleDownload={handleDownload}
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
      tableScrolled={{ x: 3000, y: 500 }}
      {...rest}
    />
  );
};
