import { useEffect, useRef, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import NxTable from "../../../../../../../components/Nx/NxTable";
import GasDepositDetailTable from "../../../GasDepositDetailTable";
import {
  getGasDeposits,
} from "../../../../../../../redux/slices/account_management/detailAccount/GasDepositSlice";
import { getGasDepositColumns } from "../../../getGasDepositColumns";
import { nxApplyFixedColumns } from "../../../../../../../utils/Nx/nxApplyFixedColumns";

/**
 * Gas deposit table for bulk recalculate/expire.
 *
 * Selection mode (default): fetches data, supports search/sort/filter/infinite
 * scroll, and row selection. Lifts selection and expand state to the parent.
 *
 * Read-only mode (`readOnly`): renders a static subset of rows passed via
 * `dataSource` — no fetch, no selection, no search/sort controls. Used in
 * the confirmation modal recap.
 *
 * @param {{
 *   accountId?: number;
 *   selectedRowKeys?: (string|number)[];
 *   onSelectionChange?: (keys: (string|number)[]) => void;
 *   openedMemo: Record<string|number, true>;
 *   onExpand: (expanded: boolean, record: object) => void;
 *   readOnly?: boolean;
 *   dataSource?: object[];
 * }} props
 */
const GasDepositBulkTable = ({
  accountId,
  selectedRowKeys = [],
  onSelectionChange = () => {},
  openedMemo,
  onExpand,
  readOnly = false,
  dataSource: externalDataSource,
}) => {
  const dispatch = useDispatch();
  const { list_gasDeposit, pagination_listGd, loading_listGd } = useSelector((state) => state.gasDeposit);

  const [page, setPage] = useState(0);
  const [loadMoreSize] = useState(20);
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [filters] = useState([]);
  const [filterRules] = useState([]);
  const [fixedColumns, setFixedColumns] = useState({ left: ["no"], right: [] });
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(selectedKeys[0] ? dataIndex : "");
    setSearch((prev) => ({ ...prev, [dataIndex]: selectedKeys[0] }));
  };

  const onSort = (_, __, sorter) => {
    setSort(sorter.order
      ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
      : "");
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    if (nextPage <= (pagination_listGd.totalPage || 0)) {
      dispatch(getGasDeposits({
        accountId: accountId || undefined,
        body: { page: nextPage, size: loadMoreSize, sort, searchs: search, filters, filterRules },
        isLoadMore: true,
      }));
      setPage(nextPage);
    }
  };

  // gdIndexById always references list_gasDeposit so GasDepositDetailTable
  // can locate nested detail data regardless of which mode we're in.
  const gdIndexById = useMemo(
    () => Object.fromEntries(list_gasDeposit.map((item, idx) => [item.id, idx])),
    [list_gasDeposit]
  );

  const expandedRowRender = (record) => (
    <GasDepositDetailTable
      id={record.id}
      index={gdIndexById[record.id]}
      opened={openedMemo[record.id]}
    />
  );

  const rowSelection = readOnly ? undefined : {
    fixed: true,
    selectedRowKeys,
    onChange: (newKeys) => onSelectionChange([...newKeys]),
    preserveSelectedRowKeys: true,
  };

  const columnDefinitions = useMemo(() =>
    getGasDepositColumns({
      search,
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      includeStatus: false,
      isUnderAccount: !!accountId,
      isFrontEnd: readOnly
    }),
    [readOnly, search, searchInput, searchedColumn, searchText]
  );

  const columns = useMemo(
    () => nxApplyFixedColumns(columnDefinitions, fixedColumns),
    [columnDefinitions, fixedColumns]
  );

  useEffect(() => {
    if (readOnly) return;
    const body = { page: 0, size: loadMoreSize, sort, searchs: search, filters, filterRules };
    setPage(0);
    const promise = dispatch(getGasDeposits({
      accountId: accountId || undefined,
      body,
      isLoadMore: false,
    }));
    return () => { promise.abort(); };
  }, [readOnly, sort, search, filters, filterRules]);

  const dataSource = readOnly ? externalDataSource : list_gasDeposit;

  return (
    <NxTable
      idTable={readOnly ? "bulk-gas-deposit-confirm-table" : "bulk-gas-deposit-select-table"}
      dataSource={dataSource}
      columns={columns}
      totalData={readOnly ? dataSource?.length : pagination_listGd.totalElement}
      tableScrolled={{ x: dataSource?.length ? "max-content" : 3000 }}
      onSort={readOnly ? undefined : onSort}
      columnDefinitions={columnDefinitions}
      fixedColumns={fixedColumns}
      setFixedColumns={readOnly ? undefined : setFixedColumns}
      useSelect={!readOnly}
      loading={readOnly ? false : loading_listGd}
      usePagination={false}
      useInfiniteScroll={!readOnly}
      hasMore={readOnly ? false : list_gasDeposit.length < (pagination_listGd.totalElement || 0)}
      onLoadMore={readOnly ? undefined : handleLoadMore}
      loadMoreThreshold={20}
      rowSelection={rowSelection}
      expandable={{ expandedRowRender, onExpand }}
      showExport={false}
    />
  );
};

export default GasDepositBulkTable;
