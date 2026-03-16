import { useLocation, useNavigate } from "react-router-dom";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../routes/account_management/customer_account_routes";
import { useColumnActionPermission } from "../../../../../../components/ColumnActionPermission";
import Toolbar from "../../../../../../components/Toolbar";
import NxTable from "../../../../../../components/Nx/NxTable";
import { useEffect, useMemo, useState } from "react";
import { getMultiDestinationColumns } from "./getMultiDestinationColumns";
import { nxGetAccountActions } from "../../../../../../components/Nx/NxGetAccountActions";
import { nxApplyFixedColumns } from "../../../../../../utils/Nx/nxApplyFixedColumns";

const MultiDestinationTable = ({
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
  loading = false,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isStandard = location.pathname.includes("account-standard");
  const isOneTime = location.pathname.includes("account-onetime");

  const itemActions = nxGetAccountActions({
    handleView: (id, subjectId, objectId) => navigate(
      isStandard ?
        ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_MULTI_DESTINATION :
      isOneTime ?
        ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_MULTI_DESTINATION_ONETIME :
        "",
      {
        state: {
          idAccount,
          idCustomer,
          id,
          subjectId,
          objectId
        }
      }
    ),
    handleCreate: () => navigate(
      isStandard ?
        ACCOUNT_MANAGEMENT_ROUTES.CREATE_MULTI_DESTINATION :
      isOneTime ?
        ACCOUNT_MANAGEMENT_ROUTES.CREATE_MULTI_DESTINATION_ONETIME :
        "",
      {
        state: {
          idAccount,
          idCustomer,
        }
      }
    ),
    handleUpdate: (id, subjectId, objectId) => navigate(
      isStandard ?
        ACCOUNT_MANAGEMENT_ROUTES.UPDATE_MULTI_DESTINATION :
      isOneTime ?
        ACCOUNT_MANAGEMENT_ROUTES.UPDATE_MULTI_DESTINATION_ONETIME :
        "",
      {
        state: {
          idAccount,
          idCustomer,
          id,
          subjectId,
          objectId,
        }
      }
    ),
    handleApproval,
    handleApprovalHistory: (id) => handleApprovalHistoryModal(true, id),
    handleDownload,
    handleInactivate: handleInactivateModal,
  });

  const [fixedColumns, setFixedColumns] = useState(() => ({
    right: ["statusApproval", "status", "action"],
    left: [],
  }));

  const actionCols = useColumnActionPermission(["Inactivate", "View", "Update", "History"], itemActions, "View", "table").map(
    (col) => ({
      ...col,
      width: 70,
      align: "center",
    })
  );

  const baseColumns = useMemo(() =>
    getMultiDestinationColumns(
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
    <div className="flex flex-col gap-y-4">
      <Toolbar items={itemActions} type="detail" />
      <NxTable
        idTable="multi-destination-table"
        dataSource={data}
        totalData={totalElement}
        current={page}
        tableScrolled={{ x: data.length ? "max-content" : 4000 }}
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
      />
    </div>
  );
};

export default MultiDestinationTable;
