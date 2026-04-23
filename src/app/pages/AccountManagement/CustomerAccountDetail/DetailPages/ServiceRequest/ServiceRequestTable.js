import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useMemo, useState, useRef, useEffect } from "react";

import { setData } from "../../../../../../redux/slices/data_slice";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../routes/account_management/customer_account_routes";
import { getServiceRequests } from "../../../../../../redux/slices/account_management/detailAccount/ServiceRequestSlice";
import { useColumnActionPermission } from "../../../../../../components/ColumnActionPermission";
import Toolbar from "../../../../../../components/Toolbar";
import NxTable from "../../../../../../components/Nx/NxTable";
import { getServiceRequestColumns } from "./getServiceRequestColumns";
import { nxGetAccountActions } from "../../../../../../components/Nx/NxGetAccountActions";

/**
 * Service request list table (container + presentational component).
 * Owns search, pagination, sort, and download state/logic.
 * The parent (`ServiceRequest`) is responsible for access checks, layout, and modals.
 *
 * @param {object}   props
 * @param {number}   props.idAccount         - Account ID
 * @param {number}   props.idCustomer        - Customer ID
 * @param {Function} [props.handleApproval]  - Triggers the approval action
 * @param {number}   [props.refreshSignal=0] - Increment to trigger a page-1 refresh from the parent
 */
const ServiceRequestTable = ({
  idAccount = 0,
  idCustomer = 0,
  handleApproval = () => {},
  refreshSignal = 0,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { list_serviceRequest, pagination_listSr, loading_listSr } = useSelector(
    (state) => state.serviceRequest
  );

  // --- Derived values ---
  const currentData = useMemo(() => {
    if (!Array.isArray(list_serviceRequest)) return [];
    return list_serviceRequest.map((item, index) => ({
      ...item,
      key: `${item.id ?? "sr"}-${index}`,
    }));
  }, [list_serviceRequest]);

  const totalElement = pagination_listSr?.totalElement || 0;
  const hasMore = currentData.length < totalElement;

  // --- State ---
  const searchInput = useRef(null);
  const [page, setPage] = useState(1);
  const [loadMoreSize] = useState(20);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [filters, setFilters] = useState([]);
  const [filterRules, setFilterRules] = useState([]);

  // --- Handlers ---
  const handleRefresh = () => {
    dispatch(
      getServiceRequests({
        idAccount,
        body: { page: 1, size: loadMoreSize, sort, searchs: search, filters, filterRules },
        isLoadMore: false,
      })
    );
    setPage(1);
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) setPage(1);
      return { ...prevState, [dataIndex]: selectedKeys[0] };
    });
  };

  const onSort = (_, __, sort) => {
    const dataSort = sort.order
      ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
      : "";
    setSort(dataSort);
  };

  const handleLoadMore = async () => {
    const nextPage = page + 1;
    const totalPage = pagination_listSr?.totalPage || 0;
    if (nextPage <= totalPage) {
      await dispatch(
        getServiceRequests({
          idAccount,
          body: { page: nextPage, size: loadMoreSize, sort, searchs: search, filters, filterRules },
          isLoadMore: true,
        })
      ).unwrap();
      setPage(nextPage);
    }
  };

  const handleDownload = () => {
    // TODO: Implement download functionality
    console.log("Download service requests");
  };

  // --- Effects ---
  // Re-fetch page 1 whenever sort or search changes.
  useEffect(() => {
    dispatch(
      getServiceRequests({
        idAccount,
        body: { page: 1, size: loadMoreSize, sort, searchs: search, filters, filterRules },
        isLoadMore: false,
      })
    );
    setPage(1);
  }, [sort, search, filters, filterRules]); // eslint-disable-line react-hooks/exhaustive-deps

  // Trigger a page-1 refresh when the parent signals it (e.g. after approval).
  useEffect(() => {
    if (refreshSignal > 0) handleRefresh();
  }, [refreshSignal]);

  // --- Column configuration ---
  const itemActions = nxGetAccountActions({
    handleCreate: () => {
      dispatch(
        setData({
          key: "serviceRequestCreation",
          data: { idAccount, idCustomer, type: "standard" },
        })
      );
      navigate(ACCOUNT_MANAGEMENT_ROUTES.CREATE_SERVICE_REQUEST, {
        state: { idAccount, idCustomer, type: "standard" },
      });
    },
    handleView: (record) => {
      navigate(ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_SERVICE_REQUEST, {
        state: { id: record?.id, idAccount, idCustomer, type: "standard" },
      });
    },
    handleUpdate: (record) => {
      navigate(ACCOUNT_MANAGEMENT_ROUTES.UPDATE_SERVICE_REQUEST, {
        state: { id: record?.id, idAccount, idCustomer, type: "update" },
      });
    },
    handleApproval,
    handleDownload,
  });

  const actionCols = useColumnActionPermission(
    ["View", "Update"],
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
      getServiceRequestColumns({
        search,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      }),
    [search, searchText, searchedColumn]
  );

  const columns = useMemo(
    () => [...baseColumns, ...actionCols],
    [baseColumns, actionCols]
  );

  return (
    <div className="flex flex-col gap-y-4">
      <Toolbar items={itemActions} type="detail" />
      <NxTable
        idTable="service-request-table"
        dataSource={currentData}
        totalData={totalElement}
        current={page}
        tableScrolled={{ y: 400, x: "max-content" }}
        onSort={onSort}
        columns={columns}
        usePagination={false}
        useInfiniteScroll={true}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
        loadMoreThreshold={20}
        loading={loading_listSr}
      />
    </div>
  );
};

export default ServiceRequestTable;
