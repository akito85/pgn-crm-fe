import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";
import Toolbar from "../../../../components/Toolbar";
import NxTable from "../../../../components/Nx/NxTable";
import { useMemo, useState, useRef, useEffect } from "react";
import { nxGetAccountActions } from "../../../../components/Nx/NxGetAccountActions";
import { useDispatch, useSelector } from "react-redux";
import { downloadGasDeposit, getGasDepositHistories } from "../../../../redux/slices/account_management/detailAccount/GasDepositSlice";
import { getGasDepositHistoryColumns } from "./getGasDepositHistoryColumns";

const GasDepositHistoryTable = ({
  moduleType,
  handleApprovalHistoryModal,
  handleDetailModal,
  accountId,
  refreshSignal = 0,
}) => {
  // --- Hooks ---
  const dispatch = useDispatch();
  const {
    list_gasDepositHistory: dataSource,
    pagination_listGdHistory: pagination,
    loading_listGdHistory: loading,
  } = useSelector((state) => state.gasDeposit);

  // --- Derived values ---
  const isUnderAccount = moduleType === "ua";

  const totalElement = pagination.totalElement;
  const hasMore = dataSource.length < totalElement;

  // --- State ---
  const searchInput = useRef(null);
  const [page, setPage] = useState(0);
  const [loadMoreSize] = useState(20);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [filters, setFilters] = useState([]);
  const [filterRules, setFilterRules] = useState([]);

  // --- Handlers ---
  /**
   * Resets pagination to page 0 and re-fetches the gas deposit list with current search/sort/filter state.
   */
  const handleRefresh = () => {
    const body = {
      page: 0,
      size: loadMoreSize,
      sort,
      searchs: search,
      filters,
      filterRules,
    };

    dispatch(
      getGasDepositHistories({
        accountId: isUnderAccount ? accountId : undefined,
        body,
        isLoadMore: false,
      })
    );
    setPage(0);
  };

  /**
   * @param {string[]} selectedKeys
   * @param {() => {}} confirm
   * @param {string} dataIndex
   */
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setPage(0);
      }
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
  };

  /**
   * @param {*} _
   * @param {*} __
   * @param {import("antd/lib/table/interface").SorterResult} sort
   */
  const onSort = (_, __, sort) => {
    const dataSort = sort.order
      ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
      : "";
    setSort(dataSort);
  };

  /**
   * Loads the next page of records and appends them to the existing list.
   */
  const handleLoadMore = async () => {
    const nextPage = page + 1;
    const totalPage = pagination.totalPage || 0;

    if (nextPage <= totalPage) {
      const body = {
        page: nextPage,
        size: loadMoreSize,
        sort,
        searchs: search,
        filters,
        filterRules,
      };

      await dispatch(
        getGasDepositHistories({
          accountId: isUnderAccount ? accountId : undefined,
          body,
          isLoadMore: true,
        })
      ).unwrap();
    }
    setPage(nextPage);
  };

  /**
   * Dispatches a download action for the current filtered/sorted view.
   */
  const handleDownload = () => {
    const body = {
      page,
      size: loadMoreSize,
      sort,
      filters,
      filterRules,
      searchs: search,
    };

    dispatch(downloadGasDeposit({ body, id: accountId }));
  };

  // --- Effects ---
  // Re-fetch page 0 whenever sort, search, filters, or filterRules change.
  // Abort the in-flight request on cleanup so StrictMode double-mounts and
  // rapid filter changes don't produce stale or duplicate page-0 fetches.
  useEffect(() => {
    const body = {
      page: 0,
      size: loadMoreSize,
      sort,
      searchs: search,
      filters,
      filterRules,
    };

    setPage(0);
    const promise = dispatch(getGasDepositHistories({ accountId: isUnderAccount ? accountId : undefined, body, isLoadMore: false }));
    return () => { promise.abort(); };
  }, [sort, search, filters, filterRules]);

  // Trigger a page-0 refresh when the parent signals it (e.g. after inactivate/approval).
  useEffect(() => {
    if (refreshSignal > 0) handleRefresh();
  }, [refreshSignal]);

  // --- Column configuration ---
  const itemActions = nxGetAccountActions({
    handleView: ({ id }) => handleDetailModal({ show: true, historyId: id }),
    handleApprovalHistory: ({ gasDepositId }) => handleApprovalHistoryModal({ show: true, historyId: gasDepositId }),
    handleDownload,
  });

  const toolbarItemActions = itemActions.filter(item => item.action === "Download");

  const actionCols = useColumnActionPermission(["View", "History"], itemActions, "View", "table").map(
    (col) => ({
      ...col,
      width: 70,
      align: "center",
    })
  );

  const baseColumns = useMemo(() =>
    getGasDepositHistoryColumns({
      search,
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    }),
  [search, searchInput, searchText, searchedColumn]);

  const columns = useMemo(() => [...baseColumns, ...actionCols], [baseColumns, actionCols]);

  return (
    <div className="flex flex-col gap-y-4">
      <Toolbar items={toolbarItemActions} type="detail" />
      <NxTable
        idTable="gas-deposit-history-table"
        dataSource={dataSource}
        totalData={totalElement}
        current={page}
        tableScrolled={{ x: dataSource.length ? "max-content" : 4000 }}
        onSort={onSort}
        columns={columns}
        usePagination={false}
        useInfiniteScroll={true}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
        loadMoreThreshold={20}
        loading={loading}
      />
    </div>
  );
};

export default GasDepositHistoryTable;
