import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setData } from "../../../../../../redux/slices/data_slice";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../routes/account_management/customer_account_routes";
import { useColumnActionPermission } from "../../../../../../components/ColumnActionPermission";
import Toolbar from "../../../../../../components/Toolbar";
import NxTable from "../../../../../../components/Nx/NxTable";
import { useMemo, useState } from "react";
import { getServiceRequestColumns } from "./getServiceRequestColumns";
import { nxGetAccountActions } from "../../../../../../components/Nx/NxGetAccountActions";
import { nxApplyFixedColumns } from "../../../../../../utils/Nx/nxApplyFixedColumns";

const ServiceRequestTable = ({
  data = [],
  idAccount = 0,
  idCustomer = 0,
  totalElement = 0,
  page = 1,
  onSort = () => {},
  handleApproval = () => {},
  handleDownload = () => {},
  handleLoadMore = () => {},
  hasMore = false,
  searchText = "",
  search = {},
  searchedColumn = "",
  searchInput = null,
  handleSearch = () => {},
  loading = false,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const itemActions = nxGetAccountActions({
    idAccount,
    idCustomer,
    handleCreate: () => {
      dispatch(
        setData({
          key: "serviceRequestCreation",
          data: { idAccount, idCustomer, type: "standard" },
        })
      );
      navigate(ACCOUNT_MANAGEMENT_ROUTES.CREATE_SERVICE_REQUEST, {
        state: {
          idAccount,
          idCustomer,
          type: "standard",
        },
      });
    },
    updateRoute: ACCOUNT_MANAGEMENT_ROUTES.UPDATE_SERVICE_REQUEST,
    detailRoute: ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_SERVICE_REQUEST,
    navigate,
    handleApproval,
    handleDownload,
  });

  const [fixedColumns, setFixedColumns] = useState(() => ({
    right: ["statusApproval", "statusPrerequisite", "status", "action"],
    left: [],
  }));

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
      getServiceRequestColumns(
        search,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    [search, searchText, searchedColumn]
  );

  const allColumns = useMemo(() => {
    const columnsWithKeys = [...baseColumns, ...actionCols].map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
    return columnsWithKeys;
  }, [baseColumns, actionCols]);

  const processedColumns = useMemo(() => {
    return nxApplyFixedColumns(allColumns, fixedColumns);
  }, [allColumns, fixedColumns]);

  const columnDefinitions = useMemo(() => {
    return allColumns.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [allColumns]);

  return (
    <div className="flex flex-col gap-y-4">
      <Toolbar items={itemActions} type="detail" />
      <NxTable
        idTable="service-request-table"
        dataSource={data}
        totalData={totalElement}
        current={page}
        tableScrolled={{ y: 400, x: "max-content" }}
        onSort={onSort}
        columns={processedColumns}
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

export default ServiceRequestTable;
