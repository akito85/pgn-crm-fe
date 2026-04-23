import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import NxTable from "../../../../../../../components/Nx/NxTable";
import NxDate from "../../../../../../../components/Nx/NxDatePicker";
import StatusComponent from "../../../../../../../components/StatusComponent";
import { getSrPrerequisites } from "../../../../../../../redux/slices/account_management/detailAccount/ServiceRequestSlice";

const COLUMNS = [
  { title: "NO", width: 60, align: "center", render: (_, __, i) => i + 1 },
  {
    title: "TYPE",
    dataIndex: "prerequisiteTypeName",
    width: 160,
    sorter: true,
    filter: true,
    render: (v) => v || "-",
  },
  {
    title: "PRE-REQUISITE NAME",
    dataIndex: "prerequisiteName",
    width: 220,
    sorter: true,
    filter: true,
    render: (v) => v || "-",
  },
  {
    title: "COMPLETION DATE",
    dataIndex: "completedDate",
    width: 160,
    sorter: true,
    filter: true,
    render: (v) => v ? NxDate.formatDate(v, "DD MMM YYYY") : "-",
  },
  {
    title: "REFERENCE",
    dataIndex: "prerequisiteValue",
    width: 160,
    sorter: true,
    filter: true,
    render: (v) => v || "-",
  },
  {
    title: "DESCRIPTION",
    dataIndex: "prerequisiteComments",
    width: 220,
    sorter: true,
    filter: true,
    render: (v, r) => v || r?.prerequisiteDesc || "-",
  },
  {
    title: "STATUS",
    dataIndex: "prerequisiteStatus",
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

const CustomerServiceRequestPreRequisite = ({
  id,
  idAccount,
  onSort = () => {},
}) => {
  const dispatch = useDispatch();

  const { list_srPrerequisites, loading_listSrPrerequisites } = useSelector(
    (state) => state.serviceRequest
  );

  useEffect(() => {
    if (id && idAccount) {
      dispatch(getSrPrerequisites({ accountId: idAccount, srId: id }));
    }
  }, [dispatch, id, idAccount]);

  const raw = list_srPrerequisites;
  const items = Array.isArray(raw?.result)
    ? raw.result
    : Array.isArray(raw?.data)
    ? raw.data
    : Array.isArray(raw)
    ? raw
    : [];

  return (
    <NxTable
      idTable="sr-prerequisite-table"
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
      loading={loading_listSrPrerequisites}
      onSort={onSort}
    />
  );
};

export default CustomerServiceRequestPreRequisite;
