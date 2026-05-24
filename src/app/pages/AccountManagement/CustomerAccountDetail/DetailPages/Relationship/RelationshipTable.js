import { useNavigate, useLocation } from "react-router-dom";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../routes/account_management/customer_account_routes";
import { RELATIONSHIP_ROUTES } from "../../../../../../routes/relationship/relationship_routes";
import { useColumnActionPermission } from "../../../../../../components/ColumnActionPermission";
import Toolbar from "../../../../../../components/Toolbar";
import NxTable from "../../../../../../components/Nx/NxTable";
import { useEffect, useMemo, useRef, useState } from "react";
import { getRelationshipColumns } from "./getRelationshipColumns";
import { getStandaloneRelationshipColumns } from "./getStandaloneRelationshipColumns";
import { nxGetAccountActions } from "../../../../../../components/Nx/NxGetAccountActions";
import { useDispatch, useSelector } from "react-redux";
import RelationshipDetailTable from "./RelationshipDetailTable";
import {
  getRelationships,
  downloadRelationship,
} from "../../../../../../redux/slices/account_management/detailAccount/relationshipSlice";
import {
  getStandaloneRelationships,
  downloadStandaloneRelationship,
} from "../../../../../../redux/slices/relationship/standaloneRelationshipSlice";

/**
 * Relationship list table (container + presentational component).
 * When isStandalone=true, fetches all cross-account relationships and uses standalone routes.
 *
 * @param {object}   props
 * @param {number}   props.accountId
 * @param {number}   props.customerId
 * @param {Function} [props.handleInactivateModal]
 * @param {Function} [props.handleApprovalHistoryModal]
 * @param {Function} [props.handleApproval]
 * @param {number}   [props.refreshSignal=0]
 * @param {boolean}  [props.isStandalone=false]
 */
const RelationshipTable = ({
  accountId,
  customerId,
  handleInactivateModal = () => {},
  handleApprovalHistoryModal = () => {},
  handleApproval = () => {},
  refreshSignal = 0,
  isStandalone = false,
}) => {
  // --- Hooks ---
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const sliceKey = isStandalone ? "standaloneRelationship" : "relationship";
  const {
    list_relationship: dataSource,
    pagination_listRelationship: pagination,
    loading_listRelationship: loading,
  } = useSelector((state) => state[sliceKey]);

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

  // --- Fetch helper ---
  const fetchRelationships = ({ page: p, isLoadMore }) => {
    const body = { page: p, size: loadMoreSize, sort, searchs: search, filters, filterRules };
    if (isStandalone) {
      dispatch(getStandaloneRelationships({ page: p, pageSize: loadMoreSize, sort, body, isLoadMore }));
    } else {
      dispatch(getRelationships({ accountId, page: p, pageSize: loadMoreSize, sort, body, isLoadMore }));
    }
  };

  // --- Handlers ---
  const handleRefresh = () => { fetchRelationships({ page: 0, isLoadMore: false }); setPage(0); };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) setPage(0);
      return { ...prevState, [dataIndex]: selectedKeys[0] };
    });
  };

  const onSort = (_, __, sortInfo) => {
    setSort(sortInfo.order ? `${sortInfo.field}~${sortInfo.order === "ascend" ? "asc" : "desc"}` : "");
  };

  const handleLoadMore = async () => {
    const nextPage = page + 1;
    if (nextPage <= (pagination.totalPages || 0)) {
      fetchRelationships({ page: nextPage, isLoadMore: true });
    }
    setPage(nextPage);
  };

  const handleDownload = () => {
    const body = { sort, filters, filterRules, searchs: search };
    if (isStandalone) {
      dispatch(downloadStandaloneRelationship({ body }));
    } else {
      dispatch(downloadRelationship({ accountId, body }));
    }
  };

  // --- Effects ---
  useEffect(() => {
    setPage(0);
    fetchRelationships({ page: 0, isLoadMore: false });
  }, [sort, search, filters, filterRules]);

  useEffect(() => {
    if (refreshSignal > 0) handleRefresh();
  }, [refreshSignal]);

  // --- Navigation helpers ---
  const navigateTo = (route, state) => navigate(route, { state });

  const getViewRoute = () => {
    if (isStandalone) return RELATIONSHIP_ROUTES.DETAIL_RELATIONSHIP;
    return isStandard ? ACCOUNT_MANAGEMENT_ROUTES.DETAIL_RELATIONSHIP
      : isOneTime ? ACCOUNT_MANAGEMENT_ROUTES.DETAIL_RELATIONSHIP_ONETIME : "";
  };

  const getCreateRoute = () => {
    if (isStandalone) return RELATIONSHIP_ROUTES.CREATE_RELATIONSHIP;
    return isStandard ? ACCOUNT_MANAGEMENT_ROUTES.CREATE_RELATIONSHIP
      : isOneTime ? ACCOUNT_MANAGEMENT_ROUTES.CREATE_RELATIONSHIP_ONETIME : "";
  };

  const getUpdateRoute = () => {
    if (isStandalone) return RELATIONSHIP_ROUTES.UPDATE_RELATIONSHIP;
    return isStandard ? ACCOUNT_MANAGEMENT_ROUTES.UPDATE_RELATIONSHIP
      : isOneTime ? ACCOUNT_MANAGEMENT_ROUTES.UPDATE_RELATIONSHIP_ONETIME : "";
  };

  // --- Column configuration ---
  const itemActions = nxGetAccountActions({
    handleView: ({ id, subjectId }) => navigateTo(getViewRoute(), {
      idAccount: isStandalone ? subjectId : accountId,
      idCustomer: customerId,
      id,
      isStandalone,
    }),
    handleCreate: () => navigateTo(getCreateRoute(), {
      idAccount: accountId,
      idCustomer: customerId,
      formType: "create",
    }),
    handleUpdate: ({ id, status, statusApproval, subjectId }) => navigateTo(getUpdateRoute(), {
      idAccount: isStandalone ? subjectId : accountId,
      idCustomer: customerId,
      id,
      status,
      statusApproval,
      formType: "update",
    }),
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
  ).map((col) => ({ ...col, width: 70, align: "center" }));

  const columnParams = { search, searchInput, searchedColumn, searchText, handleSearch };

  const baseColumns = useMemo(
    () => isStandalone
      ? getStandaloneRelationshipColumns(columnParams)
      : getRelationshipColumns(columnParams),
    [search, searchText, searchedColumn, isStandalone]
  );

  const columns = useMemo(() => {
    return [...baseColumns, ...actionCols].map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
  }, [baseColumns, actionCols]);

  const expandedRowRender = (record, index) =>
    <RelationshipDetailTable relatedDetails={record.relatedDetail} key={index} />;

  return (
    <div className="flex flex-col gap-y-4">
      <Toolbar items={itemActions} type="detail" />
      <NxTable
        idTable="relationship-table"
        dataSource={dataSource}
        totalData={totalElement}
        current={page}
        tableScrolled={{ x: dataSource.length ? "max-content" : 1390 }}
        onSort={onSort}
        columns={columns}
        usePagination={false}
        useInfiniteScroll={true}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
        loadMoreThreshold={20}
        loading={loading}
        expandable={{ expandedRowRender }}
      />
    </div>
  );
};

export default RelationshipTable;
