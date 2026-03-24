import { useNavigate, useLocation } from "react-router-dom";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../../routes/account_management/customer_account_routes";
import { useColumnActionPermission } from "../../../../../../../components/ColumnActionPermission";
import Toolbar from "../../../../../../../components/Toolbar";
import NxTable from "../../../../../../../components/Nx/NxTable";
import { useMemo, useState, useRef, useEffect } from "react";
import { getPaymentRelationColumns } from "./getPaymentRelationColumns";
import { nxGetAccountActions } from "../../../../../../../components/Nx/NxGetAccountActions";
import { nxApplyFixedColumns } from "../../../../../../../utils/Nx/nxApplyFixedColumns";
import { useDispatch, useSelector } from "react-redux";
import {
  getPaymentRelation,
  downloadPaymentRelation,
} from "../../../../../../../redux/slices/account_management/detailAccount/PaymentRelationSlice";

const PaymentRelationTable = ({
  idAccount = 0,
  idCustomer = 0,
  handleInactivateModal = () => {},
  handleApprovalHistoryModal = () => {},
  handleApproval = () => {},
  refreshSignal = 0,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const {
    list_paymentRelation: dataSource,
    pagination_paymentRelation: pagination,
    loading_listPr: loading,
  } = useSelector((state) => state.paymentRelation);

  const isStandard = location.pathname.includes("account-standard");
  const isOneTime = location.pathname.includes("account-onetime");

  const totalElement = pagination.totalElements;
  const hasMore = dataSource.length < (totalElement || 0);

  const searchInput = useRef(null);
  const [page, setPage] = useState(0);
  const [loadMoreSize] = useState(20);
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState([]);
  const [filterRules, setFilterRules] = useState([]);

  const [fixedColumns, setFixedColumns] = useState(() => ({
    right: ["statusApproval", "status", "action"],
    left: [],
  }));

  const handleRefresh = () => {
    const body = { page: 0, size: loadMoreSize, sort, searchs: search, filters, filterRules };
    dispatch(getPaymentRelation({ id: idAccount, body, isLoadMore: false }));
    setPage(0);
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch((prev) => {
      if (prev[dataIndex] !== selectedKeys[0]) setPage(0);
      return { ...prev, [dataIndex]: selectedKeys[0] };
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
    const totalPages = pagination.totalPages || 0;
    if (nextPage <= totalPages) {
      const body = { page: nextPage, size: loadMoreSize, sort, searchs: search, filters, filterRules };
      await dispatch(getPaymentRelation({ id: idAccount, body, isLoadMore: true })).unwrap();
    }
    setPage(nextPage);
  };

  const handleDownload = () => {
    const body = { sort, searchs: search, filters, filterRules };
    dispatch(downloadPaymentRelation({ body, id: idAccount }));
  };

  useEffect(() => {
    const body = { page: 0, size: loadMoreSize, sort, searchs: search, filters, filterRules };
    setPage(0);
    dispatch(getPaymentRelation({ id: idAccount, body, isLoadMore: false }));
  }, [sort, search, filters, filterRules]);

  useEffect(() => {
    if (refreshSignal > 0) handleRefresh();
  }, [refreshSignal]);

  const itemActions = nxGetAccountActions({
    handleView: ({ id }) =>
      navigate(
        isStandard
          ? ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_PAYMENT_RELATION
          : isOneTime
            ? ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_PAYMENT_RELATION_ONETIME
            : "",
        { state: { idAccount, idCustomer, id } }
      ),
    handleCreate: () =>
      navigate(
        isStandard
          ? ACCOUNT_MANAGEMENT_ROUTES.CREATE_PAYMENT_RELATION
          : isOneTime
            ? ACCOUNT_MANAGEMENT_ROUTES.CREATE_PAYMENT_RELATION_ONETIME
            : "",
        { state: { idAccount, idCustomer } }
      ),
    handleUpdate: ({ id }) =>
      navigate(
        isStandard
          ? ACCOUNT_MANAGEMENT_ROUTES.UPDATE_PAYMENT_RELATION
          : isOneTime
            ? ACCOUNT_MANAGEMENT_ROUTES.UPDATE_PAYMENT_RELATION_ONETIME
            : "",
        { state: { idAccount, idCustomer, id } }
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
    () => getPaymentRelationColumns(search, searchInput, searchedColumn, searchText, handleSearch),
    [search, searchInput, searchText, searchedColumn]
  );

  const columnDefinitions = useMemo(() => [...baseColumns, ...actionCols], [baseColumns, actionCols]);

  const columns = useMemo(() => nxApplyFixedColumns(columnDefinitions, fixedColumns), [columnDefinitions, fixedColumns]);

  return (
    <div className="flex flex-col gap-y-4">
      <Toolbar items={itemActions} type="detail" />
      <NxTable
        idTable="payment-relation-table"
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

export default PaymentRelationTable;
