import NxTable from "../../../../components/Nx/NxTable";
import { useEffect, useMemo, useRef, useState } from "react";
import { getGasDepositDetailColumns } from "./getGasDepositDetailColumns";
import { useDispatch, useSelector } from "react-redux";
import { getGasDepositDetails } from "../../../../redux/slices/account_management/detailAccount/GasDepositSlice";
import GasDepositDetailMutationTable from "./GasDepositDetailMutationTable";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";
import { nxGetAccountActions } from "../../../../components/Nx/NxGetAccountActions";

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
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

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

  const handleExpandableRow = (toggledKey) => {
    const index = expandedRowKeys.findIndex(key => key === toggledKey);

    // If detail row is opened
    if (index !== -1) {
      setExpandedRowKeys(prev => {
        const tmpPrev = [...prev];
        tmpPrev.splice(index, 1);
        return tmpPrev;
      });
    }
    // If detail row is closed
    else {
      setExpandedRowKeys(prev => [
        ...prev,
        toggledKey
      ])
    }
  }

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
  const itemActions = nxGetAccountActions({
    handleView: ({ id }) => handleExpandableRow(id),
  });

  const actionCols = useColumnActionPermission(["View"], itemActions, "View", "table").map(
    (col) => ({
      ...col,
      width: 70,
      align: "center",
    })
  );

  const baseColumns = useMemo(() =>
    getGasDepositDetailColumns({
      search,
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    }),
  [search, searchInput, searchText, searchedColumn]);

  const columns = useMemo(() => [...baseColumns, ...actionCols], [baseColumns, actionCols]);

  /**
   * Renders the expanded child row for a gas deposit detail record.
   * @param {object} record - The detail row record
   */
  const expandedRowRender = (record, detailIndex) => (
    <div className="flex flex-col gap-y-4">
      <span className="text-primary text-base uppercase leading-6">
        GAS DEPOSIT DETAIL MUTATION LIST
      </span>
      <GasDepositDetailMutationTable
        id={id}
        index={index}
        detailId={record.id}
        detailIndex={detailIndex}
        listKey={listKey}
        parentKey={parentKey}
      />
    </div>
  );

  return (
    <NxTable
      idTable="gas-deposit-detail-table"
      className="[&_.ant-table-expanded-row-fixed]:!pl-2"
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
      expandable={{ expandedRowRender, showExpandColumn: false, expandedRowKeys }}
      onRefresh={handleRefresh}
      showAdvanceSearch={false}
      showSearchBar={false}
      useSelect={false}
    />
  );
};

export default GasDepositDetailTable;
