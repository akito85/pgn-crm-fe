import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import NxTable from "../../../../../../../components/Nx/NxTable";
import NxDate from "../../../../../../../components/Nx/NxDatePicker";
import StatusComponent from "../../../../../../../components/StatusComponent";
import { getSrWorkOrders } from "../../../../../../../redux/slices/account_management/detailAccount/ServiceRequestSlice";

const COLUMNS = [
  { title: "NO", width: 60, align: "center", render: (_, __, i) => i + 1 },
  {
    title: "WORK ORDER NUMBER",
    dataIndex: "workOrderNumber",
    width: 180,
    sorter: true,
    filter: true,
    render: (v) => v || "-",
  },
  {
    title: "TYPE",
    dataIndex: "workOrderTypeName",
    width: 140,
    sorter: true,
    filter: true,
    render: (v) => v || "-",
  },
  {
    title: "CATEGORY",
    dataIndex: "workOrderCategoryName",
    width: 140,
    sorter: true,
    filter: true,
    render: (v) => v || "-",
  },
  {
    title: "OPEN DATE",
    dataIndex: "planStartDate",
    width: 140,
    sorter: true,
    filter: true,
    render: (v) => v ? NxDate.formatDate(v, "DD MMM YYYY") : "-",
  },
  {
    title: "CLOSED DATE",
    dataIndex: "actualEndDate",
    width: 140,
    sorter: true,
    filter: true,
    render: (v) => v ? NxDate.formatDate(v, "DD MMM YYYY") : "-",
  },
  {
    title: "COMPLETION PLAN DATE",
    dataIndex: "planEndDate",
    width: 180,
    sorter: true,
    filter: true,
    render: (v) => v ? NxDate.formatDate(v, "DD MMM YYYY") : "-",
  },
  {
    title: "COMPLETION ACTUAL DATE",
    dataIndex: "actualEndDate",
    width: 180,
    sorter: true,
    filter: true,
    render: (v) => v ? NxDate.formatDate(v, "DD MMM YYYY") : "-",
  },
  {
    title: "COMPLETION REMARK",
    dataIndex: "workOrderDescription",
    width: 220,
    sorter: true,
    filter: true,
    render: (v) => v || "-",
  },
  {
    title: "STATUS",
    dataIndex: "workOrderStatus",
    width: 120,
    sorter: true,
    filter: true,
    render: (v) => v ? (
      <StatusComponent colour={(v || "").toLowerCase()} margin={false}>
        {(v || "").replace(/_/g, " ")}
      </StatusComponent>
    ) : "-",
  },
];

const CustomerServiceRequestWorkOrder = ({
  id,
  idAccount,
  onSort = () => {},
}) => {
  const dispatch = useDispatch();

  const { list_srWorkOrders, loading_listSrWorkOrders } = useSelector(
    (state) => state.serviceRequest
  );

  useEffect(() => {
    if (id && idAccount) {
      dispatch(getSrWorkOrders({ accountId: idAccount, srId: id }));
    }
  }, [dispatch, id, idAccount]);

  const raw = list_srWorkOrders;
  const items = Array.isArray(raw?.result)
    ? raw.result
    : Array.isArray(raw?.data)
    ? raw.data
    : Array.isArray(raw)
    ? raw
    : [];

  return (
    <NxTable
      idTable="sr-workorder-table"
      dataSource={items.map((item, i) => ({ ...item, key: item.id ?? i }))}
      columns={COLUMNS}
      usePagination={false}
      useInfiniteScroll={true}
      hasMore={false}
      showAdvanceSearch={false}
      showSearchBar={false}
      fontSize="small"
      tablePadding="small"
      tableScrolled={{ x: "max-content" }}
      loading={loading_listSrWorkOrders}
      onSort={onSort}
    />
  );
};

export default CustomerServiceRequestWorkOrder;
