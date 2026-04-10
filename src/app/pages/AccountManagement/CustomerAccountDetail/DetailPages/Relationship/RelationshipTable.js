import { useNavigate, useLocation } from "react-router-dom";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../routes/account_management/customer_account_routes";
import { useColumnActionPermission } from "../../../../../../components/ColumnActionPermission";
import Toolbar from "../../../../../../components/Toolbar";
import NxTable from "../../../../../../components/Nx/NxTable";
import { useEffect, useMemo, useRef, useState } from "react";
import { getRelationshipColumns } from "./getRelationshipColumns";
import { nxGetAccountActions } from "../../../../../../components/Nx/NxGetAccountActions";
import { nxApplyFixedColumns } from "../../../../../../utils/Nx/nxApplyFixedColumns";
import TablePagination from "../../../../../../components/TablePagination";
import { useDispatch, useSelector } from "react-redux";
import {
  getRelationshipList,
  downloadRelationship,
} from "../../../../../../redux/slices/account_management/detailAccount/relationshipSlice";

// Nested columns configuration for expandable rows
const NESTED_COLUMNS = [
  {
    title: "NO",
    align: "center",
    width: 60,
    render: (text, object, index) => (
      <div style={{ padding: "8px 0" }}>{index + 1}</div>
    ),
  },
  {
    title: "ACCOUNT NUMBER",
    dataIndex: "accountNumber",
    align: "left",
    sorter: (a, b) => (a.accountNumber || "").localeCompare(b.accountNumber || ""),
    render: (text) => <div style={{ padding: "8px 16px" }}>{text || "-"}</div>,
  },
  {
    title: "ACCOUNT NAME",
    dataIndex: "accountName",
    align: "left",
    sorter: (a, b) => (a.accountName || "").localeCompare(b.accountName || ""),
    render: (text) => <div style={{ padding: "8px 16px" }}>{text || "-"}</div>,
  },
  {
    title: "ACCOUNT CATEGORY",
    dataIndex: "accountCategory",
    align: "left",
    sorter: (a, b) => (a.accountCategory || "").localeCompare(b.accountCategory || ""),
    render: (text) => <div style={{ padding: "8px 16px" }}>{text || "-"}</div>,
  },
  {
    title: "SOR",
    dataIndex: "sor",
    align: "left",
    sorter: (a, b) => (a.sor || "").localeCompare(b.sor || ""),
    render: (text) => <div style={{ padding: "8px 16px" }}>{text || "-"}</div>,
  },
  {
    title: "COST CENTER",
    dataIndex: "costCenter",
    align: "left",
    sorter: (a, b) => (a.costCenter || "").localeCompare(b.costCenter || ""),
    render: (text) => <div style={{ padding: "8px 16px" }}>{text || "-"}</div>,
  },
  {
    title: "METER READING CODE",
    dataIndex: "meterReadingCode",
    align: "left",
    sorter: (a, b) => (a.meterReadingCode || "").localeCompare(b.meterReadingCode || ""),
    render: (text) => <div style={{ padding: "8px 16px" }}>{text || "-"}</div>,
  },
];

// Expandable row renderer for Related Detail
const expandedRowRender = (record) => {
  const relatedDetailData = record?.relatedDetail || [];

  return (
    <div className="bg-blue-50 -mx-2 pl-6 py-2">
      <h4 className="text-[#0075bf] font-semibold text-sm my-2">RELATED DETAIL</h4>
      <TablePagination
        useSelect={false}
        usePagination={false}
        dataSource={relatedDetailData}
        columns={NESTED_COLUMNS}
        className="related-detail-nested-table"
      />
    </div>
  );
};

/**
 * Relationship list table (container + presentational component).
 * Owns search, pagination, sort, filter, and download state/logic.
 * The parent (`Relationship`) is responsible only for modals and permissions.
 *
 * @param {object}   props
 * @param {number}   props.accountId                       - Account ID
 * @param {number}   props.customerId                      - Customer ID
 * @param {string}   [props.type="standard"]               - Account type
 * @param {Function} [props.handleInactivateModal]         - Opens the inactivate confirmation modal
 * @param {Function} [props.handleApprovalHistoryModal]    - Opens the approval history modal
 * @param {Function} [props.handleApproval]                - Triggers the approval action
 * @param {number}   [props.refreshSignal=0]               - Increment to trigger a page-0 refresh from the parent
 */
const RelationshipTable = ({
  accountId,
  customerId,
  handleInactivateModal = () => {},
  handleApprovalHistoryModal = () => {},
  handleApproval = () => {},
  refreshSignal = 0,
}) => {
  // --- Hooks ---
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const {
    list_relationship: dataSource,
    pagination_relationship: pagination,
    loading_listRelationship: loading,
  } = useSelector((state) => state.relationship);

  // --- Derived values ---
  const isStandard = location.pathname.includes("account-standard");
  const isOneTime = location.pathname.includes("account-onetime");
  const totalElement = pagination.totalElements || 0;
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
    right: ["statusApproval", "status", "action"],
    left: [],
  }));

  // --- Handlers ---
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
      getRelationshipList({
        accountId,
        page: 0,
        pageSize: loadMoreSize,
        sort,
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
    const totalPages = pagination.totalPages || 0;

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
        getRelationshipList({
          accountId,
          page: nextPage,
          pageSize: loadMoreSize,
          sort,
          body,
          isLoadMore: true,
        }).unwrap()
      );
    }
    setPage(nextPage);
  };

  /**
   * Dispatches a download action for the current filtered/sorted view.
   */
  const handleDownload = () => {
    const body = {
      sort,
      filters,
      filterRules,
      searchs: search,
    };

    dispatch(downloadRelationship({ accountId, body }));
  };

  // --- Effects ---
  // Re-fetch page 0 whenever sort, search, or filter changes.
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
    dispatch(
      getRelationshipList({
        accountId,
        page: 0,
        pageSize: loadMoreSize,
        sort,
        body,
        isLoadMore: false,
      })
    );
  }, [sort, search, filters, filterRules]);

  // Trigger a page-0 refresh when the parent signals it (e.g. after inactivate/approval).
  useEffect(() => {
    if (refreshSignal > 0) handleRefresh();
  }, [refreshSignal]);

  // --- Column configuration ---
  const itemActions = nxGetAccountActions({
    handleView: ({ id }) => navigate(
      isStandard
        ? ACCOUNT_MANAGEMENT_ROUTES.DETAIL_RELATIONSHIP
        : isOneTime
        ? ACCOUNT_MANAGEMENT_ROUTES.DETAIL_RELATIONSHIP_ONETIME
        : "",
      {
        state: {
          idAccount: accountId,
          idCustomer: customerId,
          id,
        }
      }
    ),
    handleCreate: () => navigate(
      isStandard
        ? ACCOUNT_MANAGEMENT_ROUTES.CREATE_RELATIONSHIP
        : isOneTime
        ? ACCOUNT_MANAGEMENT_ROUTES.CREATE_RELATIONSHIP_ONETIME
        : "",
      {
        state: {
          idAccount: accountId,
          idCustomer: customerId,
        }
      }
    ),
    handleUpdate: ({ id }) => navigate(
      isStandard
        ? ACCOUNT_MANAGEMENT_ROUTES.UPDATE_RELATIONSHIP
        : isOneTime
        ? ACCOUNT_MANAGEMENT_ROUTES.UPDATE_RELATIONSHIP_ONETIME
        : "",
      {
        state: {
          idAccount: accountId,
          idCustomer: customerId,
          id,
        }
      }
    ),
    handleApproval,
    handleApprovalHistory: ({ id }) => handleApprovalHistoryModal(true, id),
    handleDownload,
    handleInactivate: ({ id, accountNumber }) => handleInactivateModal(true, id, accountNumber),
  });

  const actionCols = useColumnActionPermission(
    ["Inactivate", "View", "Update", "History"],
    itemActions,
    "View",
    "table"
  ).map((col) => ({
    ...col,
    width: 70,
    align: "center",
  }));

  const baseColumns = useMemo(
    () =>
      getRelationshipColumns(
        search,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    [search, searchText, searchedColumn]
  );

  const columnDefinitions = useMemo(() => {
    return [...baseColumns, ...actionCols].map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
  }, [baseColumns, actionCols]);

  const columns = useMemo(() => {
    return nxApplyFixedColumns(columnDefinitions, fixedColumns);
  }, [columnDefinitions, fixedColumns]);

  return (
    <div className="flex flex-col gap-y-4">
      <Toolbar items={itemActions} type="detail" />
      <NxTable
        idTable="relationship-table"
        dataSource={dataSource}
        totalData={totalElement}
        current={page}
        tableScrolled={{ x: dataSource.length ? "max-content" : 2000 }}
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
        expandable={{
          expandedRowRender,
          rowExpandable: (record) => record?.relatedDetail && record.relatedDetail.length > 0,
        }}
      />
    </div>
  );
};

export default RelationshipTable;
