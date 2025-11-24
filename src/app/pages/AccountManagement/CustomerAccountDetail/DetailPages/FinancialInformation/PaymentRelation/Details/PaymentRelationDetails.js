import React, { useEffect, useRef } from "react";
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
import { getGrantedAccessAccount } from "../../../../../../../../redux/slices/account_management/accountManagement";
import BaseContainer from "../../../../../../../../components/BaseContainer";
import DetailText from "../../../../../../../../components/DetailText";

const tabs = [
  { value: "Service Request" },
  { value: "Attachment" },
];

const PaymentRelationDetails = ({
  type = "standard"
}) => {
  const dispatch = useDispatch();
  const { data_customerDetail, loading, loadingAccount } = useSelector(
    (state) => state.customerAccount
  );

  const { data_accountDetail } = useSelector(
    (state) => state.accountManagement
  );
  
  const { access_account } = useSelector(
    (state) => state.accountManagement
  );
  const isLoading = loading || loadingAccount;

  // Change to global state later
  const data = {};

  //declare
  const navigate = useNavigate();
  const location = useLocation();
  const id = location?.state?.id;
  // const id = 7;

  //state
  const [typeDetailSection, setTypeDetailSection] = useState(tabs[0].value);

  useEffect(() => {
    dispatch(getGrantedAccessAccount('/account-management/customers/view/service-requests/details'))
  }, [dispatch])

  useEffect(() => {
    if (id) {
      dispatch(getCustomerDetail(id));
    }
  }, [dispatch, id]);

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

  const CustomerInformationDummy = {
    customerNumber: "CST009425",
    identificationType: "NPWP",
    customerIdentificationNumber: "9809149088941",
    customerName: "KERAMIK INTI",
    customerType: "Organization",
    description: "-",
    birthFoundedDate: "22-08-2022",
    birthFoundedPlace: "Jakarta",
    sex: "Male",
    maritialStatus: "Married",
    searchKey: "Keramik Inti Pusat",
  };

  const AccountInformationDummy = {
    accountNumber: "00899849211",
    registrationNumber: "00899849211467",
    accountName: "PT KERAMIK INTI 1",
    category: "External",
    sor: "SOR 3",
    costCenter: "015 - AREA BOGOR",
    meterReadingCodes: "0054",
    customerManagement: "CM Bogor 2",
    classificationType: "Related Party",
    segment: "KI",
    accountGroupType: "BRONZE1",
    premiseAddress: "JL. KEMBANG BULAN, No. 90, RT. 90, RW. 7, CIKINI, MENTENG, JAKARTA PUSAT, DKI JAKARTA, INDONESIA, 38963",
    subdistrict: "CIKINI",
    district: "MENTENG",
    city: "JAKARTA PUSAT",
    country: "INDONESIA",
    longitude: "-6.15330388502638",
    latitude: "106.74036886669953",
    status: "Active",
  };

  return (
    <LayoutMenu>
      <Spin spinning={isLoading} className={"w-full top-20"}>
        <BreadCrumb routes={routes} />
        
        <BaseContainer header={"CUSTOMER INFORMATION"}>
          <div className="w-full grid grid-cols-4 gap-4">
            {/* Customer Information */}
            <DetailText label="Customer Number">{data_customerDetail?.customerNumber || CustomerInformationDummy.customerNumber}</DetailText>
            <DetailText label="Identification Type">{data_customerDetail?.identificationType || CustomerInformationDummy.identificationType}</DetailText>
            <DetailText label="Customer Identification Number">{data_customerDetail?.customerIdentificationNumber || CustomerInformationDummy.customerIdentificationNumber}</DetailText>
            <DetailText label="Customer Name">{data_customerDetail?.customerName || CustomerInformationDummy.customerName}</DetailText>
            <DetailText label="Customer Type">{data_customerDetail?.customerType || CustomerInformationDummy.customerType}</DetailText>
            <DetailText label="Description">{data_customerDetail?.description || CustomerInformationDummy.description}</DetailText>
            <DetailText label="Birth/Founded Date">{data_customerDetail?.birthFoundedDate ? renderDate(data_customerDetail.birthFoundedDate) : renderDate(CustomerInformationDummy.birthFoundedDate)}</DetailText>
            <DetailText label="Birth/Founded Place">{data_customerDetail?.birthFoundedPlace || CustomerInformationDummy.birthFoundedPlace}</DetailText>
            <DetailText label="Sex">{data_customerDetail?.sex || CustomerInformationDummy.sex}</DetailText>
            <DetailText label="Maritial Status">{data_customerDetail?.maritialStatus || CustomerInformationDummy.maritialStatus}</DetailText>
            <DetailText label="Search Key">{data_customerDetail?.searchKey || CustomerInformationDummy.searchKey}</DetailText>
          </div>
        </BaseContainer>

        <BaseContainer header={"ACCOUNT INFORMATION"}>
          <div className="w-full grid grid-cols-4 gap-4">
            {/* Account Information */}
            <DetailText label="Account Number">{data_accountDetail?.accountNumber || AccountInformationDummy.accountNumber}</DetailText>
            <DetailText label="Registration Number">{data_accountDetail?.registrationNumber || AccountInformationDummy.registrationNumber}</DetailText>
            <DetailText label="Account Name">{data_accountDetail?.accountName || AccountInformationDummy.accountName}</DetailText>
            <DetailText label="Category">{data_accountDetail?.category || AccountInformationDummy.category}</DetailText>
            <DetailText label="SOR">{data_accountDetail?.sor || AccountInformationDummy.sor}</DetailText>
            <DetailText label="Cost Center">{data_accountDetail?.costCenter || AccountInformationDummy.costCenter}</DetailText>
            <DetailText label="Meter Reading Codes">{data_accountDetail?.meterReadingCodes ? renderDate(data_accountDetail.meterReadingCodes) : renderDate(AccountInformationDummy.birthFoundedDate)}</DetailText>
            <DetailText label="Customer Management">{data_accountDetail?.customerManagement || AccountInformationDummy.customerManagement}</DetailText>
            <DetailText label="Classification Type">{data_accountDetail?.classificationType || AccountInformationDummy.classificationType}</DetailText>
            <DetailText label="Segment">{data_accountDetail?.segment || AccountInformationDummy.segment}</DetailText>
            <DetailText label="Account Group Type">{data_accountDetail?.accountGroupType || AccountInformationDummy.accountGroupType}</DetailText>
            <DetailText label="Premise Address">{data_accountDetail?.premiseAddress || AccountInformationDummy.premiseAddress}</DetailText>
            <DetailText label="Subdistrict">{data_accountDetail?.subdistrict || AccountInformationDummy.subdistrict}</DetailText>
            <DetailText label="District">{data_accountDetail?.district || AccountInformationDummy.district}</DetailText>
            <DetailText label="City">{data_accountDetail?.city || AccountInformationDummy.city}</DetailText>
            <DetailText label="Country">{data_accountDetail?.country || AccountInformationDummy.country}</DetailText>
            <DetailText label="Longitude">{data_accountDetail?.longitude || AccountInformationDummy.longitude}</DetailText>
            <DetailText label="Latitude">{data_accountDetail?.latitude || AccountInformationDummy.latitude}</DetailText>
            <DetailText label="Status">{data_accountDetail?.status || AccountInformationDummy.status}</DetailText>
          </div>
        </BaseContainer>

        <div className="my-5">
          <PaymentRelationDetailTabs
            id={id}
            section={typeDetailSection}
            options={tabs}
            handleChangeOption={handleDetailSection}
          />
        </div>

        <div>
          <div className="mb-5 flex">
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
          </div>
        </div>
      </Spin>
    </LayoutMenu>
  );
};

export default PaymentRelationDetails;
