import { useNavigate, useLocation } from "react-router-dom";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../../routes/account_management/customer_account_routes";
import { useColumnActionPermission } from "../../../../../../../components/ColumnActionPermission";
import Toolbar from "../../../../../../../components/Toolbar";
import NxTable from "../../../../../../../components/Nx/NxTable";
import { useMemo, useState, useRef, useEffect } from "react";
import { getInvoiceRelationColumns } from "./getInvoiceRelationColumns";
import { nxGetAccountActions } from "../../../../../../../components/Nx/NxGetAccountActions";
import { nxApplyFixedColumns } from "../../../../../../../utils/Nx/nxApplyFixedColumns";
import { useDispatch, useSelector } from "react-redux";
import {
  getInvoiceRelations,
  downloadInvoiceRelation
} from "../../../../../../../redux/slices/account_management/detailAccount/InvoiceRelationSlice";

/**
 * Invoice relation list table (container + presentational component).
 * Owns search, pagination, sort, filter, and download state/logic.
 * The parent (`InvoiceRelation`) is responsible only for modals and permissions.
 *
 * @param {object}   props
 * @param {number}   props.accountId                  - Account ID
 * @param {number}   props.customerId                 - Customer ID
 * @param {Function} [props.handleInactivateModal]        - Opens the inactivate confirmation modal
 * @param {Function} [props.handleApprovalHistoryModal]   - Opens the approval history modal
 * @param {Function} [props.handleApproval]               - Triggers the approval action
 * @param {number}   [props.refreshSignal=0]              - Increment to trigger a page-0 refresh from the parent
 */
const InvoiceRelationTable = ({
  accountId,
  customerId,
  handleInactivateModal = () => {},
  handleApprovalHistoryModal = () => {},
  handleApproval = () => {},
  refreshSignal = 0
}) => {
  // --- Hooks ---
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const {
    list_invoiceRelation: dataSource,
    pagination_listIr: pagination,
    loading_listIr: loading
  } = useSelector((state) => state.invoiceRelation);

  // --- Derived values ---
  const isStandard = location.pathname.includes("account-standard");
  const isOneTime = location.pathname.includes("account-onetime");

  const totalElement = pagination.totalElement;
  const hasMore = dataSource.length < (totalElement || 0);

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
    right: ["statusApproval", "status", "action"],
    left: []
  }));

  // --- Handlers ---
  /**
   * Resets pagination to page 0 and re-fetches the invoice relation list with current search/sort/filter state.
   */
  const handleRefresh = () => {
    const body = {
      page: 0,
      size: loadMoreSize,
      sort,
      searchs: search,
      filters,
      filterRules
    };

    dispatch(getInvoiceRelations({ id: accountId, body, isLoadMore: false }));
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
        [dataIndex]: selectedKeys[0]
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
        filterRules
      };

      await dispatch(
        getInvoiceRelations({ id: accountId, body, isLoadMore: true })
      ).unwrap();
    }
    setPage(nextPage);
  };

  /**
   * Dispatches a download action for the current filtered/sorted view.
   */
  const handleDownload = () => {
    const body = {
      sort,
      searchs: search,
      filters,
      filterRules
    };

    dispatch(downloadInvoiceRelation({ body, id: accountId }));
  };

  // --- Effects ---
  // Re-fetch page 0 whenever sort or search changes.
  useEffect(() => {
    const body = {
      page: 0,
      size: loadMoreSize,
      sort,
      searchs: search,
      filters,
      filterRules
    };

    setPage(0);
    dispatch(getInvoiceRelations({ id: accountId, body, isLoadMore: false }));
  }, [sort, search, filters, filterRules]);

  // Trigger a page-0 refresh when the parent signals it (e.g. after inactivate/approval).
  useEffect(() => {
    if (refreshSignal > 0) handleRefresh();
  }, [refreshSignal]);

  // --- Column configuration ---
  const itemActions = nxGetAccountActions({
    handleView: ({ id }) =>
      navigate(
        isStandard
          ? ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_INVOICE_RELATION
          : isOneTime
            ? ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_INVOICE_RELATION_ONETIME
            : "",
        {
          state: {
            idAccount: accountId,
            idCustomer: customerId,
            id
          }
        }
      ),
    handleCreate: () =>
      navigate(
        isStandard
          ? ACCOUNT_MANAGEMENT_ROUTES.CREATE_INVOICE_RELATION
          : isOneTime
            ? ACCOUNT_MANAGEMENT_ROUTES.CREATE_INVOICE_RELATION_ONETIME
            : "",
        {
          state: {
            idAccount: accountId,
            idCustomer: customerId,
          }
        }
      ),
    handleUpdate: ({ id }) =>
      navigate(
        isStandard
          ? ACCOUNT_MANAGEMENT_ROUTES.UPDATE_INVOICE_RELATION
          : isOneTime
            ? ACCOUNT_MANAGEMENT_ROUTES.UPDATE_INVOICE_RELATION_ONETIME
            : "",
        {
          state: {
            idAccount: accountId,
            idCustomer: customerId,
            id
          }
        }
      ),
    handleApproval,
    handleApprovalHistory: ({ id }) => handleApprovalHistoryModal(true, id),
    handleDownload,
    handleInactivate: ({ id, accountNumber }) => handleInactivateModal(true, id, accountNumber)
  });

  const actionCols = useColumnActionPermission(
    ["Inactivate", "View", "Update", "History"],
    itemActions,
    "View",
    "table"
  ).map((col) => ({
    ...col,
    width: 70,
    align: "center"
  }));

  const baseColumns = useMemo(
    () =>
      getInvoiceRelationColumns(
        search,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    [search, searchInput, searchText, searchedColumn]
  );

  const columnDefinitions = useMemo(
    () => [...baseColumns, ...actionCols],
    [baseColumns, actionCols]
  );

  const columns = useMemo(() => {
    return nxApplyFixedColumns(columnDefinitions, fixedColumns);
  }, [columnDefinitions, fixedColumns]);

  return (
    <div className="flex flex-col gap-y-4">
      <Toolbar items={itemActions} type="detail" />
      <NxTable
        idTable="invoice-relation-table"
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
        fixedColumns={fixedColumns}
        setFixedColumns={setFixedColumns}
        columnDefinitions={columnDefinitions}
        loading={loading}
      />
    </div>
  );
};

export default InvoiceRelationTable;
