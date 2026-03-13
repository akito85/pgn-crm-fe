import { useLocation, useNavigate } from "react-router-dom";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../routes/account_management/customer_account_routes";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";
import Toolbar from "../../../../components/Toolbar";
import NxTable from "../../../../components/Nx/NxTable";
import { useMemo, useState } from "react";
import { getGasDepositColumns } from "./getGasDepositColumns";
import { nxGetAccountActions } from "../../../../components/Nx/NxGetAccountActions";
import { nxApplyFixedColumns } from "../../../../utils/Nx/nxApplyFixedColumns";
import GasDepositDetailTable from "./GasDepositDetailTable";

const GasDepositTable = ({
  moduleType,
  totalElement = 0,
  handleInactivateModal = () => {},
  handleApprovalHistoryModal = () => {},
  handleApproval = () => {},
  handleDownload = () => {},
  handleLoadMore = () => {},
  handleSearch = () => {},
  onSort = () => {},
  handleSelectDetail = () => {},
  dataSource = [],
  page = 0,
  hasMore = false,
  searchText = "",
  search = {},
  searchedColumn = {},
  searchInput = null,
  loading = false,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isStandAlone = moduleType === "sa";
  const isUnderAccount = moduleType === "ua";

  const isStandard = location.pathname.includes("account-standard");
  const isOneTime = location.pathname.includes("account-onetime");

  const itemActions = nxGetAccountActions({
    handleApproval,
    handleApprovalHistory: (id) => handleApprovalHistoryModal(true, id),
    handleDownload,
    handleInactivate: handleInactivateModal,
  });

  const [fixedColumns, setFixedColumns] = useState(() => ({
    right: ["statusApproval", "status"],
    left: [],
  }));

  const actionCols = useColumnActionPermission(["Inactivate", "Update", "History"], itemActions, "View", "table").map(
    (col) => ({
      ...col,
      width: 70,
      align: "center",
    })
  );

  const baseColumns = useMemo(() =>
    getGasDepositColumns(
      search,
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  [search, searchInput, searchText, searchedColumn]);

  const columnDefinitions = useMemo(() => [...baseColumns, ...actionCols], [baseColumns, actionCols]);

  const columns = useMemo(() => {
    return nxApplyFixedColumns(columnDefinitions, fixedColumns);
  }, [columnDefinitions, fixedColumns]);

  const expandedRowRender = (record) => {
    return (
      <GasDepositDetailTable
        data={record.details}
      />
    );
  };

  return (
    <div className="flex flex-col gap-y-4">
      <Toolbar items={itemActions} type="detail" />
      <NxTable
        idTable="gas-deposit-table"
        dataSource={dataSource}
        totalData={totalElement}
        current={page}
        tableScrolled={{ x: data.length ? "max-content" : 4000 }}
        onSort={onSort}
        columns={columns}
        usePagination={false}
        useInfiniteScroll={true}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
        loadMoreThreshold={20}
        fixedColumns={fixedColumns}
        setFixedColumns={setFixedColumns}
        columnDefinitions={columnDefinitions}
        loading={loading}
        expandable={{ expandedRowRender }}
        onRowClick={handleSelectDetail}
      />
    </div>
  );
};

export default GasDepositTable;
