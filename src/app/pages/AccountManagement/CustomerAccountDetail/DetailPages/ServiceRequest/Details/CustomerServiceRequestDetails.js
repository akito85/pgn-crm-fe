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
import LayoutMenu from "../../../../../../../components/SidebarMenu/LayoutMenu";
import ButtonComponent from "../../../../../../../components/ButtonComponent";

import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../../routes/account_management/customer_account_routes";
import {
  getServiceRequestDetailByAccount,
  updateServiceRequestStatus,
} from "../../../../../../../redux/slices/account_management/detailAccount/ServiceRequestSlice";

import HeaderDetail from "../../../HeaderDetail";
import CustomerServiceRequestDetailTabs from "./CustomerServiceRequestDetailTabs";

const CustomerServiceRequestDetails = ({ type = "standard" }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { id, idAccount, idCustomer, type: accountType } = location?.state || {};

  const { data_accountDetail, loading: loadingAccountDetail } = useSelector(
    (state) => state.accountManagement
  );
  const { data_detail, loading_detail, loading_status_update } = useSelector(
    (state) => state.serviceRequest
  );

  const isLoading = loadingAccountDetail || loading_detail;
  const srStatus = (data_detail?.status || "").toUpperCase();

  useEffect(() => {
    if (id && idAccount) {
      dispatch(getServiceRequestDetailByAccount({ accountId: idAccount, id }));
    }
  }, [dispatch, id, idAccount]);

  const handleStatusUpdate = useCallback(
    async (status) => {
      try {
        await dispatch(
          updateServiceRequestStatus({ accountId: idAccount, id, status })
        ).unwrap();
        dispatch(getServiceRequestDetailByAccount({ accountId: idAccount, id }));
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
    <LayoutMenu>
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
            data_detail={data_detail}
          />
        </div>

        {/* Footer Buttons */}
        <div className="mb-5 flex items-center justify-between gap-3 flex-wrap">
          <ButtonComponent
            type="button"
            onClick={() => navigate(-1)}
            icon={<LeftOutlined style={{ color: "#fff", fontSize: 20 }} />}
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
                    type="button"
                    loading={loading_status_update}
                    onClick={() => handleStatusUpdate(key)}
                    icon={def.icon}
                    style={isPrimary ? { backgroundColor: "#0075bf", borderColor: "#0075bf", color: "#fff" } : {}}
                  >
                    {def.label}
                  </ButtonComponent>
                );
              })}
            </div>
          )}
        </div>
      </Spin>
    </>
  );
};

export default CustomerServiceRequestDetails;
