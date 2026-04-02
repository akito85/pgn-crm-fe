import NxTable from "../../../../components/Nx/NxTable";
import { useEffect, useMemo, useRef, useState } from "react";
import { nxApplyFixedColumns } from "../../../../utils/Nx/nxApplyFixedColumns";
import { getGasDepositDetailMutationColumns } from "./getGasDepositDetailMutationColumns";
import { useDispatch, useSelector } from "react-redux";
import { getGasDepositDetailMutations } from "../../../../redux/slices/account_management/detailAccount/GasDepositSlice";

/**
 * Level-2 nested mutation table rendered inside `GasDepositDetailTable`'s expanded row.
 * Fetches via `getGasDepositDetailMutations`; skips the initial fetch on re-expand
 * when `opened` is true.
 *
 * @param {{ detailId: number; index: number; detailIndex: number; opened?: true }} props
 */
const GasDepositDetailMutationTable = ({
  detailId,
  index,
  detailIndex,
  opened,
  listKey = "list_gasDeposit",
}) => {
  // --- Hooks ---
  const dispatch = useDispatch();
  const parents = useSelector((state) => state.gasDeposit[listKey]);

  const dataSource = parents[index]?.list_gasDepositDetail[detailIndex].list_gasDepositDetailMutation || [];
  const pagination = parents[index]?.list_gasDepositDetail[detailIndex].pagination_listGdDetailMutation || {};
  const loading = parents[index]?.list_gasDepositDetail[detailIndex].loading_listGdDetailMutation || false;

  // --- Derived values ---
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
  const [isLoad, setIsLoad] = useState(!opened);
  const [fixedColumns, setFixedColumns] = useState(() => ({
    right: [],
    left: [],
  }));

  // --- Handlers ---
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
   * Resets pagination to page 0 and re-fetches the mutation list with current search/sort/filter state.
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
      getGasDepositDetailMutations({
        detailId,
        index,
        detailIndex,
        body,
        isLoadMore: false,
        listKey,
      })
    );
    setPage(0);
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
        getGasDepositDetailMutations({
          detailId,
          index,
          detailIndex,
          body,
          isLoadMore: true,
          listKey,
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
    if (isLoad) {
      const body = {
        page: 0,
        size: loadMoreSize,
        sort,
        searchs: search,
        filters,
        filterRules,
      };

      setPage(0);
      const promise = dispatch(getGasDepositDetailMutations({ detailId, index, detailIndex, body, isLoadMore: false, listKey }));
      return () => { promise.abort(); };
    } else
      setIsLoad(true)
  }, [sort, search, filters, filterRules]);

  // --- Column configuration ---
  const columnDefinitions = useMemo(() =>
    getGasDepositDetailMutationColumns(
      search,
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  [search, searchText, searchedColumn]);

  const columns = useMemo(() => {
    return nxApplyFixedColumns(columnDefinitions, fixedColumns);
  }, [columnDefinitions, fixedColumns]);

  return (
    <div className="flex flex-col gap-y-4">
      <NxTable
        idTable="gas-deposit-detail-mutation-table"
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
        fixedColumns={fixedColumns}
        setFixedColumns={setFixedColumns}
        loading={loading}
        columnDefinitions={columnDefinitions}
        onRefresh={handleRefresh}
      />
    </div>
  );
};

export default GasDepositDetailMutationTable;
