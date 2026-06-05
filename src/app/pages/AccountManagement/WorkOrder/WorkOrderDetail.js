import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Spin } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import NxBaseContainer from "../../../../components/Nx/NxBaseContainer";
import NxDetailText from "../../../../components/Nx/NxDetailText";
import NxTable from "../../../../components/Nx/NxTable";
import NxDate from "../../../../components/Nx/NxDatePicker";
import NxBreadCrumb from "../../../../components/Nx/NxBreadCrumb";
import NxTabs from "../../../../components/Nx/NxTabs";
import NxAttachmentInput from "../../../../components/Nx/NxAttachmentInput";
import HeaderDetail from "../CustomerAccountDetail/HeaderDetail";
import StatusComponent from "../../../../components/StatusComponent";
import WoStatusUpdateModal from "./WoStatusUpdateModal";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../routes/account_management/customer_account_routes";
import useWoContext from "../shared/WorkOrder/hooks/useWoContext";
import useWoNavigation from "../shared/WorkOrder/hooks/useWoNavigation";
import {
  getWorkOrder,
  getWoActivities,
  getWoDataRequirements,
  getWoAttachments,
  getWoProgress,
  updateWoStatus,
  clearWoActivities,
  clearWoDataRequirements,
} from "../../../../redux/slices/account_management/detailAccount/WorkOrderSlice";
import { getAccountStandardDetail, getAccountOneTimeDetail } from "../../../../redux/slices/account_management/accountManagement";

const ACTIVITY_COLUMNS = [
  { title: "NO",            width: 60,  align: "center", render: (_, __, i) => i + 1 },
  { title: "ACTIVITY NAME", dataIndex: "woActName",       width: 180, render: (v) => v || "-" },
  { title: "PIC POSITION",  dataIndex: "picPositionName", width: 160, render: (v) => v || "-" },
  { title: "PIC USER",      dataIndex: "picUserName",     width: 160, render: (v) => v || "-" },
  { title: "PLAN DATE",     dataIndex: "planDate",        width: 130, render: (v) => v ? NxDate.formatDate(v, "DD MMM YYYY") : "-" },
  { title: "STATUS",        dataIndex: "activityStatus",  width: 120, render: (v) => v ? (
      <div className="flex justify-center">
        <StatusComponent colour={(v || "").toLowerCase()} margin={false} size="small">
          {(v || "").replace(/_/g, " ")}
        </StatusComponent>
      </div>
    ) : "-", },
  { title: "DESCRIPTION",   dataIndex: "woActDesc",       width: 200, render: (v) => v || "-" },
];

const DATA_REQ_COLUMNS = [
  { title: "NO",    width: 60,  align: "center", render: (_, __, i) => i + 1 },
  { title: "TYPE",  dataIndex: "type",  width: 180, render: (v) => v || "-" },
  { title: "VALUE", dataIndex: "value", render: (v) => v || "-" },
];

const PROGRESS_COLUMNS = [
  { title: "NO",           width: 60,  align: "center", render: (_, __, i) => i + 1 },
  { title: "FROM STATUS",  dataIndex: "fromStatus",      width: 140, render: (v) => v || "(initial)" },
  { title: "TO STATUS",    dataIndex: "toStatus",        width: 140, render: (v) => v || "-" },
  { title: "REMARK",       dataIndex: "remark",          render: (v) => v || "-" },
  { title: "CHANGED BY",   dataIndex: "changedBy",       width: 160, render: (v) => v || "-" },
  { title: "CHANGED DATE", dataIndex: "changedDate",     width: 180, render: (v) => v ? NxDate.formatDate(v, "DD MMM YYYY HH:mm") : "-" },
  { title: "DURATION (s)", dataIndex: "durationSeconds", width: 130, render: (v) => v ?? "-" },
];

const PAGE_SIZE = 50;

const WorkOrderDetail = () => {
  const dispatch = useDispatch();
  const woContext = useWoContext();
  const { goBack, goToUpdate } = useWoNavigation(woContext);

  const {
    detail_workOrder,
    loading_detailWo,
    list_woActivities,
    loading_listWoActivities,
    pagination_woActivities,
    list_woDataRequirements,
    loading_listWoDataRequirements,
    list_woAttachments,
    loading_listWoAttachments,
    list_woProgress,
    loading_woProgress,
    loading_statusUpdateWo,
    list_woApprovalHierarchy,
  } = useSelector((state) => state.workOrder);
  const { loading: loadingAccount } = useSelector((state) => state.accountManagement);

  const isLoading = loading_detailWo || loadingAccount;

  const [activeTab, setActiveTab] = useState("info");
  const [activityPage, setActivityPage] = useState(1);
  const [statusModal, setStatusModal] = useState({ open: false, toStatus: null });

  const openStatusModal = (toStatus) => setStatusModal({ open: true, toStatus });
  const closeStatusModal = () => setStatusModal({ open: false, toStatus: null });

  useEffect(() => {
    if (woContext.woId) {
      dispatch(clearWoActivities());
      dispatch(clearWoDataRequirements());
      dispatch(getWorkOrder({ woId: woContext.woId, accountId: woContext.accountId }));
      dispatch(getWoActivities({ woId: woContext.woId, body: { page: 1, size: PAGE_SIZE, filters: [], filterRules: [] }, isLoadMore: false }));
      dispatch(getWoDataRequirements({ woId: woContext.woId, body: { page: 1, size: 100, filters: [], filterRules: [] }, isLoadMore: false }));
      dispatch(getWoAttachments({ accountId: woContext.accountId, woId: woContext.woId }));
      dispatch(getWoProgress(woContext.woId));
      setActivityPage(1);
    }
  }, [dispatch, woContext.woId, woContext.accountId]);

  useEffect(() => {
    if (woContext.accountId && woContext.accountType) {
      if (woContext.accountType === "standard") {
        dispatch(getAccountStandardDetail({ idCustomer: woContext.idCustomer, idAccount: woContext.accountId }));
      } else {
        dispatch(getAccountOneTimeDetail({ idCustomer: woContext.idCustomer, idAccount: woContext.accountId }));
      }
    }
  }, [dispatch, woContext.accountId, woContext.idCustomer, woContext.accountType]);

  const hasMoreActivities = list_woActivities.length < (pagination_woActivities.totalElement || 0);

  const handleLoadMoreActivities = () => {
    const nextPage = activityPage + 1;
    if (nextPage <= (pagination_woActivities.totalPage || 0)) {
      dispatch(getWoActivities({ woId: woContext.woId, body: { page: nextPage, size: PAGE_SIZE, filters: [], filterRules: [] }, isLoadMore: true }));
      setActivityPage(nextPage);
    }
  };

  const wo = detail_workOrder;
  const status = (wo?.status || "").toUpperCase();
  const prevStatus = (wo?.previousStatus || "").toUpperCase();
  const approvalStatus = (wo?.approvalStatus || "").toUpperCase();

  const handleStatusSubmit = ({ toStatus, remark, cancelApphierId }) => {
    dispatch(updateWoStatus({ accountId: woContext.accountId, woId: woContext.woId, toStatus, remark, cancelApphierId }))
      .unwrap()
      .then(() => {
        closeStatusModal();
        dispatch(getWorkOrder({ woId: woContext.woId, accountId: woContext.accountId }));
        dispatch(getWoProgress(woContext.woId));
      })
      .catch(() => {});
  };

  const renderStatusButtons = () => {
    if (!wo) return null;

    const btnInProgress = (
      <Button type="secondary" onClick={() => openStatusModal("IN_PROGRESS")}>Mark as In Progress</Button>
    );
    const btnOnHold = (
      <Button type="secondary" onClick={() => openStatusModal("ON_HOLD")}>Mark as On Hold</Button>
    );
    const btnOpen = (
      <Button type="secondary" onClick={() => openStatusModal("OPEN")}>Mark as Open</Button>
    );
    const btnResolved = (
      <Button type="secondary" onClick={() => openStatusModal("RESOLVED")}>Mark as Resolved</Button>
    );
    const btnClosed = (
      <Button type="submit" onClick={() => openStatusModal("CLOSED")}>Mark as Closed</Button>
    );
    const btnCancel = (
      <Button type="reject" onClick={() => openStatusModal("CANCELLED")}>Cancel WO</Button>
    );
    const btnEdit = (
      <Button
        type="submit"
        onClick={() => goToUpdate(woContext.woId)}
      >
        Edit
      </Button>
    );

    switch (status) {
      case "DRAFT":      return <>{btnEdit}</>;
      case "SUBMITTED":  return null;
      case "OPEN":       return <>{btnInProgress}{btnOnHold}{btnCancel}</>;
      case "IN_PROGRESS":return <>{btnOnHold}{btnResolved}{btnCancel}</>;
      case "ON_HOLD":
        return prevStatus === "IN_PROGRESS" ? <>{btnInProgress}{btnCancel}</> : <>{btnOpen}{btnCancel}</>;
      case "RESOLVED":   return <>{btnInProgress}{btnClosed}{btnCancel}</>;
      default:           return null;
    }
  };

  const tabItems = useMemo(() => [
    {
      key: "info",
      label: "Work Order Information",
      children: (
        <NxBaseContainer border>
          <div className="grid grid-cols-3 gap-4">
            <NxDetailText label="WO Number">{wo?.woNumber || "-"}</NxDetailText>
            <NxDetailText label="Source">{wo?.source || "-"}</NxDetailText>
            <NxDetailText label="Source Reference">{wo?.sourceNumber || "-"}</NxDetailText>
            <NxDetailText label="Category">{wo?.woCategoryName || "-"}</NxDetailText>
            <NxDetailText label="Type">{wo?.woTypeName || "-"}</NxDetailText>
            <NxDetailText label="Priority">{wo?.woPriorityName || "-"}</NxDetailText>
            <NxDetailText label="Group">{wo?.woGroupName || "-"}</NxDetailText>
            <NxDetailText label="Request Date">{wo?.requestDate ? NxDate.formatDate(wo.requestDate, "DD MMM YYYY") : "-"}</NxDetailText>
            <NxDetailText label="Plan Completion Date">{wo?.planCompletionDate ? NxDate.formatDate(wo.planCompletionDate, "DD MMM YYYY") : "-"}</NxDetailText>
            <NxDetailText label="Due Date">{wo?.dueDate ? NxDate.formatDate(wo.dueDate, "DD MMM YYYY") : "-"}</NxDetailText>
            <NxDetailText label="Status">
              {status ? (
                <StatusComponent colour={status.toLowerCase()} margin={false} size="small">
                  {status.replace(/_/g, " ")}
                </StatusComponent>
              ) : "-"}
            </NxDetailText>
            <NxDetailText label="Approval Status">
              {approvalStatus ? (
                <StatusComponent colour={approvalStatus.toLowerCase()} margin={false} size="small">
                  {approvalStatus.replace(/_/g, " ")}
                </StatusComponent>
              ) : "-"}
            </NxDetailText>
            <NxDetailText label="Age (hours)">{wo?.ageHours != null ? `${wo.ageHours} hrs` : "-"}</NxDetailText>
          </div>
          <NxDetailText label="Description" className="mt-2">{wo?.description || "-"}</NxDetailText>
        </NxBaseContainer>
      ),
    },
    {
      key: "activity",
      label: "Activity & Data",
      children: (
        <>
          <NxBaseContainer border>
            <span className="text-sm font-semibold text-gray-600 mb-2 block">Activity List</span>
            <NxTable
              idTable="wo-detail-activity-table"
              dataSource={list_woActivities.map((item, i) => ({ ...item, key: item.id ?? i }))}
              columns={ACTIVITY_COLUMNS}
              usePagination={false}
              useInfiniteScroll={true}
              onLoadMore={handleLoadMoreActivities}
              hasMore={hasMoreActivities}
              loading={loading_listWoActivities}
              showAdvanceSearch={false}
              tableScrolled={{ x: "max-content" }}
            />
          </NxBaseContainer>
          <NxBaseContainer border>
            <span className="text-sm font-semibold text-gray-600 mb-2 block">Data Requirement</span>
            <NxTable
              idTable="wo-detail-datareq-table"
              dataSource={list_woDataRequirements.map((item, i) => ({ ...item, key: item.id ?? i }))}
              columns={DATA_REQ_COLUMNS}
              usePagination={false}
              useInfiniteScroll={false}
              loading={loading_listWoDataRequirements}
              showAdvanceSearch={false}
              tableScrolled={{ x: "max-content" }}
            />
          </NxBaseContainer>
        </>
      ),
    },
    {
      key: "attachment",
      label: "Attachment",
      children: (
        <NxBaseContainer border>
          <Spin spinning={loading_listWoAttachments}>
            <NxAttachmentInput
              data={list_woAttachments}
              type="detail"
              mandatory={false}
              autoHeight={true}
            />
          </Spin>
        </NxBaseContainer>
      ),
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [
    wo,
    status,
    approvalStatus,
    list_woActivities,
    loading_listWoActivities,
    hasMoreActivities,
    list_woDataRequirements,
    loading_listWoDataRequirements,
    list_woAttachments,
    loading_listWoAttachments,
  ]);

  const routes = [
    { path: "", breadcrumbName: "Account Management" },
    { path: ACCOUNT_MANAGEMENT_ROUTES.VIEW_WORK_ORDERS, breadcrumbName: "Work Orders" },
    { path: "", breadcrumbName: "Detail" },
  ];

  return (
    <>
      <Spin spinning={isLoading} className="w-full top-20">
        <NxBreadCrumb routes={routes} />

        <div className="my-5 flex flex-col gap-4">
          {woContext.accountId && (
            <HeaderDetail
              data_header={["CUSTOMER INFORMATION", "ACCOUNT INFORMATION"]}
              dispatch={dispatch}
              idAccount={woContext.accountId}
              idCustomer={woContext.idCustomer}
              type={woContext.accountType}
              collapsible={true}
            />
          )}

          <NxCardContainer header="WORK ORDER">
            <NxTabs
              items={tabItems}
              activeKey={activeTab}
              onChange={setActiveTab}
            />
          </NxCardContainer>

          <NxCardContainer header="PROGRESS HISTORY">
            <NxBaseContainer border>
              <NxTable
                idTable="wo-progress-table"
                dataSource={list_woProgress.map((item, i) => ({ ...item, key: item.id ?? i }))}
                columns={PROGRESS_COLUMNS}
                usePagination={false}
                useInfiniteScroll={false}
                loading={loading_woProgress}
                showAdvanceSearch={false}
                tableScrolled={{ x: "max-content" }}
              />
            </NxBaseContainer>
          </NxCardContainer>
        </div>

        <NxBaseContainer border className="mb-5">
          <div className="flex justify-between items-center">
            <Button icon={<LeftOutlined />} onClick={goBack}>
              Back
            </Button>
            <div className="flex gap-2">
              {renderStatusButtons()}
            </div>
          </div>
        </NxBaseContainer>
      </Spin>

      <WoStatusUpdateModal
        isOpen={statusModal.open}
        toStatus={statusModal.toStatus}
        woData={detail_workOrder}
        approvalHierarchies={list_woApprovalHierarchy}
        loading={loading_statusUpdateWo}
        onCancel={closeStatusModal}
        onSubmit={handleStatusSubmit}
      />
    </>
  );
};

export default WorkOrderDetail;
