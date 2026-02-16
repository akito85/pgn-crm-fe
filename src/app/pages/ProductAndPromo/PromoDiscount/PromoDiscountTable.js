import { useMemo, useState } from "react";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";
import Toolbar from "../../../../components/Toolbar";
import NxTable from "../../../../components/Nx/NxTable";
import { TablePromoView, itemsActionView } from "./Table/TablePromoView";
import { nxApplyFixedColumns } from "../../../../utils/Nx/nxApplyFixedColumns";
import { nxGetAccountActions } from "../../../../components/Nx/NxGetAccountActions";

const PromoDiscountTable = ({
  data = [],
  totalElement = 0,
  page = 0,
  onSort = () => {},
  handleInactive = () => {},
  handleApprovalHistory = () => {},
  handleDownload = () => {},
  handleLoadMore = () => {},
  hasMore = false,
  searchText = "",
  search = {},
  searchedColumn = "",
  searchInput = null,
  handleSearch = () => {},
  loading = false,
}) => {
  const [fixedColumns, setFixedColumns] = useState(() => ({
    right: ["status", "statusApproval", "action"],
    left: [],
  }));

  const loadMoreSize = 20;

  const itemActions = nxGetAccountActions(
    {
      handleInactivate: handleInactive,
      handleApprovalHistory,
      handleDownload,
    }
  );

  const actionCols = useColumnActionPermission(
    ["view", "Update", "Activate", "History"],
    itemActions,
    "view",
    "table"
  ).map((col) => ({
    ...col,
    width: 70,
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
        idTable="promo-discount-table"
        dataSource={data}
        totalData={totalElement}
        current={page}
        tableScrolled={{ y: 525, x: 1084 }}
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

export default PromoDiscountTable;
