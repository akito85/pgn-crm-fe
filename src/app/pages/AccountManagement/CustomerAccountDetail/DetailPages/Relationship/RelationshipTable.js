import { useNavigate, useLocation } from "react-router-dom";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../routes/account_management/customer_account_routes";
import { useColumnActionPermission } from "../../../../../../components/ColumnActionPermission";
import Toolbar from "../../../../../../components/Toolbar";
import NxTable from "../../../../../../components/Nx/NxTable";
import { useEffect, useMemo, useRef, useState } from "react";
import { getRelationshipColumns } from "./getRelationshipColumns";
import { nxGetAccountActions } from "../../../../../../components/Nx/NxGetAccountActions";
import { useDispatch, useSelector } from "react-redux";
import RelationshipDetailTable from "./RelationshipDetailTable";
import {
  getRelationships,
  downloadRelationship,
} from "../../../../../../redux/slices/account_management/detailAccount/relationshipSlice";

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
    pagination_listRelationship: pagination,
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
      getRelationships({
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
        getRelationships({
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
      getRelationships({
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
    handleUpdate: ({ id, status, statusApproval }) => navigate(
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
          status,
          statusApproval,
        }
      }
    ),
    handleApproval,
    handleApprovalHistory: ({ id }) => handleApprovalHistoryModal(true, id),
    handleDownload,
    handleInactivate: ({ id, relatedNumber }) => handleInactivateModal(true, id, relatedNumber),
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
      getRelationshipColumns({
        search,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      }),
    [search, searchText, searchText, searchedColumn]
  );

  const columns = useMemo(() => {
    return [...baseColumns, ...actionCols].map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
  }, [baseColumns, actionCols]);

  const expandedRowRender = (record) => <RelationshipDetailTable relatedDetail={record.relatedDetail} />;

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
        loading={loading}
        expandable={{
          expandedRowRender,
        }}
      />
    </div>
  );
};

export default RelationshipTable;
