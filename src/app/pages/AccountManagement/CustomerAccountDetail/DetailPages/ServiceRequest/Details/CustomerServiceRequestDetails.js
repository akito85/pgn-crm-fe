import { useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Spin } from "antd";
import {
  CloseOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  LockOutlined,
  CheckCircleOutlined,
  LeftOutlined,
} from "@ant-design/icons";

import BreadCrumb from "../../../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../../../components/ButtonComponent";
import NxBaseContainer from "../../../../../../../components/Nx/NxBaseContainer";
import NxCardContainer from "../../../../../../../components/Nx/NxCardContainer";
import NxTable from "../../../../../../../components/Nx/NxTable";
import NxDetailText from "../../../../../../../components/Nx/NxDetailText";
import NxDate from "../../../../../../../components/Nx/NxDatePicker";

import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../../routes/account_management/customer_account_routes";
import {
  getServiceRequest,
  updateSrStatus,
} from "../../../../../../../redux/slices/account_management/detailAccount/ServiceRequestSlice";

import HeaderDetail from "../../../HeaderDetail";
import CustomerServiceRequestDetailTabs from "./CustomerServiceRequestDetailTabs";

// ── Action Log columns ────────────────────────────────────────────────────────
const LOG_COLUMNS = [
  { title: "NO", width: 60, align: "center", render: (_, __, i) => i + 1 },
  {
    title: "DATE", dataIndex: "createdDate", width: 180, sorter: true, filter: true,
    render: (v) => NxDate.formatDate(v, "DD MMM YYYY HH:mm:ss"),
  },
  { title: "USERNAME", dataIndex: "createdBy",  width: 150, sorter: true, filter: true },
  { title: "ACTION",   dataIndex: "remark",     width: 250, sorter: true, filter: true },
  { title: "REMARK",   dataIndex: "newValue",   sorter: true, filter: true, render: (v) => v || "-" },
];

const CustomerServiceRequestDetails = ({ type = "standard" }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { id, idAccount, idCustomer, type: accountType } = location?.state || {};

  const { data_accountDetail, loading: loadingAccountDetail } = useSelector(
    (state) => state.accountManagement
  );
  const { detail_serviceRequest, loading_detailSr, loading_statusUpdateSr } = useSelector(
    (state) => state.serviceRequest
  );

  const isLoading = loadingAccountDetail || loading_detailSr;
  const srStatus = (detail_serviceRequest?.status || "").toUpperCase();

  useEffect(() => {
    if (id && idAccount) {
      dispatch(getServiceRequest({ accountId: idAccount, id }));
    }
  }, [dispatch, id, idAccount]);

  const handleStatusUpdate = useCallback(
    async (status) => {
      try {
        await dispatch(
          updateSrStatus({ accountId: idAccount, id, status })
        ).unwrap();
        dispatch(getServiceRequest({ accountId: idAccount, id }));
      } catch (_) {}
    },
    [dispatch, idAccount, id]
  );

  const routes = [
    { path: "", breadcrumbName: "Account" },
    {
      path:
        accountType === "standard"
          ? ACCOUNT_MANAGEMENT_ROUTES.VIEW_ACCOUNT_STANDARD
          : ACCOUNT_MANAGEMENT_ROUTES.VIEW_ACCOUNT_ONETIME,
      breadcrumbName:
        accountType === "standard" ? "Account - Standard" : "Account - One Time",
    },
    {
      path:
        accountType === "standard"
          ? ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_STANDARD
          : ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_ONETIME,
      breadcrumbName: "Detail Account",
    },
    {
      path: ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_SERVICE_REQUEST,
      breadcrumbName: "Service Requests",
    },
    { path: "", breadcrumbName: "Detail" },
  ];

  // Button config per status: ordered list of actions + which one is primary
  const STATUS_ACTIONS = {
    OPEN:        { buttons: ["CANCELLED", "ON_HOLD", "CLOSED", "RESOLVED", "IN_PROGRESS"], primary: "IN_PROGRESS" },
    IN_PROGRESS: { buttons: ["CANCELLED", "ON_HOLD", "CLOSED", "RESOLVED"],               primary: "RESOLVED"    },
    ON_HOLD:     { buttons: ["CANCELLED", "IN_PROGRESS"],                                  primary: "IN_PROGRESS" },
    RESOLVED:    { buttons: ["CANCELLED", "IN_PROGRESS", "CLOSED"],                        primary: "CLOSED"      },
  };

  const BUTTON_DEF = {
    CANCELLED:   { label: "Cancel Request",      icon: <CloseOutlined /> },
    ON_HOLD:     { label: "Mark as On Hold",      icon: <PauseCircleOutlined /> },
    CLOSED:      { label: "Mark as Closed",       icon: <LockOutlined /> },
    RESOLVED:    { label: "Mark as Resolved",     icon: <CheckCircleOutlined /> },
    IN_PROGRESS: { label: "Mark as In Progress",  icon: <PlayCircleOutlined /> },
  };

  const currentActions = STATUS_ACTIONS[srStatus] || { buttons: [], primary: null };

  return (
    <>
      <Spin spinning={isLoading} className="w-full top-20">
        <BreadCrumb routes={routes} />

        <div className="my-5 flex flex-col gap-4">
          {/* Customer & Account Info */}
          <HeaderDetail
            data_header={["CUSTOMER INFORMATION", "ACCOUNT INFORMATION"]}
            dispatch={dispatch}
            idAccount={idAccount}
            idCustomer={idCustomer}
            type={accountType}
            collapsible={true}
          />

          {/* Detail Information Tabs */}
          <CustomerServiceRequestDetailTabs
            id={id}
            idAccount={idAccount}
            idCustomer={idCustomer}
            accountType={accountType}
            data_accountDetail={data_accountDetail}
            data_detail={detail_serviceRequest}
          />

          {/* Action Log */}
          <NxCardContainer header="ACTION LOG">
            <NxTable
              idTable="action-log-table"
              dataSource={(Array.isArray(detail_serviceRequest?.actionLog) ? detail_serviceRequest.actionLog : [])
                .map((item, i) => ({ ...item, key: item.id || i }))}
              columns={LOG_COLUMNS}
              usePagination={false}
              useInfiniteScroll={true}
              hasMore={false}
              showAdvanceSearch={false}
              showSearchBar={false}
              fontSize="small"
              tablePadding="small"
              tableScrolled={{ x: "max-content", y: 300 }}
            />
          </NxCardContainer>

          {/* History Log Information */}
          <NxCardContainer header="HISTORY LOG INFORMATION">
            <div className="w-full grid grid-cols-5 gap-4">
              <NxDetailText label="Record ID">
                {detail_serviceRequest?.historyLog?.recordId || detail_serviceRequest?.id || "-"}
              </NxDetailText>
              <NxDetailText label="Created Date">
                {NxDate.formatDate(detail_serviceRequest?.historyLog?.createdDate || detail_serviceRequest?.createdDate, "DD MMM YYYY HH:mm:ss")}
              </NxDetailText>
              <NxDetailText label="Created By">
                {detail_serviceRequest?.historyLog?.createdBy || detail_serviceRequest?.createdBy || "-"}
              </NxDetailText>
              <NxDetailText label="Updated Date">
                {NxDate.formatDate(detail_serviceRequest?.historyLog?.updatedDate || detail_serviceRequest?.updatedDate, "DD MMM YYYY HH:mm:ss")}
              </NxDetailText>
              <NxDetailText label="Updated By">
                {detail_serviceRequest?.historyLog?.updatedBy || detail_serviceRequest?.updatedBy || "-"}
              </NxDetailText>
            </div>
          </NxCardContainer>
        </div>

        {/* Footer */}
        <NxBaseContainer border className="mb-5">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <ButtonComponent
              onClick={() => navigate(-1)}
              icon={<LeftOutlined />}
            >
              Back
            </ButtonComponent>

            {currentActions.buttons.length > 0 && (
              <div className="flex items-center gap-3 flex-wrap">
                {currentActions.buttons.map((key) => {
                  const def = BUTTON_DEF[key];
                  const isPrimary = key === currentActions.primary;
                  return (
                    <ButtonComponent
                      key={key}
                      loading={loading_statusUpdateSr}
                      onClick={() => handleStatusUpdate(key)}
                      icon={def.icon}
                      isPrimary={isPrimary}
                    >
                      {def.label}
                    </ButtonComponent>
                  );
                })}
              </div>
            )}
          </div>
        </NxBaseContainer>
      </Spin>
    </>
  );
};

export default CustomerServiceRequestDetails;
