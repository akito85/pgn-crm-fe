import { useNavigate, useLocation } from "react-router-dom";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../../routes/account_management/customer_account_routes";
import { useColumnActionPermission } from "../../../../../../../components/ColumnActionPermission";
import Toolbar from "../../../../../../../components/Toolbar";
import NxTable from "../../../../../../../components/Nx/NxTable";
import { useMemo, useState } from "react";
import { getInvoiceRelationColumns } from "./getInvoiceRelationColumns";
import { nxGetAccountActions } from "../../../../../../../components/Nx/NxGetAccountActions";
import { nxApplyFixedColumns } from "../../../../../../../utils/Nx/nxApplyFixedColumns";

const InvoiceRelationTable = ({
  data = [],
  idAccount = 0,
  idCustomer = 0,
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
  loading = false
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isStandard = location.pathname.includes("account-standard");
  const isOneTime = location.pathname.includes("account-onetime");

  const itemActions = nxGetAccountActions({
    handleView: (id) =>
      navigate(
        isStandard
          ? ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_INVOICE_RELATION
          : isOneTime
            ? ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_INVOICE_RELATION_ONETIME
            : "",
        {
          state: {
            idAccount,
            idCustomer,
            id
          }
        }
      ),
    handleCreate: () =>
      navigate(
        isStandard
          ? ACCOUNT_MANAGEMENT_ROUTES.CREATE_INVOICE_RELATION
          : isOneTime
            ? ACCOUNT_MANAGEMENT_ROUTES.CREATE_INVOICE_RELATION_ONETIME
            : "",
        {
          state: {
            idAccount,
            idCustomer
          }
        }
      ),
    handleUpdate: (id) =>
      navigate(
        isStandard
          ? ACCOUNT_MANAGEMENT_ROUTES.UPDATE_INVOICE_RELATION
          : isOneTime
            ? ACCOUNT_MANAGEMENT_ROUTES.UPDATE_INVOICE_RELATION_ONETIME
            : "",
        {
          state: {
            idAccount,
            idCustomer,
            id
          }
        }
      ),
    handleApproval,
    handleApprovalHistory: (id) => handleApprovalHistoryModal(true, id),
    handleDownload,
    handleInactivate: handleInactivateModal
  });

  const [fixedColumns, setFixedColumns] = useState(() => ({
    right: ["statusApproval", "status", "action"],
    left: []
  }));

  const actionCols = useColumnActionPermission(
    ["Inactivate", "View", "Update", "History"],
    itemActions,
    "View",
    "table"
  ).map((col) => ({
    ...col,
    width: 70,
    align: "center"
  }));

  const baseColumns = useMemo(
    () =>
      getInvoiceRelationColumns(
        search,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    [search, searchInput, searchText, searchedColumn]
  );

  const columnDefinitions = useMemo(
    () => [...baseColumns, ...actionCols],
    [baseColumns, actionCols]
  );

  const columns = useMemo(() => {
    return nxApplyFixedColumns(columnDefinitions, fixedColumns);
  }, [columnDefinitions, fixedColumns]);

  return (
    <div className="flex flex-col gap-y-4">
      <Toolbar items={itemActions} type="detail" />
      <NxTable
        idTable="invoice-relation-table"
        dataSource={data}
        totalData={totalElement}
        current={page}
        tableScrolled={{ x: "max-content" }}
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
      />
    </div>
  );
};

export default InvoiceRelationTable;
