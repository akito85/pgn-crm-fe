import { useEffect } from "react";
import BreadCrumb from "../../../../../../../../components/BreadCrumb";
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
import BaseContainer from "../../../../../../../../components/BaseContainer";
import DetailText from "../../../../../../../../components/DetailText";
import { getDetailPaymentRelation, getPaymentRelationAttachment, approveOrRejectPaymentRelation, approveOrRejectInactivePaymentRelation } from "../../../../../../../../redux/slices/account_management/detailAccount/FinancialInformationSlice";
import ModalApproveOrReject from "../../../../../../../../components/Modal/ModalApproveOrReject";
import { showModalError } from "../../../../../../../../redux/slices/general_slice";

const tabs = [
  { value: "Payment Relation Information" },
  { value: "Attachment" },
];

const PaymentRelationDetails = ({
  type = "standard"
}) => {
  const dispatch = useDispatch();

  const { detail_paymentRelation } = useSelector(
    (state) => state.financialInformation
  )

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

  //state
  const [typeDetailSection, setTypeDetailSection] = useState(tabs[0].value);
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
      path:
        type == "standard"
          ? ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_STANDARD
          : ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_ONETIME,
      breadcrumbName: "Detail Account",
    },
    {
      path:ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_PAYMENT_RELATION,
      breadcrumbName: "Payment Relation",
    },
    {
      path: "",
      breadcrumbName: "Detail",
    },
  ];

  //handle
  const handleDetailSection = (e) => {
    setTypeDetailSection(e.target.value);
  };

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
    if (idPr) {
      dispatch(getDetailPaymentRelation(idPr));
      dispatch(getPaymentRelationAttachment({ id: idPr }));
    }
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
        <BreadCrumb routes={routes} />
        
        <BaseContainer>
          <div className="flex flex-col gap-y-5">
            {/* Customer Information */}
            <div className="text-primary text-xs font-bold uppercase">
              CUSTOMER INFORMATION
            </div>
            <div className="w-full grid grid-cols-4 gap-x-5">
              <DetailText label="Customer Number">{data_customerDetail?.customerNumber}</DetailText>
              <DetailText label="Identification Type">{data_customerDetail?.identificationType}</DetailText>
              <DetailText label="Customer Identification Number">{data_customerDetail?.customerIdentificationNumber}</DetailText>
              <DetailText label="Customer Name">{data_customerDetail?.customerName}</DetailText>
              <DetailText label="Customer Type">{data_customerDetail?.customerType}</DetailText>
              <DetailText label="Description">{data_customerDetail?.description}</DetailText>
              <DetailText label="Birth/Founded Date">{renderDate(data_customerDetail?.birthFoundedDate || "")}</DetailText>
              <DetailText label="Birth/Founded Place">{data_customerDetail?.birthFoundedPlace}</DetailText>
              <DetailText label="Sex">{data_customerDetail?.sex}</DetailText>
              <DetailText label="Maritial Status">{data_customerDetail?.maritialStatus}</DetailText>
              <DetailText label="Search Key">{data_customerDetail?.searchKey}</DetailText>
            </div>

            {/* Account Information */}
            <div className="text-primary text-xs font-bold uppercase">
              ACCOUNT INFORMATION
            </div>
            <div className="w-full grid grid-cols-4 gap-x-4">
              <DetailText label="Account Number">{data_accountDetail?.accountSummary?.accountNumber}</DetailText>
              <DetailText label="Registration Number">{data_accountDetail?.accountSummary?.registrationNumber}</DetailText>
              <DetailText label="Account Name">{data_accountDetail?.accountSummary?.accountName}</DetailText>
              <DetailText label="Category">{data_accountDetail?.accountSummary?.category}</DetailText>
              <DetailText label="SOR">{data_accountDetail?.accountSummary?.sor}</DetailText>
              <DetailText label="Cost Center">{data_accountDetail?.accountSummary?.costCenter}</DetailText>
              <DetailText label="Meter Reading Codes">{renderDate(data_accountDetail?.meterReadingCodes || "")}</DetailText>
              <DetailText label="Customer Management">{data_accountDetail?.accountSummary?.customerManagement}</DetailText>
              <DetailText label="Classification Type">{data_accountDetail?.accountSummary?.classificationType}</DetailText>
              <DetailText label="Segment">{data_accountDetail?.accountSummary?.segment}</DetailText>
              <DetailText label="Account Group Type">{data_accountDetail?.accountSummary?.accountGroupType}</DetailText>
              <DetailText label="Premise Address">{data_accountDetail?.accountSummary?.premiseAddress}</DetailText>
              <DetailText label="Subdistrict">{data_accountDetail?.accountSummary?.subdistrict}</DetailText>
              <DetailText label="District">{data_accountDetail?.accountSummary?.district}</DetailText>
              <DetailText label="City">{data_accountDetail?.accountSummary?.city}</DetailText>
              <DetailText label="Country">{data_accountDetail?.accountSummary?.country}</DetailText>
              <DetailText label="Longitude">{data_accountDetail?.accountSummary?.longitude}</DetailText>
              <DetailText label="Latitude">{data_accountDetail?.accountSummary?.latitude}</DetailText>
              <DetailText label="Status">{data_accountDetail?.accountSummary?.status}</DetailText>    
            </div>
          </div>
        </BaseContainer>

        <div className="my-5">
          <PaymentRelationDetailTabs
            section={typeDetailSection}
            options={tabs}
            handleChangeOption={handleDetailSection}
            dataDetail={detail_paymentRelation?.result}
            subjectAccountNumber={data_accountDetail?.accountSummary?.accountNumber}
            dispatch={dispatch}
            id={idPr}
          />
        </div>

        <div>
          <div className="flex justify-between">
            <ButtonComponent
              type={"submit"}
              onClick={() => navigate(-1)}
              icon={
                <LeftOutlined
                  style={{
                    color: "#fff",
                    fontSize: 24,
                    justifyItems: "center",
                  }}
                />
              }
            >
              Back
            </ButtonComponent>
            {isApproval && (
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
            )}
          </div>
        </div>
      </Spin>
      <ModalApproveOrReject
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
