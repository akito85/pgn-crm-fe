import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import NxTable from "../../../../../../../components/Nx/NxTable";
import NxDate from "../../../../../../../components/Nx/NxDatePicker";
import NxBaseContainer from "../../../../../../../components/Nx/NxBaseContainer";
import StatusComponent from "../../../../../../../components/StatusComponent";
import SVGIcon from "../../../../../../../assets/Icon/index";
import WorkOrderApprovalModal from "../../../../WorkOrder/WorkOrderApprovalModal";
import {
  getWoSrList,
} from "../../../../../../../redux/slices/account_management/detailAccount/WorkOrderSlice";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../../routes/account_management/customer_account_routes";

const COLUMNS = [
  { title: "NO", width: 60, align: "center", render: (_, __, i) => i + 1 },
  { title: "WORK ORDER NUMBER",    dataIndex: "woNumber",        width: 180, sorter: true, filter: true, render: (v) => v || "-" },
  { title: "TYPE",                 dataIndex: "woTypeName",      width: 140, sorter: true, filter: true, render: (v) => v || "-" },
  { title: "CATEGORY",             dataIndex: "woCategoryName",  width: 140, sorter: true, filter: true, render: (v) => v || "-" },
  { title: "OPEN DATE",            dataIndex: "planStartDate",   width: 140, sorter: true, filter: true, render: (v) => v ? NxDate.formatDate(v, "DD MMM YYYY") : "-" },
  { title: "CLOSED DATE",          dataIndex: "actualEndDate",   width: 140, sorter: true, filter: true, render: (v) => v ? NxDate.formatDate(v, "DD MMM YYYY") : "-" },
  { title: "COMPLETION PLAN DATE", dataIndex: "planEndDate",     width: 180, sorter: true, filter: true, render: (v) => v ? NxDate.formatDate(v, "DD MMM YYYY") : "-" },
  { title: "COMPLETION REMARK",    dataIndex: "description",     width: 220, sorter: true, filter: true, render: (v) => v || "-" },
  {
    title: "STATUS", dataIndex: "status", width: 120, sorter: true, filter: true,
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
  idCustomer,
  accountType,
  data_detail,
  onSort = () => {},
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [page, setPage] = useState(1);
  const [loadMoreSize] = useState(50);

  const { list_woSrWorkOrders, loading_listWoSrWorkOrders, pagination_woSrWorkOrders } = useSelector(
    (state) => state.workOrder
  );

  const fetchList = (pg = 1, isLoadMore = false) => {
    if (id && idAccount) {
      dispatch(getWoSrList({
        accountId: idAccount,
        srId: id,
        body: { page: pg, size: loadMoreSize, filters: [], filterRules: [] },
        isLoadMore,
      }));
    }
  };

  useEffect(() => {
    fetchList(1, false);
    setPage(1);
  }, [dispatch, id, idAccount]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    if (nextPage <= (pagination_woSrWorkOrders.totalPage || 0)) {
      fetchList(nextPage, true);
      setPage(nextPage);
    }
  };

  const hasMore = list_woSrWorkOrders.length < (pagination_woSrWorkOrders.totalElement || 0);

  const handleCreate = () => {
    navigate(ACCOUNT_MANAGEMENT_ROUTES.CREATE_SR_WORK_ORDER, {
      state: {
        woContext: {
          type: "sr",
          srId: id,
          srNumber: data_detail?.requestNumber || data_detail?.woNumber || "",
          srCategory: data_detail?.requestCategory || data_detail?.category || "",
          idAccount,
          idCustomer,
          accountType,
          isUpdate: false,
          woId: null,
        },
      },
    });
  };

  const columnsWithAction = [
    ...COLUMNS,
    {
      title: "ACTION",
      align: "center",
      width: 120,
      fixed: "right",
      render: (_, record) => (
        <div className="flex justify-center gap-2">
          <Button
            size="small"
            type="menu"
            onClick={() =>
              navigate(ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_WORK_ORDER, {
                state: { woId: record.id, idAccount, idCustomer, accountType },
              })
            }
          >
            View
          </Button>
          <Button
            size="small"
            type="secondary"
            onClick={() =>
              navigate(ACCOUNT_MANAGEMENT_ROUTES.UPDATE_SR_WORK_ORDER, {
                state: {
                  woContext: {
                    type: "sr",
                    srId: id,
                    srNumber: data_detail?.requestNumber || "",
                    srCategory: data_detail?.requestCategory || "",
                    idAccount,
                    idCustomer,
                    accountType,
                    isUpdate: true,
                    woId: record.id,
                  },
                },
              })
            }
          >
            Edit
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <NxBaseContainer border>
        {/* Toolbar */}
        <div className="flex justify-end gap-2 mb-3">
          <Button type="menu" icon={<SVGIcon name="IconButtonDownload" width={14} />}>
            Download List
          </Button>
          <Button
            type="secondary"
            onClick={() => setShowApprovalModal(true)}
            icon={<SVGIcon name="IconButtonApproval" width={14} />}
          >
            Approval
          </Button>
          <Button
            type="submit"
            onClick={handleCreate}
            icon={<SVGIcon name="IconButtonCreate" width={14} />}
          >
            Create
          </Button>
        </div>

        <NxTable
          idTable="sr-workorder-table"
          dataSource={list_woSrWorkOrders.map((item, i) => ({ ...item, key: item.id ?? i }))}
          columns={columnsWithAction}
          usePagination={false}
          useInfiniteScroll={true}
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
          showAdvanceSearch={false}
          showSearchBar={false}
          fontSize="small"
          tablePadding="small"
          tableScrolled={{ x: "max-content" }}
          loading={loading_listWoSrWorkOrders}
          onSort={onSort}
        />
      </NxBaseContainer>

      <WorkOrderApprovalModal
        isOpen={showApprovalModal}
        accountId={idAccount}
        handleCancel={() => setShowApprovalModal(false)}
        afterFinish={() => fetchList(1, false)}
      />
    </>
  );
};

export default CustomerServiceRequestWorkOrder;
