import { useLocation, useNavigate } from "react-router-dom";
import Toolbar from "../../../../components/Toolbar";
import NxTable from "../../../../components/Nx/NxTable";
import { useMemo, useState, useRef, useEffect } from "react";
import { getGasDepositColumns } from "./getGasDepositColumns";
import { useDispatch, useSelector } from "react-redux";
import { getSummaryBalance } from "../../../../redux/slices/account_management/detailAccount/GasDepositSlice";
import { getHistoryColumns } from "./getHistoryColumns";

/**
 * Level-0 gas deposit list table with search, sort, filter, and infinite scroll.
 * Tracks expand state in `openedMemo` to skip redundant detail fetches on re-expand.
 *
 * @param {{
 *   handleApproval?: (show: boolean) => void;
 *   accountId?: number;
 *   customerId?: number;
 *   refreshSignal?: number;
 * }} props
 */
const HistoryTable = ({
  handleApproval = () => {},
  accountId,
  customerId,
  refreshSignal = 0,
}) => {
  // --- Hooks ---
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    list_summaryBalance: dataSource,
    pagination_listSummaryBalance: pagination,
    loading_listSummaryBalance: loading,
  } = useSelector((state) => state.gasDeposit);

  // --- Derived values ---
  const isStandard = location.pathname.includes("account-standard");
  const isOneTime = location.pathname.includes("account-onetime");

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
      getSummaryBalance({
        accountId,
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
        getSummaryBalance({
          accountId,
          body,
          isLoadMore: true,
        })
      ).unwrap();
    }
    setPage(nextPage);
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
    const promise = dispatch(getSummaryBalance({ accountId, body, isLoadMore: false }));
    return () => { promise.abort(); };
  }, [sort, search, filters, filterRules]);

  // Trigger a page-0 refresh when the parent signals it (e.g. after inactivate/approval).
  useEffect(() => {
    if (refreshSignal > 0) handleRefresh();
  }, [refreshSignal]);

  const baseColumns = useMemo(() =>
    getHistoryColumns({
      search,
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    }),
  [search, searchInput, searchText, searchedColumn]);

  const columns = useMemo(() => [...baseColumns], [baseColumns]);

  return (
    <div className="flex flex-col gap-y-4">
      <NxTable
        idTable="gas-deposit-table"
        className="[&_.ant-table-expanded-row-fixed]:!pl-2"
        dataSource={dataSource}
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
        loading={loading}
      />
    </div>
  );
};

export default HistoryTable;
