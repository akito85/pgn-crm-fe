import { useEffect } from "react";
import LayoutMenu from "../../../../../../../../components/SidebarMenu/LayoutMenu";
import { useSelector, useDispatch } from "react-redux";
import { Spin } from "antd";
import ButtonComponent from "../../../../../../../../components/ButtonComponent";
import { LeftOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PaymentRelationDetailTabs from "./PaymentRelationDetailTabs";
import { getCustomerDetail } from "../../../../../../../../redux/slices/account_management/Customer/customerAccount";
import moment from "moment";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../../../routes/account_management/customer_account_routes";
import { dateFormatting } from "../../../../../../../../utils";
import { getAccountStandardDetail, getGrantedAccessAccount } from "../../../../../../../../redux/slices/account_management/accountManagement";
import { getDetailPaymentRelation, approveOrRejectPaymentRelation, approveOrRejectInactivePaymentRelation } from "../../../../../../../../redux/slices/account_management/detailAccount/PaymentRelationSlice";
import { showModalError } from "../../../../../../../../redux/slices/general_slice";
import NxCardContainer from "../../../../../../../../components/Nx/NxCardContainer";
import NxBreadCrumb from "../../../../../../../../components/Nx/NxBreadCrumb";
import NxDetailText from "../../../../../../../../components/Nx/NxDetailText";
import NxBaseContainer from "../../../../../../../../components/Nx/NxBaseContainer";
import NxApproveOrRejectModal from "../../../../../../../../components/Nx/NxApproveOrRejectModal";

const PaymentRelationDetails = ({
  type = "standard"
}) => {
  const dispatch = useDispatch();

  const { detail_paymentRelation } = useSelector(
    (state) => state.paymentRelation
  );

  const { data_customerDetail, loading, loadingAccount } = useSelector(
    (state) => state.customerAccount
  );

  const { data_accountDetail } = useSelector(
    (state) => state.accountManagement
  );
  
  const isLoading = loading || loadingAccount;

  //declare
  const navigate = useNavigate();
  const location = useLocation();
  const idAccount = location?.state?.idAccount;
  const idCustomer = location?.state?.idCustomer;
  const idPr = location?.state?.id;

  const [isApproval, setIsApproval] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approveOrReject, setApproveOrReject] = useState("");

  const routes = [
    {
      path: "",
      breadcrumbName: "Account",
    },
    {
      path:
        type == "standard"
          ? ACCOUNT_MANAGEMENT_ROUTES.VIEW_ACCOUNT_STANDARD
          : ACCOUNT_MANAGEMENT_ROUTES.VIEW_ACCOUNT_ONETIME,
      breadcrumbName:
        type == "standard" ? "Account - Standard" : "Account - One Time",
    },
    {
      path:ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_PAYMENT_RELATION,
      breadcrumbName: "Detail Account",
    },
    {
      path: "",
      breadcrumbName: "Detail Payment Relation",
    },
  ];

  const renderDate = (date) => {
    if (date) {
      return moment(date).format(dateFormatting.dateTime);
    } else {
      return "";
    }
  };

  /**
   * @param {boolean} show
   * @param {"approve"|"reject"} action 
   */
  const handleApprovalModal = (show, action) => {
    if (show) {
      setShowApprovalModal(true);
      setApproveOrReject(action);
    } else {
      setShowApprovalModal(false);
      setApproveOrReject("");
    }
  }

  /**
   * @param {"approve"|"reject"} action 
   */
  const handleApproveOrReject = (description, action, handleClear) => {
    if (detail_paymentRelation?.result) {
      const { result } = detail_paymentRelation;

      const body = [{
        id: result.id,
        approvalId: result.tappId,
        action: action.toUpperCase(),
        description,
      }];

      if (result.approvalType === "PAYMENT_RELATION") {
        dispatch(approveOrRejectPaymentRelation({
          body,
          action,
        }))
        .unwrap()
        .then(() => {
          dispatch(getDetailPaymentRelation(idPr));
          handleClear();
          handleApprovalModal(false);
        })
        .catch(() => {});
      } else if (result.approvalType === "INACTIVE_PAYMENT_RELATION") {
        dispatch(approveOrRejectInactivePaymentRelation({
          body,
          action,
        }))
        .unwrap()
        .then(() => {
          dispatch(getDetailPaymentRelation(idPr));
          handleClear();
          handleApprovalModal(false);
        })
        .catch(() => {});
      } else {
        const errorBody = {
          title: "Failed",
          description: `The approval type is invalid.`,
        };

        dispatch(showModalError(errorBody));
      }
    }
  }

  useEffect(() => {
    dispatch(getGrantedAccessAccount('/account-management/customers/view/service-requests/details'))
  }, [dispatch]);

  useEffect(() => {
    if (idCustomer)
      dispatch(getCustomerDetail(idCustomer));
  }, [idCustomer]);

  useEffect(() => {
    if (idAccount && idCustomer) {
      dispatch(getAccountStandardDetail({ idAccount, idCustomer }));
    }
  }, [idAccount, idCustomer]);

  useEffect(() => {
    if (idPr)
      dispatch(getDetailPaymentRelation(idPr));
  }, [idPr])

  useEffect(() => {
    if (detail_paymentRelation?.result) {
      const { approvalType } = detail_paymentRelation.result;

      if (approvalType === "PAYMENT_RELATION" || approvalType === "INACTIVE_PAYMENT_RELATION")
        setIsApproval(true);
      else
        setIsApproval(false);
    }
  }, [detail_paymentRelation]);

  return (
    <LayoutMenu>
      <Spin spinning={isLoading} className={"w-full top-20"}>
        <div className="flex flex-col gap-y-4">
          <NxBreadCrumb routes={routes} />
          <NxCardContainer header={"CUSTOMER & ACCOUNT INFORMATION"}>
            <div className="flex flex-col gap-y-4">
              <NxBaseContainer border header={"CUSTOMER INFORMATION"}>
                <div className="w-full grid grid-cols-4 gap-4">
                  <NxDetailText label="Customer Number">{data_customerDetail?.customerNumber}</NxDetailText>
                  <NxDetailText label="Identification Type">{data_customerDetail?.identificationType}</NxDetailText>
                  <NxDetailText label="Customer Identification Number">{data_customerDetail?.customerIdentificationNumber}</NxDetailText>
                  <NxDetailText label="Customer Name">{data_customerDetail?.customerName}</NxDetailText>
                  <NxDetailText label="Customer Type">{data_customerDetail?.customerType}</NxDetailText>
                  <NxDetailText label="Description">{data_customerDetail?.description}</NxDetailText>
                  <NxDetailText label="Birth/Founded Date">{renderDate(data_customerDetail?.birthFoundedDate || "")}</NxDetailText>
                  <NxDetailText label="Birth/Founded Place">{data_customerDetail?.birthFoundedPlace}</NxDetailText>
                  <NxDetailText label="Sex">{data_customerDetail?.sex}</NxDetailText>
                  <NxDetailText label="Maritial Status">{data_customerDetail?.maritialStatus}</NxDetailText>
                  <NxDetailText label="Search Key">{data_customerDetail?.searchKey}</NxDetailText>
                </div>
              </NxBaseContainer>
              <NxBaseContainer border header={"ACCOUNT INFORMATION"}>
                <div className="w-full grid grid-cols-4 gap-4">
                  <NxDetailText label="Account Number">{data_accountDetail?.accountSummary?.accountNumber}</NxDetailText>
                  <NxDetailText label="Registration Number">{data_accountDetail?.accountSummary?.registrationNumber}</NxDetailText>
                  <NxDetailText label="Account Name">{data_accountDetail?.accountSummary?.accountName}</NxDetailText>
                  <NxDetailText label="Category">{data_accountDetail?.accountSummary?.category}</NxDetailText>
                  <NxDetailText label="SOR">{data_accountDetail?.accountSummary?.sor}</NxDetailText>
                  <NxDetailText label="Cost Center">{data_accountDetail?.accountSummary?.costCenter}</NxDetailText>
                  <NxDetailText label="Meter Reading Codes">{renderDate(data_accountDetail?.meterReadingCodes || "")}</NxDetailText>
                  <NxDetailText label="Customer Management">{data_accountDetail?.accountSummary?.customerManagement}</NxDetailText>
                  <NxDetailText label="Classification Type">{data_accountDetail?.accountSummary?.classificationType}</NxDetailText>
                  <NxDetailText label="Segment">{data_accountDetail?.accountSummary?.segment}</NxDetailText>
                  <NxDetailText label="Account Group Type">{data_accountDetail?.accountSummary?.accountGroupType}</NxDetailText>
                  <NxDetailText label="Premise Address">{data_accountDetail?.accountSummary?.premiseAddress}</NxDetailText>
                  <NxDetailText label="Subdistrict">{data_accountDetail?.accountSummary?.subdistrict}</NxDetailText>
                  <NxDetailText label="District">{data_accountDetail?.accountSummary?.district}</NxDetailText>
                  <NxDetailText label="City">{data_accountDetail?.accountSummary?.city}</NxDetailText>
                  <NxDetailText label="Country">{data_accountDetail?.accountSummary?.country}</NxDetailText>
                  <NxDetailText label="Longitude">{data_accountDetail?.accountSummary?.longitude}</NxDetailText>
                  <NxDetailText label="Latitude">{data_accountDetail?.accountSummary?.latitude}</NxDetailText>
                  <NxDetailText label="Status">{data_accountDetail?.accountSummary?.status}</NxDetailText>    
                </div>
              </NxBaseContainer>
            </div>
          </NxCardContainer>

          <PaymentRelationDetailTabs
            dataDetail={detail_paymentRelation?.result}
            subjectAccountNumber={data_accountDetail?.accountSummary?.accountNumber}
            dispatch={dispatch}
            idPr={idPr}
          />

          <NxCardContainer header={"HISTORY LOG INFORMATION"}>
            <NxBaseContainer border>
              <div className="w-full grid grid-cols-5 gap-4">
                {/* History Log Information */}
                <NxDetailText label="Record Id">{detail_paymentRelation?.result?.id}</NxDetailText>
                <NxDetailText label="Created Date">{detail_paymentRelation?.result?.createdDate ? moment(detail_paymentRelation?.result.createdDate, dateFormatting.meas_date).format(dateFormatting.dateTime) : ""}</NxDetailText>
                <NxDetailText label="Created By">{detail_paymentRelation?.result?.createdBy}</NxDetailText>
                <NxDetailText label="Updated Date">{detail_paymentRelation?.result?.updatedDate ? moment(detail_paymentRelation?.result.updatedDate, dateFormatting.meas_date).format(dateFormatting.dateTime) : ""}</NxDetailText>
                <NxDetailText label="Updated By">{detail_paymentRelation?.result?.updatedBy}</NxDetailText>
              </div>
            </NxBaseContainer>
          </NxCardContainer>

          {isApproval && (
            <NxBaseContainer border>
              <div className="flex justify-between">
                <ButtonComponent
                  type={"menu"}
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </ButtonComponent>
                <div className={"w-full flex justify-end gap-5"}>
                  <ButtonComponent
                    type="reject"
                    onClick={() => handleApprovalModal(true, "reject")}
                  >
                    Reject
                  </ButtonComponent>
                  <ButtonComponent
                    type="approve"
                    onClick={() => handleApprovalModal(true, "approve")}
                  >
                    Approve
                  </ButtonComponent>
                </div>
              </div>
            </NxBaseContainer>
          )}
        </div>
      </Spin>
      <NxApproveOrRejectModal
        isOpen={showApprovalModal}
        header={approveOrReject === "approve" ? "Approve" : approveOrReject === "reject" ? "Reject" : ""}
        handleCloseModal={() => handleApprovalModal(false)}
        customMessage={`Are you sure you want to ${approveOrReject} payment relation - ${detail_paymentRelation?.result?.relatedAccountNumber}?`}
        onFinish={({ remark }, handleClear) => handleApproveOrReject(remark, approveOrReject, handleClear)}
      />
    </LayoutMenu>
  );
};

export default PaymentRelationDetails;
