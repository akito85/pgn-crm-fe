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
import { getDetailPaymentRelation } from "../../../../../../../../redux/slices/account_management/detailAccount/FinancialInformationSlice";

const tabs = [
  { value: "Service Request" },
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
  const idPr = location?.state?.idPr;

  //state
  const [typeDetailSection, setTypeDetailSection] = useState(tabs[0].value);
  const [isApproval, setIsApproval] = useState(false);

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
    if (idPr) {
      dispatch(getDetailPaymentRelation(idPr));
    }
  }, [idPr])

  useEffect(() => {
    if (detail_paymentRelation) {
      
    }
  }, [detail_paymentRelation])

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
            dataDetail={detail_paymentRelation?.data}
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
                  onClick={() => {}}
                >
                  Reject
                </ButtonComponent>
                <ButtonComponent
                  type="approve"
                  onClick={() => {}}
                >
                  Approve
                </ButtonComponent>
              </div>
            )}
          </div>
        </div>
      </Spin>
    </LayoutMenu>
  );
};

export default PaymentRelationDetails;
