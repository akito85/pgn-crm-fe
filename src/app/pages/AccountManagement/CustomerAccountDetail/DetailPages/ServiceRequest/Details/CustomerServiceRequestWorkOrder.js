import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Spin, Tooltip } from "antd";
import NxTable from "../../../../../../../components/Nx/NxTable";
import NxDate from "../../../../../../../components/Nx/NxDatePicker";
import NxBaseContainer from "../../../../../../../components/Nx/NxBaseContainer";
import NxHistoryModal from "../../../../../../../components/Nx/NxHistoryModal";
import StatusComponent from "../../../../../../../components/StatusComponent";
import SVGIcon from "../../../../../../../assets/Icon/index";
import WorkOrderApprovalModal from "../../../../WorkOrder/WorkOrderApprovalModal";
import {
  getWorkOrders,
  getWoApprovalHistory,
} from "../../../../../../../redux/slices/account_management/detailAccount/WorkOrderSlice";
import useWoNavigation from "../../../../shared/WorkOrder/hooks/useWoNavigation";
import { nxGetAccountActions } from "../../../../../../../components/Nx/NxGetAccountActions";
import { useColumnActionPermission } from "../../../../../../../components/ColumnActionPermission";
import Toolbar from "../../../../../../../components/Toolbar";
import NotFound from "../../../../../../NotFound";
import useWoGrantedAccess from "../../../../shared/WorkOrder/hooks/useWoGrantedAccess";

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
    title: "STATUS", dataIndex: "status", width: 120, sorter: false, filter: false,fixed: "right",
    render: (v) => v ? (
      <div className="flex justify-center">
        <StatusComponent colour={(v || "").toLowerCase()} margin={false} size="small">
          {(v || "").replace(/_/g, " ")}
        </StatusComponent>
      </div>
    ) : "-",
  },
  {
    title: "APPROVAL STATUS", dataIndex: "approvalStatus", width: 120, sorter: false, filter: false,fixed: "right",
    render: (v) => v ? (
      <div className="flex justify-center">
        <StatusComponent colour={(v || "").toLowerCase()} margin={false} size="small">
          {(v || "").replace(/_/g, " ")}
        </StatusComponent>
      </div>
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
  const { isAccessChecked, isGranted } = useWoGrantedAccess({
    entryPoint: "sr-under-account",
    accountType,
  });
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [page, setPage] = useState(1);
  const [loadMoreSize] = useState(50);

  const { list_workOrders, loading_listWo, pagination_listWo, detail_woApprovalHistory } = useSelector(
    (state) => state.workOrder
  );

  const woNavContext = {
    accountId: idAccount,
    srId: id,
    entryPoint: "sr-under-account",
    source: "SERVICE_REQUEST",
    sourceId: id,
    sourceReference: [data_detail?.requestNumber, data_detail?.requestSubCategoryName]
      .filter(Boolean)
      .join(" - "),
    idCustomer,
    accountType,
  };
  const { goToCreate, goToView, goToUpdate } = useWoNavigation(woNavContext);

  const fetchList = (pg = 1, isLoadMore = false) => {
    if (id && idAccount) {
      dispatch(getWorkOrders({
        accountId: idAccount,
        body: {
          page: pg,
          size: loadMoreSize,
          filters: [],
          filterRules: [],
          searchs: {
            source: "SERVICE_REQUEST",
            sourceId: String(id),
          },
        },
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
    if (nextPage <= (pagination_listWo.totalPage || 0)) {
      fetchList(nextPage, true);
      setPage(nextPage);
    }
  };

  const hasMore = list_workOrders.length < (pagination_listWo.totalElement || 0);

  const itemActions = nxGetAccountActions({
    handleCreate: () => {
      goToCreate();
    },
    handleView: (record) => {
      goToView(record.id)
    },
    handleUpdate: (record) => {
      goToUpdate(record.id)
    },
    handleApprovalHistory: (record) => {
      dispatch(getWoApprovalHistory(record.id));
      setShowHistoryModal(true);
    },
    handleApproval: () => setShowApprovalModal(true),

  });

  const actionCols = useColumnActionPermission(
    ["View","Update","History"],
    itemActions,
    "View",
    "table"
  ).map((col) => ({
    ...col,
    width: 100,
    align: "center",
  }))

  const columnsWithAction = useMemo(
    () => [...COLUMNS, ...actionCols],
    [COLUMNS, actionCols]
  )

  

  if (!isAccessChecked) {
    return (
      <div className="w-full flex justify-center py-10">
        <Spin tip="Checking access..." />
      </div>
    );
  }

  if (!isGranted) {
    return <NotFound type="unauthorized" />;
  }

  return (
    <>
      <NxBaseContainer border>
        {/* Toolbar */}
        <Toolbar items={itemActions} type="detail" />

        <NxTable
          idTable="sr-workorder-table"
          dataSource={list_workOrders.map((item, i) => ({ ...item, key: item.id ?? i }))}
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
          loading={loading_listWo}
          onSort={onSort}
        />
      </NxBaseContainer>

      <WorkOrderApprovalModal
        isOpen={showApprovalModal}
        accountId={idAccount}
        srId={id}
        handleCancel={() => setShowApprovalModal(false)}
        afterFinish={() => fetchList(1, false)}
      />

      <NxHistoryModal
        isOpen={showHistoryModal}
        handleClose={() => setShowHistoryModal(false)}
        header="Approval History"
        dataApprover={detail_woApprovalHistory?.dataApprover}
        dataHistory={detail_woApprovalHistory?.dataHistory}
      />
    </>
  );
};

export default CustomerServiceRequestWorkOrder;
