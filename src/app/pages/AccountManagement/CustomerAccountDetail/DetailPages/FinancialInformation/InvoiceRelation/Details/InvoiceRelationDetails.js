import { useEffect } from "react";
import BreadCrumb from "../../../../../../../../components/BreadCrumb";
import LayoutMenu from "../../../../../../../../components/SidebarMenu/LayoutMenu";
import { useSelector, useDispatch } from "react-redux";
import { Spin } from "antd";
import ButtonComponent from "../../../../../../../../components/ButtonComponent";
import { LeftOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import InvoiceRelationDetailTabs from "./InvoiceRelationDetailTabs";
import { getCustomerDetail } from "../../../../../../../../redux/slices/account_management/Customer/customerAccount";
import moment from "moment";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../../../routes/account_management/customer_account_routes";
import { dateFormatting } from "../../../../../../../../utils";
import { getAccountStandardDetail, getGrantedAccessAccount } from "../../../../../../../../redux/slices/account_management/accountManagement";
import BaseContainer from "../../../../../../../../components/BaseContainer";
import DetailText from "../../../../../../../../components/DetailText";
import { getDetailInvoiceRelation, getInvoiceRelationAttachment, approveOrRejectInvoiceRelation, approveOrRejectInactiveInvoiceRelation } from "../../../../../../../../redux/slices/account_management/detailAccount/InvoiceRelationSlice";
import ModalApproveOrReject from "../../../../../../../../components/Modal/ModalApproveOrReject";
import { showModalError } from "../../../../../../../../redux/slices/general_slice";
import NxCardContainer from "../../../../../../../../components/Nx/NxCardContainer";

const InvoiceRelationDetails = ({
  type = "standard"
}) => {
  const dispatch = useDispatch();

  const { detail_invoiceRelation, data_invoiceRelationAttachment } = useSelector(
    (state) => state.invoiceRelation
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
  const idIr = location?.state?.id;

  //state
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
      breadcrumbName: "Invoice Relation",
    },
    {
      path: "",
      breadcrumbName: "Detail",
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
    if (detail_invoiceRelation) {

      const body = [{
        id: detail_invoiceRelation.id,
        approvalId: detail_invoiceRelation.tappId,
        action: action.toUpperCase(),
        description,
      }];

      if (detail_invoiceRelation.approvalType === "INVOICE_RELATION") {
        dispatch(approveOrRejectInvoiceRelation({
          body,
          action,
        }))
        .unwrap()
        .then(() => {
          dispatch(getDetailInvoiceRelation(idIr));
          handleClear();
          handleApprovalModal(false);
        })
        .catch(() => {});
      } else if (detail_invoiceRelation.approvalType === "INACTIVE_INVOICE_RELATION") {
        dispatch(approveOrRejectInactiveInvoiceRelation({
          body,
          action,
        }))
        .unwrap()
        .then(() => {
          dispatch(getDetailInvoiceRelation(idIr));
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
    console.log({idAccount, idCustomer})
    if (idAccount && idCustomer) {
      dispatch(getAccountStandardDetail({ idAccount, idCustomer }));
    }
  }, [idAccount, idCustomer]);

  useEffect(() => {
    if (idIr) {
      dispatch(getDetailInvoiceRelation(idIr));
      dispatch(getInvoiceRelationAttachment({ id: idIr }));
    }
  }, [idIr])

  useEffect(() => {
    if (detail_invoiceRelation) {
      const { approvalType } = detail_invoiceRelation;

      if (approvalType === "INVOICE_RELATION" || approvalType === "INACTIVE_INVOICE_RELATION")
        setIsApproval(true);
      else
        setIsApproval(false);
    }
  }, [detail_invoiceRelation]);

  return (
    <LayoutMenu>
      <Spin spinning={isLoading} className={"w-full top-20"}>
        <BreadCrumb routes={routes} />
        
        <NxCardContainer header={"CUSTOMER & ACCOUNT INFORMATION"}>
          <div className="flex flex-col gap-y-4">
            <BaseContainer border header={"CUSTOMER INFORMATION"}>
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
            </BaseContainer>
            <BaseContainer border header={"ACCOUNT INFORMATION"}>
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
            </BaseContainer>
          </div>
        </NxCardContainer>

        <InvoiceRelationDetailTabs
          dataDetail={detail_invoiceRelation}
          dataAttachment={data_invoiceRelationAttachment}
          subjectAccountNumber={data_accountDetail?.accountSummary?.accountNumber}
          dispatch={dispatch}
        />

        <NxCardContainer header={"HISTORY LOG INFORMATION"}>
          <div className="w-full grid grid-cols-5 gap-4">
            {/* History Log Information */}
            <DetailText label="Record Id">{detail_invoiceRelation.id}</DetailText>
            <DetailText label="Created Date">{detail_invoiceRelation.createdDate ? moment(detail_invoiceRelation.createdDate, dateFormatting.meas_date).format(dateFormatting.dateTime) : ""}</DetailText>
            <DetailText label="Created By">{detail_invoiceRelation.createdBy}</DetailText>
            <DetailText label="Updated Date">{detail_invoiceRelation.updatedDate ? moment(detail_invoiceRelation.updatedDate, dateFormatting.meas_date).format(dateFormatting.dateTime) : ""}</DetailText>
            <DetailText label="Updated By">{detail_invoiceRelation.updatedBy}</DetailText>
          </div>
        </NxCardContainer>

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
        customMessage={`Are you sure you want to ${approveOrReject} invoice relation - ${detail_invoiceRelation?.relatedAccountNumber}?`}
        onFinish={({ remark }, handleClear) => handleApproveOrReject(remark, approveOrReject, handleClear)}
      />
    </LayoutMenu>
  );
};

export default InvoiceRelationDetails;
