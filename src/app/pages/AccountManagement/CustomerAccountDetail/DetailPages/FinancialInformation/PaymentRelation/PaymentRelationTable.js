import { useNavigate } from "react-router-dom";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../../routes/account_management/customer_account_routes";
import { useColumnActionPermission } from "../../../../../../../components/ColumnActionPermission";
import ButtonComponent from "../../../../../../../components/ButtonComponent";
import Toolbar from "../../../../../../../components/Toolbar";
import NxTable from "../../../../../../../components/Nx/NxTable";
import { useEffect, useMemo, useState } from "react";
import { getPaymentRelationColumns } from "./getPaymentRelationColumns";
import { nxGetAccountActions } from "../../../../../../../components/Nx/NxGetAccountActions";
import { nxApplyFixedColumns } from "../../../../../../../utils/Nx/nxApplyFixedColumns";

const PaymentRelationTable = ({
  data = [],
  idAccount = 0,
  idCustomer = 0,
  totalElement = 0,
  page = 0,
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
  searchText="",
  search = "",
  searchedColumn = {},
  searchInput = "",
  handleSearch=() => {},
  loading = false, 
}) => {
  const navigate = useNavigate();

  const itemActions = nxGetAccountActions({
    idAccount,
    idCustomer,
    createRoute: ACCOUNT_MANAGEMENT_ROUTES.CREATE_PAYMENT_RELATION,
    updateRoute: ACCOUNT_MANAGEMENT_ROUTES.UPDATE_PAYMENT_RELATION,
    detailRoute: ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_PAYMENT_RELATION,
    navigate,
    handleApproval: handleIsApproval,
    handleApprovalHistory: handleApprovalHistoryModal,
    handleDownload,
    handleInactivate: handleInactivateModal,
  });

  const [fixedColumns, setFixedColumns] = useState(() => ({
    right: ["statusApproval", "status", "action"],
    left: [],
  }));

  useEffect(() => {
    console.log("fixedColumns", fixedColumns);
  }, [fixedColumns])

  const actionCols = useColumnActionPermission(["Inactivate", "View", "Update", "History"], itemActions, "View", "table").map(
    (col) => ({
      ...col,
      width: 70,
      align: "center",
    })
  );

  const baseColumns = useMemo(() =>
    getPaymentRelationColumns(
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
    return nxApplyFixedColumns(allColumns, fixedColumns);
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
        idTable="payment-relation-table"
        dataSource={data}
        totalData={totalElement}
        current={page}
        tableScrolled={{ y: 400, x: "max-content" }}
        onSort={onSort}
        columns={processedColumns}
        rowSelection={rowSelection}
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

export default PaymentRelationTable;
