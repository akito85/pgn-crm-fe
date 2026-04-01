import NxTable from "../../../../components/Nx/NxTable";
import { useEffect, useMemo, useRef, useState } from "react";
import { nxApplyFixedColumns } from "../../../../utils/Nx/nxApplyFixedColumns";
import { getGasDepositDetailColumns } from "./getGasDepositDetailColumns";
import { useDispatch, useSelector } from "react-redux";
import { getGasDepositDetails } from "../../../../redux/slices/account_management/detailAccount/GasDepositSlice";
import GasDepositDetailMutationTable from "./GasDepositDetailMutationTable";

const GasDepositDetailTable = ({
  id,
  index,
  opened,
}) => {
  // --- Hooks ---
  const dispatch = useDispatch();
  const {
    list_gasDeposit: parents,
  } = useSelector((state) => state.gasDeposit);

  const dataSource = parents[index].list_gasDepositDetail || [];
  const pagination = parents[index].pagination_listGdDetail || {};
  const loading = parents[index].loading_listGdDetail || false;

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

  const [openedMemo, setOpenedMemo] = useState({});

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

  const [fixedColumns, setFixedColumns] = useState(() => ({
    right: [],
    left: [],
  }));
  
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
  }, [columnDefinitions, fixedColumns]);

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
      getGasDepositDetails({
        id,
        index,
        body,
        isLoadMore: false,
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
        })
      ).unwrap();
    }
    setPage(nextPage);
  };

  /**
   * Renders the expanded child row for a gas deposit record.
   * @param {object} record - The parent gas deposit row record
   */
  const expandedRowRender = (record, detailIndex) => (
    <GasDepositDetailMutationTable
      id={id}
      index={index}
      detailId={record.id}
      detailIndex={detailIndex}
      opened={openedMemo[record.id]}
    />
  );

  const onExpand = (expanded, record) => {
    if (expanded) {
      setOpenedMemo(prev => ({
        ...prev,
        [record.id]: true,
      }))
    }
  }

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
      const promise = dispatch(getGasDepositDetails({ id, index, body, isLoadMore: false }));
      return () => { promise.abort(); };
    } else
      setIsLoad(true);
  }, [sort, search, filters, filterRules]);

  return (
    <div className="flex flex-col gap-y-4">
      <NxTable
        idTable="gas-deposit-detail-table"
        dataSource={dataSource}
        totalData={totalElement}
        tableScrolled={{ x: dataSource.length ? "max-content" : 4000 }}
        onSort={onSort}
        columns={columns}
        usePagination={false}
        loadMoreThreshold={20}
        fixedColumns={fixedColumns}
        setFixedColumns={setFixedColumns}
        columnDefinitions={columnDefinitions}
        onLoadMore={handleLoadMore}
        hasMore={hasMore}
        loading={loading}
        expandable={{ expandedRowRender, onExpand }}
        onRefresh={handleRefresh}
        useInfiniteScroll
      />
    </div>
  );
};

export default GasDepositDetailTable;
