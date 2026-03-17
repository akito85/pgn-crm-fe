import React, { useEffect, useState, useCallback } from "react";
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
  getGrantedAccessAccount,
  getAccountStandardDetail,
  getAccountOneTimeDetail,
} from "../../../../../../../redux/slices/account_management/accountManagement";
import { getCustomerDetail } from "../../../../../../../redux/slices/account_management/Customer/customerAccount";
import {
  getServiceRequestDetailByAccount,
  updateServiceRequestStatus,
} from "../../../../../../../redux/slices/account_management/detailAccount/ServiceRequestSlice";

import CustomerServiceRequestHeader from "./CustomerServiceRequestHeader";
import CustomerServiceRequestDetailTabs from "./CustomerServiceRequestDetailTabs";

const tabs = [
  { value: "Service Request" },
  { value: "Contact" },
  { value: "Pre-Requisite" },
  { value: "Work Order" },
  { value: "Attachment" },
];

const CustomerServiceRequestDetails = ({ type = "standard" }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { id, idAccount, idCustomer, type: accountType } = location?.state || {};

  const { data_customerDetail, loading, loadingAccount } = useSelector(
    (state) => state.customerAccount
  );
  const {
    access_account,
    data_accountDetail,
    loading: loadingAccountDetail,
  } = useSelector((state) => state.accountManagement);
  const { data_detail, loading_detail, loading_status_update } = useSelector(
    (state) => state.serviceRequest
  );

  const [activeTab, setActiveTab] = useState(tabs[0].value);

  const isLoading = loading || loadingAccount || loadingAccountDetail || loading_detail;
  const srStatus = (data_detail?.status || "").toUpperCase();

  useEffect(() => {
    dispatch(
      getGrantedAccessAccount(
        "/account-management/customers/view/service-requests/details"
      )
    );
  }, [dispatch]);

  useEffect(() => {
    if (idAccount && idCustomer && accountType) {
      if (accountType === "standard") {
        dispatch(getAccountStandardDetail({ idCustomer, idAccount }));
      } else {
        dispatch(getAccountOneTimeDetail({ idCustomer, idAccount }));
      }
    }
  }, [dispatch, idAccount, idCustomer, accountType]);

  useEffect(() => {
    if (idCustomer) dispatch(getCustomerDetail(idCustomer));
  }, [dispatch, idCustomer]);

  useEffect(() => {
    if (id && idAccount) {
      dispatch(getServiceRequestDetailByAccount({ accountId: idAccount, id }));
    }
  }, [dispatch, id, idAccount]);

  const handleTabChange = (e) => setActiveTab(e.target.value);

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

  // Button visibility rules per design
  const isClosed    = srStatus === "CLOSED";
  const isCancelled = srStatus === "CANCELLED" || srStatus === "CANCELED";
  const isTerminal  = isClosed || isCancelled;

  const showCancelBtn     = !isTerminal;
  const showOnHoldBtn     = !isTerminal && srStatus !== "ON_HOLD" && srStatus !== "RESOLVED";
  const showInProgressBtn = !isTerminal && srStatus !== "IN_PROGRESS";
  const showResolvedBtn   = !isTerminal && srStatus !== "RESOLVED";
  const showClosedBtn     = !isTerminal;

  return (
    <LayoutMenu>
      <Spin spinning={isLoading} className="w-full top-20">
        <BreadCrumb routes={routes} />

        <div className="my-5 flex flex-col gap-4">
          {/* Customer & Account Info */}
          <CustomerServiceRequestHeader
            id={id}
            data_detail={data_customerDetail}
            data_accountDetail={data_accountDetail}
            dispatch={dispatch}
            access_account={access_account}
          />

          {/* Detail Information Tabs */}
          <div
            className="bg-white rounded-[10px] border border-[#c8cdd4] p-5"
            style={{ boxShadow: "0px 4px 4px rgba(0,0,0,0.06)" }}
          >
            <div className="text-sky-600 text-base font-bold mb-4">
              DETAIL INFORMATION
            </div>
            <CustomerServiceRequestDetailTabs
              id={id}
              idAccount={idAccount}
              idCustomer={idCustomer}
              accountType={accountType}
              data_accountDetail={data_accountDetail}
              data_customerDetail={data_customerDetail}
              data_detail={data_detail}
              section={activeTab}
              options={tabs}
              handleChangeOption={handleTabChange}
            />
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="mb-5 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <ButtonComponent
              type="button"
              onClick={() => navigate(-1)}
              icon={<LeftOutlined style={{ color: "#fff", fontSize: 20 }} />}
            >
              Back
            </ButtonComponent>

            {showCancelBtn && (
              <ButtonComponent
                type="button"
                loading={loading_status_update}
                onClick={() => handleStatusUpdate("CANCELLED")}
                icon={<CloseOutlined className="text-xl" />}
                style={{
                  backgroundColor: "#ef4444",
                  borderColor: "#ef4444",
                  color: "#fff",
                }}
              >
                Cancel Request
              </ButtonComponent>
            )}

            {showOnHoldBtn && (
              <ButtonComponent
                type="button"
                loading={loading_status_update}
                onClick={() => handleStatusUpdate("ON_HOLD")}
                icon={<PauseCircleOutlined className="text-xl" />}
              >
                Mark as On Hold
              </ButtonComponent>
            )}
          </div>

          <div className="flex items-center gap-3">
            {showInProgressBtn && (
              <ButtonComponent
                type="button"
                loading={loading_status_update}
                onClick={() => handleStatusUpdate("IN_PROGRESS")}
                icon={<PlayCircleOutlined className="text-xl" />}
              >
                Mark as In Progress
              </ButtonComponent>
            )}

            {showResolvedBtn && (
              <ButtonComponent
                type="button"
                loading={loading_status_update}
                onClick={() => handleStatusUpdate("RESOLVED")}
                icon={<CheckCircleOutlined className="text-xl" />}
              >
                Mark as Resolved
              </ButtonComponent>
            )}

            {showClosedBtn && (
              <ButtonComponent
                type="button"
                loading={loading_status_update}
                onClick={() => handleStatusUpdate("CLOSED")}
                icon={<LockOutlined className="text-xl" />}
                style={{
                  backgroundColor: "#0075bf",
                  borderColor: "#0075bf",
                  color: "#fff",
                }}
              >
                Mark as Closed
              </ButtonComponent>
            )}
          </div>
        </div>
      </Spin>
    </LayoutMenu>
  );
};

export default CustomerServiceRequestDetails;
