import NxTable from "../../../../components/Nx/NxTable";
import { useEffect, useMemo, useRef, useState } from "react";
import { nxApplyFixedColumns } from "../../../../utils/Nx/nxApplyFixedColumns";
import { getGasDepositDetailMutationColumns } from "./getGasDepositDetailMutationColumns";
import { useDispatch, useSelector } from "react-redux";
import { getGasDepositDetailMutations } from "../../../../redux/slices/account_management/detailAccount/GasDepositSlice";

/**
 * 
 * @param {{id: number; detailId: number;}} 
 * @returns 
 */
const GasDepositDetailMutationTable = ({
  id,
  detailId,
}) => {
  const dispatch = useDispatch();

  const {
    loading_listGdDetailMutation: loadingList,
    list_gasDepositDetailMutation: gasDepositDetailMutations,
    pagination_listGdDetailMutation: pagination,
  } = useSelector((state) => state.gasDeposit);

  const searchInput = useRef(null);

  const [page, setPage] = useState(0);
  const [loadMoreSize] = useState(20);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});

  const [filters, setFilters] = useState([]);
  const [filterRules, setFilterRules] = useState([]);

  const totalElement = pagination.totalElement;
  const hasMore = gasDepositDetailMutations.length < totalElement;

  const [fixedColumns, setFixedColumns] = useState(() => ({
    right: [],
    left: [],
  }));

  const columnDefinitions = useMemo(() =>
    getGasDepositDetailMutationColumns(
      search,
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  [search, searchInput, searchText, searchedColumn]);

  const columns = useMemo(() => {
    return nxApplyFixedColumns(columnDefinitions, fixedColumns);
  }, [columnDefinitions, fixedColumns]);

  const handleLoadMore = async () => {
    const nextPage = page + 1;
    const totalPages = pagination?.totalPages || 0;

    if (nextPage <= totalPages) {
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
          id,
          body,
          isLoadMore: true
        })
      ).unwrap();
    }
    setPage(nextPage);
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
        setPage(1);
      }
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0]
      };
    });
  };

  useEffect(() => {
    const body = {
      page: 0,
      size: loadMoreSize,
      sort,
      searchs: search,
      filters,
      filterRules,
    };

    if (detailId)
      dispatch(getGasDepositDetailMutations({ id: detailId, body, isLoadMore: false }));
  }, [detailId])

  return (
    <div className="flex flex-col gap-y-4">
      <NxTable
        idTable="gas-deposit-detail-mutation-table"
        dataSource={gasDepositDetailMutations}
        totalData={totalElement}
        current={page}
        tableScrolled={{ x: gasDepositDetailMutations.length ? "max-content" : 4000 }}
        onSort={onSort}
        columns={columns}
        usePagination={false}
        useInfiniteScroll={true}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
        loadMoreThreshold={20}
        fixedColumns={fixedColumns}
        setFixedColumns={setFixedColumns}
        loading={loadingList}
        columnDefinitions={columnDefinitions}
      />
    </div>
  );
};

export default GasDepositDetailMutationTable;
