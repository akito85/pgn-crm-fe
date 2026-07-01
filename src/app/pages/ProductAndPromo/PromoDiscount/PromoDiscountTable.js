import { useMemo, useState } from "react";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";
import Toolbar from "../../../../components/Toolbar";
import NxTable from "../../../../components/Nx/NxTable";
import { TablePromoView, itemsActionView } from "./Table/TablePromoView";
import { nxGetAccountActions } from "../../../../components/Nx/NxGetAccountActions";
import { useNavigate } from "react-router-dom";
import { PRODUCT_PROMO_ROUTES } from "../../../../routes/product_promo/pp_routes";
import { useSelector } from "react-redux";

const PromoDiscountTable = ({
  data = [],
  totalElement = 0,
  page = 0,
  onSort = () => {},
  handleInactive = () => {},
  handleApprovalHistory = () => {},
  handleDownload = () => {},
  loadingDownload = false,
  handleLoadMore = () => {},
  hasMore = false,
  searchText = "",
  search = {},
  searchedColumn = "",
  searchInput = null,
  handleSearch = () => {},
  loading = false,
  onAdvanceSearch = () => {},
  onSearch = () => {},
  onRefresh = () => {},
}) => {
  const navigate = useNavigate();

  const { data: dataUser = {} } = useSelector((state) => state.profile);
  
  const DEFAULT_FIXED_COLUMNS = { right: ["status", "statusApproval", "action"], left: [] };
  const [fixedColumns, setFixedColumns] = useState(() => DEFAULT_FIXED_COLUMNS);

  const itemActions = nxGetAccountActions(
    {
      handleCreate: () => navigate(PRODUCT_PROMO_ROUTES.CREATE_PROMO_DISCOUNT),
      handleUpdate: ({ id }) => navigate(PRODUCT_PROMO_ROUTES.UPDATE_PROMO_DISCOUNT, { state: { id } }),
      handleView: ({ id }) => navigate(PRODUCT_PROMO_ROUTES.DETAIL_PROMO_DISCOUNT,  { state: { id } }),
      handleInactivate: ({ id }) => handleInactive(true, id),
      handleApprovalHistory: ({ id }) => handleApprovalHistory(id),
      handleDownload,
      loadingDownload,
    }
  );

  const actionCols = useColumnActionPermission(
    ["View", "Update", "Inactivate", "History"],
    itemActions,
    "View",
  ).map((col) => ({
    ...col,
    width: 150,
    align: "center",
  }));

  const baseColumns = useMemo(
    () =>
      TablePromoView(
        search,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    [search, page, searchInput, searchedColumn, searchText, handleSearch]
  );

  const allColumns = useMemo(() => {
    const columnsWithKeys = [...baseColumns, ...actionCols].map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
    return columnsWithKeys;
  }, [baseColumns, actionCols]);

  const columnDefinitions = useMemo(() => {
    return allColumns.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [allColumns]);

  return (
    <div className="flex flex-col gap-y-4">
      <Toolbar items={itemActions} />
      <NxTable
        idTable="promo-discount-table"
        userId={dataUser?.data?.username}
        showRefresh={true}
        dataSource={data}
        totalData={totalElement}
        current={page}
        tableScrolled={{ y: 525, x: 1084 }}
        onSort={onSort}
        columns={allColumns}
        usePagination={false}
        useInfiniteScroll={true}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
        loadMoreThreshold={20}
        fixedColumns={fixedColumns}
        setFixedColumns={setFixedColumns}
        columnDefinitions={columnDefinitions}
        loading={loading}
        onAdvanceSearch={onAdvanceSearch}
        onSearch={onSearch}
        onRefresh={onRefresh}
        onClearPreferences={() => setFixedColumns(DEFAULT_FIXED_COLUMNS)}
      />
    </div>
  );
};

export default PromoDiscountTable;
