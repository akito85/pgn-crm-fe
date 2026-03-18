import { useLocation, useNavigate } from "react-router-dom";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../routes/account_management/customer_account_routes";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";
import Toolbar from "../../../../components/Toolbar";
import NxTable from "../../../../components/Nx/NxTable";
import { useMemo, useState, useRef, useEffect } from "react";
import { getGasDepositColumns } from "./getGasDepositColumns";
import { nxGetAccountActions } from "../../../../components/Nx/NxGetAccountActions";
import { nxApplyFixedColumns } from "../../../../utils/Nx/nxApplyFixedColumns";
import GasDepositDetailTable from "./GasDepositDetailTable";
import { useDispatch, useSelector } from "react-redux";
import { getGasDeposit, downloadGasDeposit } from "../../../../redux/slices/account_management/detailAccount/GasDepositSlice";

/**
 * Gas deposit list table (container + presentational component).
 * Owns search, pagination, sort, filter, and download state/logic.
 * The parent (`GasDepositModule`) is responsible only for modals, permissions,
 * and the detail mutation table.
 *
 * @param {object}    props
 * @param {"sa"|"ua"} props.moduleType                    - Module context: standalone ("sa") or under-account ("ua")
 * @param {Function}  [props.handleInactivateModal]       - Opens the inactivate confirmation modal
 * @param {Function}  [props.handleApprovalHistoryModal]  - Opens the approval history modal
 * @param {Function}  [props.handleApproval]              - Triggers the approval action
 * @param {Function}  [props.handleSelectDetail]          - Row click / select-detail handler
 * @param {number}    [props.accountId]                   - Account ID (used when moduleType is "ua")
 * @param {number}    [props.cutomerId]                   - Customer ID
 * @param {number}    [props.refreshSignal=0]             - Increment to trigger a page-0 refresh from the parent
 */
const GasDepositTable = ({
  moduleType,
  handleInactivateModal = () => {},
  handleApprovalHistoryModal = () => {},
  handleApproval = () => {},
  handleSelectDetail = () => {},
  accountId,
  cutomerId,
  refreshSignal = 0,
}) => {
  // --- Hooks ---
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    list_gasDeposit: dataSource,
    pagination_gasDeposit: pagination,
    loading_listGd: loading,
  } = useSelector((state) => state.gasDeposit);

  // --- Derived values ---
  const isStandAlone = moduleType === "sa";
  const isUnderAccount = moduleType === "ua";

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

  const [fixedColumns, setFixedColumns] = useState(() => ({
    right: ["statusApproval", "status"],
    left: [],
  }));

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
      getGasDeposit({
        id: isUnderAccount ? accountId : undefined,
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
        getGasDeposit({
          id: isUnderAccount ? accountId : undefined,
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
    dispatch(getGasDeposit({ id: isUnderAccount ? accountId : undefined, body, isLoadMore: false }));
  }, [sort, search, filters, filterRules]);

  // Trigger a page-0 refresh when the parent signals it (e.g. after inactivate/approval).
  useEffect(() => {
    if (refreshSignal > 0) handleRefresh();
  }, [refreshSignal]);

  // --- Column configuration ---
  const itemActions = nxGetAccountActions({
    handleView: ({ id }) => navigate(
      isStandAlone ?
        ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_GAS_DEPOSIT_SA :
      isStandard ?
        ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_GAS_DEPOSIT :
      isOneTime ?
        ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_GAS_DEPOSIT_ONETIME :
        "",
      {
        state: {
          accountId,
          cutomerId,
          id,
        }
      }
    ),
    handleRecalculate: ({ id, recordAccountId, recordCustomerId }) => navigate(
      isStandAlone ?
        ACCOUNT_MANAGEMENT_ROUTES.RECALCULATE_GAS_DEPOSIT_SA :
      isStandard ?
        ACCOUNT_MANAGEMENT_ROUTES.RECALCULATE_GAS_DEPOSIT :
      isOneTime ?
        ACCOUNT_MANAGEMENT_ROUTES.RECALCULATE_GAS_DEPOSIT_ONETIME :
        "",
      {
        state: {
          accountId: isStandAlone ? accountId : isUnderAccount ? recordAccountId : undefined,
          cutomerId: isStandAlone ? cutomerId : isUnderAccount ? recordCustomerId : undefined,
          id,
        }
      }
    ),
    handleExpire: ({ id, recordAccountId, recordCustomerId }) => navigate(
      isStandAlone ?
        ACCOUNT_MANAGEMENT_ROUTES.EXPIRE_GAS_DEPOSIT_SA :
      isStandard ?
        ACCOUNT_MANAGEMENT_ROUTES.EXPIRE_GAS_DEPOSIT :
      isOneTime ?
        ACCOUNT_MANAGEMENT_ROUTES.EXPIRE_GAS_DEPOSIT_ONETIME :
        "",
      {
        state: {
          accountId: isStandAlone ? accountId : isUnderAccount ? recordAccountId : undefined,
          cutomerId: isStandAlone ? cutomerId : isUnderAccount ? recordCustomerId : undefined,
          id,
        }
      }
    ),
    handleApproval,
    handleApprovalHistory: ({ id }) => handleApprovalHistoryModal(true, id),
    handleDownload,
    handleInactivate: ({ id, accountNumber }) => handleInactivateModal(true, id, accountNumber),
  });

  const actionCols = useColumnActionPermission(["Inactivate", "Update", "History"], itemActions, "View", "table").map(
    (col) => ({
      ...col,
      width: 70,
      align: "center",
    })
  );

  const baseColumns = useMemo(() =>
    getGasDepositColumns({
      search,
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      isUnderAccount,
    }),
  [search, searchInput, searchText, searchedColumn]);

  const columnDefinitions = useMemo(() => [...baseColumns, ...actionCols], [baseColumns, actionCols]);

  const columns = useMemo(() => {
    return nxApplyFixedColumns(columnDefinitions, fixedColumns);
  }, [columnDefinitions, fixedColumns]);

  /**
   * Renders the expanded child row for a gas deposit record.
   * @param {object} record - The parent gas deposit row record
   */
  const expandedRowRender = (record) => {
    return (
      <GasDepositDetailTable
        dataSource={record.details}
        handleView={handleSelectDetail}
      />
    );
  };

  return (
    <div className="flex flex-col gap-y-4">
      <Toolbar items={itemActions} type="detail" />
      <NxTable
        idTable="gas-deposit-table"
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
        columnDefinitions={columnDefinitions}
        loading={loading}
        expandable={{ expandedRowRender }}
      />
    </div>
  );
};

export default GasDepositTable;
