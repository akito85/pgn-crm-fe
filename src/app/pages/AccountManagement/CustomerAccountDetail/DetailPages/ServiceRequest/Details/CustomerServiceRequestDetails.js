import { useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button, Spin } from "antd";
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
import NxDetailText from "../../../../../../../components/Nx/NxDetailText";
import NxDate from "../../../../../../../components/Nx/NxDatePicker";

import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../../routes/account_management/customer_account_routes";
import {
  getServiceRequest,
  updateSrStatus,
} from "../../../../../../../redux/slices/account_management/detailAccount/ServiceRequestSlice";

import HeaderDetail from "../../../HeaderDetail";
import CustomerServiceRequestDetailTabs from "./CustomerServiceRequestDetailTabs";
import SVGIcon from "../../../../../../../assets/Icon/index";
import NxBreadCrumb from "../../../../../../../components/Nx/NxBreadCrumb";
import ActionLogTable from "./ActionLogTable";

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
    CANCELLED:   "Cancel Request",
    ON_HOLD:     "Mark as On Hold",
    CLOSED:      "Mark as Closed",
    RESOLVED:    "Mark as Resolved",
    IN_PROGRESS: "Mark as In Progress",
  };

  const currentActions = STATUS_ACTIONS[srStatus] || { buttons: [], primary: null };

  return (
    <>
      <Spin spinning={isLoading} className="w-full top-20">
        <div className="flex flex-col gap-4">
          <NxBreadCrumb routes={routes} />

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
          <ActionLogTable serviceRequestId={id} />

          {/* History Log Information */}
          <NxCardContainer header="HISTORY LOG INFORMATION">
            <NxBaseContainer border>
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
            </NxBaseContainer>
          </NxCardContainer>

          <NxBaseContainer border className="mb-5">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <Button type={"menu"} icon={<SVGIcon name="IconChevronLeft" width={14} />} onClick={() => navigate(-1)}>
                Back
              </Button>

              {currentActions.buttons.length > 0 && (
                <div className="flex items-center gap-3 flex-wrap">
                  {currentActions.buttons.map((key) => {
                    const def = BUTTON_DEF[key];
                    const isPrimary = key === currentActions.primary;

                    return (
                      <Button
                        key={key}
                        loading={loading_statusUpdateSr}
                        onClick={() => handleStatusUpdate(key)}
                        type={isPrimary ? "submit" : "menu"}
                      >
                        {def}
                      </Button>
                    );
                  })}
                </div>
              )}
            </div>
          </NxBaseContainer>
        </div>
      </Spin>
    </>
  );
};

export default CustomerServiceRequestDetails;
