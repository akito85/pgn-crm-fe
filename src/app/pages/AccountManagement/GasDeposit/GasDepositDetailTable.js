import NxTable from "../../../../components/Nx/NxTable";
import { useEffect, useMemo, useRef, useState } from "react";
import { nxApplyFixedColumns } from "../../../../utils/Nx/nxApplyFixedColumns";
import { getGasDepositDetailColumns } from "./getGasDepositDetailColumns";
import { useDispatch, useSelector } from "react-redux";
import { getGasDepositDetails } from "../../../../redux/slices/account_management/detailAccount/GasDepositSlice";
import GasDepositDetailMutationTable from "./GasDepositDetailMutationTable";

/**
 * Level-1 nested detail table rendered inside `GasDepositTable`'s expanded row.
 * Fetches via `getGasDepositDetails`; skips the initial fetch on re-expand when
 * `opened` is true and uses cached Redux data instead.
 *
 * @param {{ id: number; index: number; opened?: true }} props
 */
const GasDepositDetailTable = ({
  id,
  index,
  listKey = "list_gasDeposit",
  parentKey,
}) => {
  // --- Hooks ---
  const dispatch = useDispatch();
  const parent = useSelector((state) =>
    parentKey ? state.gasDeposit[parentKey] : state.gasDeposit[listKey][index]
  );

  const dataSource = parent?.list_gasDepositDetail || [];
  const pagination = parent?.pagination_listGdDetail || {};
  const loading = parent?.loading_listGdDetail || false;

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

  const fixedColumns = {
    right: ["status"],
    left: [],
  };

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
   * Resets pagination to page 0 and re-fetches the detail list with current search/sort/filter state.
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
      getGasDepositDetails({
        id,
        index,
        body,
        isLoadMore: false,
        listKey,
        parentKey,
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
        getGasDepositDetails({
          id,
          index,
          body,
          isLoadMore: true,
          listKey,
          parentKey,
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
    const promise = dispatch(getGasDepositDetails({ id, index, body, isLoadMore: false, listKey, parentKey }));
    return () => { promise.abort(); };
  }, [sort, search, filters, filterRules, parentKey]);

  // --- Column configuration ---
  const columnDefinitions = useMemo(() =>
    getGasDepositDetailColumns(
      search,
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  [search, searchText, searchedColumn]);

  const columns = useMemo(() => {
    return nxApplyFixedColumns(columnDefinitions, fixedColumns);
  }, [columnDefinitions]);

  /**
   * Renders the expanded child row for a gas deposit detail record.
   * @param {object} record - The detail row record
   */
  const expandedRowRender = (record, detailIndex) => (
    <GasDepositDetailMutationTable
      id={id}
      index={index}
      detailId={record.id}
      detailIndex={detailIndex}
      listKey={listKey}
      parentKey={parentKey}
    />
  );

  return (
    <div className="flex flex-col gap-y-4">
      <NxTable
        idTable="gas-deposit-detail-table"
        dataSource={dataSource}
        totalData={totalElement}
        tableScrolled={{ x: dataSource.length ? "max-content" : 1500 }}
        onSort={onSort}
        columns={columns}
        usePagination={false}
        useInfiniteScroll
        hasMore={hasMore}
        loadMoreThreshold={20}
        onLoadMore={handleLoadMore}
        loading={loading}
        expandable={{ expandedRowRender }}
        onRefresh={handleRefresh}
        columnDefinitions={columnDefinitions}
        showAdvanceSearch={false}
        showSearchBar={false}
        useSelect={false}
      />
    </div>
  );
};

export default GasDepositDetailTable;
