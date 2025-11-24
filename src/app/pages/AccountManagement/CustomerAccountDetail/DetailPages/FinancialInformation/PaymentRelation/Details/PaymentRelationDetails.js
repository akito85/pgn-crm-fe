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

  const PaymentRelationDummy = {
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

  return (
    <LayoutMenu>
      <Spin spinning={isLoading} className={"w-full top-20"}>
        <BreadCrumb routes={routes} />
        
        <BaseContainer header={"CUSTOMER INFORMATION"}>
          <div className="w-full grid grid-cols-4 gap-4">
            {/* Customer Information */}
            <DetailText label="Customer Number">{data?.customerNumber || PaymentRelationDummy.customerNumber}</DetailText>
            <DetailText label="Identification Type">{data?.identificationType || PaymentRelationDummy.identificationType}</DetailText>
            <DetailText label="Customer Identification Number">{data?.customerIdentificationNumber || PaymentRelationDummy.customerIdentificationNumber}</DetailText>
            <DetailText label="Customer Name">{data?.customerName || PaymentRelationDummy.customerName}</DetailText>
            <DetailText label="Customer Type">{data?.customerType || PaymentRelationDummy.customerType}</DetailText>
            <DetailText label="Description">{data?.description || PaymentRelationDummy.description}</DetailText>
            <DetailText label="Birth/Founded Date">{data?.birthFoundedDate ? renderDate(data.birthFoundedDate) : renderDate(PaymentRelationDummy.birthFoundedDate)}</DetailText>
            <DetailText label="Birth/Founded Place">{data?.birthFoundedPlace || PaymentRelationDummy.birthFoundedPlace}</DetailText>
            <DetailText label="Sex">{data?.sex || PaymentRelationDummy.sex}</DetailText>
            <DetailText label="Maritial Status">{data?.maritialStatus || PaymentRelationDummy.maritialStatus}</DetailText>
            <DetailText label="Search Key">{data?.searchKey || PaymentRelationDummy.searchKey}</DetailText>
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
