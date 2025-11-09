import React, { useEffect, useRef } from "react";
import BreadCrumb from "../../../../../../../components/BreadCrumb";
import LayoutMenu from "../../../../../../../components/SidebarMenu/LayoutMenu";
import { useSelector, useDispatch } from "react-redux";
import { Spin } from "antd";
import ButtonComponent from "../../../../../../../components/ButtonComponent";
import { LeftOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CustomerHeaderDetail from "../../../CustomerHeaderDetail";
import BaseContainer from "../../../../../../../components/BaseContainer";
import DetailText from "../../../../../../../components/DetailText";
import CustomerServiceRequestDetailTabs from "./CustomerServiceRequestDetailTabs";
import { getCustomerDetail } from "../../../../../../../redux/slices/account_management/Customer/customerAccount";
import moment from "moment";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../../routes/account_management/customer_account_routes";
import { dateFormatting } from "../../../../../../../utils";
import { getGrantedAccessAccount } from "../../../../../../../redux/slices/account_management/accountManagement";

const tabs = [
  { value: "Service Request" },
  { value: "Contact" },
  { value: "Pre-Requisite" },
  { value: "Work Order" },
  { value: "Attachment" },
];

const CustomerServiceRequestDetails = () => {
  const dispatch = useDispatch();
  const { data_customerDetail, loading, loadingAccount } = useSelector(
    (state) => state.customerAccount
    );
  const { access_account } = useSelector(
    (state) => state.accountManagement
  );
  const isLoading = loading || loadingAccount;

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
      path:ACCOUNT_MANAGEMENT_ROUTES.VIEW_CUSTOMER,
      breadcrumbName:"Customers",
    },
    {
      path:ACCOUNT_MANAGEMENT_ROUTES.VIEW_CUSTOMER,
      breadcrumbName:"Detail Customers",
    },
    {
      path:ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_SERVICE_REQUEST,
      breadcrumbName: "Service Request",
    },
    {
      path: "",
      breadcrumbName: "Detail Service Requests",
    },
  ];

  return (
    <LayoutMenu>
      <Spin spinning={isLoading} className={"w-full top-20"}>
        <BreadCrumb routes={routes} />
        <div className="my-5">
          <CustomerServiceRequestDetailTabs
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

export default CustomerServiceRequestDetails;
