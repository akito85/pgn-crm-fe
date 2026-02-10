import { useNavigate } from "react-router-dom";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../routes/account_management/customer_account_routes";
import { useColumnActionPermission } from "../../../../../../components/ColumnActionPermission";
import Toolbar from "../../../../../../components/Toolbar";
import NxTable from "../../../../../../components/Nx/NxTable";
import { useMemo, useState } from "react";
import { getRelationshipColumns } from "./getRelationshipColumns";
import { nxGetAccountActions } from "../../../../../../components/Nx/NxGetAccountActions";
import { nxApplyFixedColumns } from "../../../../../../utils/Nx/nxApplyFixedColumns";
import TablePagination from "../../../../../../components/TablePagination";

// Nested columns configuration for expandable rows
const NESTED_COLUMNS = [
  {
    title: "NO",
    align: "center",
    width: 60,
    render: (text, object, index) => (
      <div style={{ padding: "8px 0" }}>{index + 1}</div>
    ),
  },
  {
    title: "ACCOUNT NUMBER",
    dataIndex: "accountNumber",
    align: "left",
    sorter: (a, b) => (a.accountNumber || "").localeCompare(b.accountNumber || ""),
    render: (text) => <div style={{ padding: "8px 16px" }}>{text || "-"}</div>,
  },
  {
    title: "ACCOUNT NAME",
    dataIndex: "accountName",
    align: "left",
    sorter: (a, b) => (a.accountName || "").localeCompare(b.accountName || ""),
    render: (text) => <div style={{ padding: "8px 16px" }}>{text || "-"}</div>,
  },
  {
    title: "ACCOUNT CATEGORY",
    dataIndex: "accountCategory",
    align: "left",
    sorter: (a, b) => (a.accountCategory || "").localeCompare(b.accountCategory || ""),
    render: (text) => <div style={{ padding: "8px 16px" }}>{text || "-"}</div>,
  },
  {
    title: "SOR",
    dataIndex: "sor",
    align: "left",
    sorter: (a, b) => (a.sor || "").localeCompare(b.sor || ""),
    render: (text) => <div style={{ padding: "8px 16px" }}>{text || "-"}</div>,
  },
  {
    title: "COST CENTER",
    dataIndex: "costCenter",
    align: "left",
    sorter: (a, b) => (a.costCenter || "").localeCompare(b.costCenter || ""),
    render: (text) => <div style={{ padding: "8px 16px" }}>{text || "-"}</div>,
  },
  {
    title: "METER READING CODE",
    dataIndex: "meterReadingCode",
    align: "left",
    sorter: (a, b) => (a.meterReadingCode || "").localeCompare(b.meterReadingCode || ""),
    render: (text) => <div style={{ padding: "8px 16px" }}>{text || "-"}</div>,
  },
];

// Expandable row renderer for Related Detail
const expandedRowRender = (record) => {
  const relatedDetailData = record?.relatedDetail || [];

  return (
    <div className="bg-blue-50 -mx-2 pl-6 py-2">
      <h4 className="text-[#0075bf] font-semibold text-sm my-2">RELATED DETAIL</h4>
      <TablePagination
        useSelect={false}
        usePagination={false}
        dataSource={relatedDetailData}
        columns={NESTED_COLUMNS}
        className="related-detail-nested-table"
      />
    </div>
  );
};

const RelationshipTable = ({
  data = [],
  idAccount = 0,
  idCustomer = 0,
  type = "standard",
  totalElement = 0,
  page = 0,
  onSort = () => {},
  handleInactivateModal = () => {},
  handleApprovalHistoryModal = () => {},
  handleApproval = () => {},
  handleDownload = () => {},
  handleLoadMore = () => {},
  hasMore = false,
  searchText = "",
  search = "",
  searchedColumn = {},
  searchInput = "",
  handleSearch = () => {},
  loading = false,
}) => {
  const navigate = useNavigate();

  const itemActions = nxGetAccountActions({
    handleView: (id) => navigate(
      ACCOUNT_MANAGEMENT_ROUTES.DETAIL_RELATIONSHIP,
      {
        state: {
          idAccount,
          idCustomer,
          id,
        }
      }
    ),
    handleCreate: () => navigate(
      ACCOUNT_MANAGEMENT_ROUTES.CREATE_RELATIONSHIP,
      {
        state: {
          idAccount,
          idCustomer,
        }
      }
    ),
    handleUpdate: (id) => navigate(
      ACCOUNT_MANAGEMENT_ROUTES.UPDATE_RELATIONSHIP,
      {
        state: {
          idAccount,
          idCustomer,
          id,
        }
      }
    ),
    handleApproval,
    handleApprovalHistory: handleApprovalHistoryModal,
    handleDownload,
    handleInactivate: handleInactivateModal,
  });

  const [fixedColumns, setFixedColumns] = useState(() => ({
    right: ["statusApproval", "status", "action"],
    left: [],
  }));

  const actionCols = useColumnActionPermission(
    ["Inactivate", "View", "Update", "History"],
    itemActions,
    "View",
    "table"
  ).map((col) => ({
    ...col,
    width: 70,
    align: "center",
  }));

  const baseColumns = useMemo(
    () =>
      getRelationshipColumns(
        search,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    [search, searchText, searchedColumn]
  );

  const allColumns = useMemo(() => {
    const columnsWithKeys = [...baseColumns, ...actionCols].map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
    return columnsWithKeys;
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
    <div className="flex flex-col gap-y-4">
      <Toolbar items={itemActions} type="detail" />
      <NxTable
        idTable="relationship-table"
        dataSource={data}
        totalData={totalElement}
        current={page}
        tableScrolled={{ y: 400, x: data.length ? "max-content" : 2000 }}
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
        expandable={{
          expandedRowRender,
          rowExpandable: (record) => record?.relatedDetail && record.relatedDetail.length > 0,
        }}
      />
    </div>
  );
};

export default RelationshipTable;
