import { useNavigate } from "react-router-dom";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../../routes/account_management/customer_account_routes";
import { useColumnActionPermission } from "../../../../../../../components/ColumnActionPermission";
import ButtonComponent from "../../../../../../../components/ButtonComponent";
import Toolbar from "../../../../../../../components/Toolbar";
import NxTable from "../../../../../../../components/Nx/NxTable";
import { useMemo, useState } from "react";
import { applyFixedColumns } from "../../../../../../../utils/applyFixedColumns";
import { getInvoiceRelationColumns } from "./getInvoiceRelationColumns";
import { nxGetAccountActions } from "../../../../../../../components/Nx/NxGetAccountActions";

const InvoiceRelationTable = ({
  data = [],
  idAccount = 0,
  idCustomer = 0,
  totalElement = 0,
  page = {},
  onSort = () => {},
  rowSelection,
  isApproval = false,
  handleInactivateModal = () => {},
  handleApprovalHistoryModal = () => {},
  handleIsApproval = () => {},
  handleDownload = () => {},
  setIsApproval = () => {},
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
    idAccount,
    idCustomer,
    createRoute: ACCOUNT_MANAGEMENT_ROUTES.CREATE_INVOICE_RELATION,
    updateRoute: ACCOUNT_MANAGEMENT_ROUTES.UPDATE_INVOICE_RELATION,
    detailRoute: ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_INVOICE_RELATION,
    navigate,
    handleApproval: handleIsApproval,
    handleApprovalHistory: handleApprovalHistoryModal,
    handleDownload,
    handleInactivate: handleInactivateModal,
  })

  const [fixedColumns, setFixedColumns] = useState(() => ({
    statusApproval: "right",
    status: "right",
    action: "right",
  }));

  const actionCols = useColumnActionPermission(["Inactivate", "View", "Update", "History"], itemActions, "View", "table").map(
    (col) => ({
      ...col,
      width: 70,
      align: "center",
    })
  );

  const baseColumns = useMemo(() =>
    getInvoiceRelationColumns(
      search,
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  [search, searchText, searchedColumn]);

  const allColumns = useMemo(() => {
    const columnsWithKeys = [...baseColumns, ...actionCols].map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
    return columnsWithKeys;
  }, [baseColumns, actionCols]);

  const processedColumns = useMemo(() => {
    return applyFixedColumns(allColumns, fixedColumns);
  }, [allColumns, fixedColumns]);

  const columnDefinitions = useMemo(() => {
    return allColumns.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [allColumns]);

  return (
    <div className="flex flex-col gap-y-6">
      {isApproval ? (
        <div className="flex justify-end gap-5 mb-5">
          <ButtonComponent
            type="reject"
            onClick={() => setIsApproval(false)}
          >
            Cancel
          </ButtonComponent>
        </div>
      ) : (
        <Toolbar items={itemActions} type="detail" />
      )}
      <NxTable
        idTable="invoice-relation-table"
        dataSource={data}
        totalData={totalElement}
        current={page}
        tableScrolled={{ y: 400, x: data.length ? "max-content" : "100%" }}
        onSort={onSort}
        columns={processedColumns}
        rowSelection={rowSelection}
        usePagination={false}
        useInfiniteScroll
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
        loadMoreThreshold={20}
        setFixedColumns={setFixedColumns}
        columnDefinitions={columnDefinitions}
        loading={loading}
      />
    </div>
  );
};

export default InvoiceRelationTable;
