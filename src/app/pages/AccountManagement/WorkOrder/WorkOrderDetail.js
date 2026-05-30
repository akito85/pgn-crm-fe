import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Spin } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import NxCardContainer from "../../../components/Nx/NxCardContainer";
import NxBaseContainer from "../../../components/Nx/NxBaseContainer";
import NxDetailText from "../../../components/Nx/NxDetailText";
import NxTable from "../../../components/Nx/NxTable";
import NxDate from "../../../components/Nx/NxDatePicker";
import NxBreadCrumb from "../../../components/Nx/NxBreadCrumb";
import HeaderDetail from "../CustomerAccountDetail/HeaderDetail";
import StatusComponent from "../../../components/StatusComponent";
import WoStatusUpdateModal from "./WoStatusUpdateModal";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../routes/account_management/customer_account_routes";
import {
  getWorkOrder,
  getWoActivities,
  getWoProgress,
  updateWoStatus,
} from "../../../redux/slices/account_management/detailAccount/WorkOrderSlice";
import { getAccountStandardDetail, getAccountOneTimeDetail } from "../../../redux/slices/account_management/accountManagement";

const ACTIVITY_COLUMNS = [
  { title: "NO",            width: 60,  align: "center", render: (_, __, i) => i + 1 },
  { title: "ACTIVITY NAME", dataIndex: "woActName",      width: 180, render: (v) => v || "-" },
  { title: "PIC POSITION",  dataIndex: "picPositionName",width: 160, render: (v) => v || "-" },
  { title: "PIC USER",      dataIndex: "picUserName",    width: 160, render: (v) => v || "-" },
  { title: "PLAN DATE",     dataIndex: "planDate",       width: 130, render: (v) => v ? NxDate.formatDate(v, "DD MMM YYYY") : "-" },
  { title: "STATUS",        dataIndex: "activityStatus", width: 120, render: (v) => v || "-" },
  { title: "DESCRIPTION",   dataIndex: "woActDesc",      width: 200, render: (v) => v || "-" },
];

const PROGRESS_COLUMNS = [
  { title: "NO",           width: 60,  align: "center", render: (_, __, i) => i + 1 },
  { title: "FROM STATUS",  dataIndex: "fromStatus",   width: 140, render: (v) => v || "(initial)" },
  { title: "TO STATUS",    dataIndex: "toStatus",     width: 140, render: (v) => v || "-" },
  { title: "REMARK",       dataIndex: "remark",       render: (v) => v || "-" },
  { title: "CHANGED BY",   dataIndex: "changedBy",    width: 160, render: (v) => v || "-" },
  { title: "CHANGED DATE", dataIndex: "changedDate",  width: 180, render: (v) => v ? NxDate.formatDate(v, "DD MMM YYYY HH:mm") : "-" },
  { title: "DURATION (s)", dataIndex: "durationSeconds", width: 130, render: (v) => v ?? "-" },
];

const WorkOrderDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { woId, idAccount, idCustomer, accountType } = location.state || {};

  const {
    detail_workOrder,
    loading_detailWo,
    list_woActivities,
    loading_listWoActivities,
    list_woProgress,
    loading_woProgress,
    loading_statusUpdateWo,
    list_woApprovalHierarchy,
  } = useSelector((state) => state.workOrder);
  const { loading: loadingAccount } = useSelector((state) => state.accountManagement);

  const isLoading = loading_detailWo || loadingAccount;

  const [statusModal, setStatusModal] = useState({ open: false, toStatus: null });

  const openStatusModal = (toStatus) => setStatusModal({ open: true, toStatus });
  const closeStatusModal = () => setStatusModal({ open: false, toStatus: null });

  useEffect(() => {
    if (woId) {
      dispatch(getWorkOrder({ woId, accountId: idAccount }));
      dispatch(getWoActivities({ woId, body: { page: 1, size: 50, filters: [], filterRules: [] }, isLoadMore: false }));
      dispatch(getWoProgress(woId));
    }
  }, [dispatch, woId]);

  useEffect(() => {
    if (idAccount && accountType) {
      if (accountType === "standard") {
        dispatch(getAccountStandardDetail({ idCustomer, idAccount }));
      } else {
        dispatch(getAccountOneTimeDetail({ idCustomer, idAccount }));
      }
    }
  }, [dispatch, idAccount, idCustomer, accountType]);

  const wo = detail_workOrder;
  const status = (wo?.status || "").toUpperCase();
  const prevStatus = (wo?.previousStatus || "").toUpperCase();
  const approvalStatus = (wo?.approvalStatus || "").toUpperCase();

  const handleStatusSubmit = ({ toStatus, remark, cancelApphierId }) => {
    dispatch(updateWoStatus({ accountId: idAccount, woId, toStatus, remark, cancelApphierId }))
      .unwrap()
      .then(() => {
        closeStatusModal();
        dispatch(getWorkOrder({ woId, accountId: idAccount }));
        dispatch(getWoProgress(woId));
      })
      .catch(() => {});
  };

  const renderStatusButtons = () => {
    if (!wo) return null;

    const btnInProgress = (
      <Button type="secondary" onClick={() => openStatusModal("IN_PROGRESS")}>
        Mark as In Progress
      </Button>
    );
    const btnOnHold = (
      <Button type="secondary" onClick={() => openStatusModal("ON_HOLD")}>
        Mark as On Hold
      </Button>
    );
    const btnOpen = (
      <Button type="secondary" onClick={() => openStatusModal("OPEN")}>
        Mark as Open
      </Button>
    );
    const btnResolved = (
      <Button type="secondary" onClick={() => openStatusModal("RESOLVED")}>
        Mark as Resolved
      </Button>
    );
    const btnClosed = (
      <Button type="submit" onClick={() => openStatusModal("CLOSED")}>
        Mark as Closed
      </Button>
    );
    const btnCancel = (
      <Button type="reject" onClick={() => openStatusModal("CANCELLED")}>
        Cancel WO
      </Button>
    );
    const btnEdit = (
      <Button
        type="submit"
        onClick={() =>
          navigate(ACCOUNT_MANAGEMENT_ROUTES.UPDATE_WORK_ORDER, {
            state: {
              woContext: {
                type: "standalone",
                idAccount,
                idCustomer,
                accountType,
                isUpdate: true,
                woId,
              },
            },
          })
        }
      >
        Edit
      </Button>
    );

    switch (status) {
      case "DRAFT":
        return <>{btnEdit}</>;
      case "SUBMITTED":
        return null;
      case "OPEN":
        return <>{btnInProgress}{btnOnHold}{btnCancel}</>;
      case "IN_PROGRESS":
        return <>{btnOnHold}{btnResolved}{btnCancel}</>;
      case "ON_HOLD":
        if (prevStatus === "IN_PROGRESS") return <>{btnInProgress}{btnCancel}</>;
        return <>{btnOpen}{btnCancel}</>;
      case "RESOLVED":
        return <>{btnInProgress}{btnClosed}{btnCancel}</>;
      case "CLOSED":
      case "CANCELLED":
        return null;
      default:
        return null;
    }
  };

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
          {idAccount && (
            <HeaderDetail
              data_header={["CUSTOMER INFORMATION", "ACCOUNT INFORMATION"]}
              dispatch={dispatch}
              idAccount={idAccount}
              idCustomer={idCustomer}
              type={accountType}
              collapsible={true}
            />
          )}

          <NxCardContainer header="WORK ORDER INFORMATION">
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
                    <StatusComponent colour={status.toLowerCase()} margin={false}>
                      {status.replace(/_/g, " ")}
                    </StatusComponent>
                  ) : "-"}
                </NxDetailText>
                <NxDetailText label="Approval Status">
                  {approvalStatus ? (
                    <StatusComponent colour={approvalStatus.toLowerCase()} margin={false}>
                      {approvalStatus.replace(/_/g, " ")}
                    </StatusComponent>
                  ) : "-"}
                </NxDetailText>
                <NxDetailText label="Age (hours)">{wo?.ageHours != null ? `${wo.ageHours} hrs` : "-"}</NxDetailText>
              </div>
              <NxDetailText label="Description" className="mt-2">{wo?.description || "-"}</NxDetailText>
            </NxBaseContainer>
          </NxCardContainer>

          <NxCardContainer header="ACTIVITY LIST">
            <NxBaseContainer border>
              <NxTable
                idTable="wo-detail-activity-table"
                dataSource={list_woActivities.map((item, i) => ({ ...item, key: item.id ?? i }))}
                columns={ACTIVITY_COLUMNS}
                usePagination={false}
                useInfiniteScroll={false}
                loading={loading_listWoActivities}
                showAdvanceSearch={false}
                tableScrolled={{ x: "max-content" }}
              />
            </NxBaseContainer>
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

        {/* Footer */}
        <NxBaseContainer border className="mb-5">
          <div className="flex justify-between items-center">
            <Button icon={<LeftOutlined />} onClick={() => navigate(-1)}>
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
        accountId={idAccount}
        approvalHierarchies={list_woApprovalHierarchy}
        loading={loading_statusUpdateWo}
        onCancel={closeStatusModal}
        onSubmit={handleStatusSubmit}
      />
    </>
  );
};

export default WorkOrderDetail;
