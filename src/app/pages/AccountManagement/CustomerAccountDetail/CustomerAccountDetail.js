import React, { useEffect, useRef } from "react";
import BreadCrumb from "../../../../components/BreadCrumb";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import { useSelector, useDispatch } from "react-redux";
import { Spin } from "antd";
import ButtonComponent from "../../../../components/ButtonComponent";
import { LeftOutlined } from "@ant-design/icons";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../routes/account_management/customer_account_routes";
import HeaderDetail from "./HeaderDetail";
import { useState } from "react";
import AccountDetailInformation from "./AccountDetailInformation";
import { useNavigate, useLocation, Link } from "react-router-dom";

const data = [
  // { value: "Customer Information" },
  { value: "Account Information" }, //
  { value: "Last Activity", disabled: true },
  { value: "Billing", disabled: true },
  { value: "Receipt", disabled: true },
  { value: "Service Request", disabled: false },
  { value: "Account Statement", disabled: true },
  { value: "Pre Requisite", disabled: true },
  { value: "Account Address" }, //
  { value: "Account Contact" }, //
  { value: "Distribution Media" }, //
  { value: "Financial Information" }, //
  { value: "Premise" },
  { value: "Service Agreement" },
  { value: "Gas Source" },
  { value: "Gas Deposit", disabled: true },
  { value: "Compensation", disabled: true },
  { value: "Promo", disabled: true },
  { value: "Multi Destination", disabled: true },
  { value: "Additional Information", disabled: true  },
  { value: "Gas Utilization", disabled: true  },
  { value: "Equipment", disabled: true  },
  { value: "Raw Material Source", disabled: true  },
  { value: "Product Distribution", disabled: true  },
  { value: "User Access", disabled: true },
];

const CustomerAccountDetail = ({ type = "standard" }) => {

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.accountManagement);
  //declare
  const navigate = useNavigate();
  const location = useLocation();
  const id = location?.state?.idAccount;
  const idCustomer = location?.state?.idCustomer;
  const section = location?.state?.section;

  //state
  const [tabs, setTabs] = useState([]);

  useEffect(() => {
    if (type != "standard") {
      setTabs(
        data.filter(
          (item) =>
            item.value === "Account Information" ||
            item.value === "Account Address" ||
            item.value === "Account Contact" ||
            item.value === "Distribution Media" ||
            item.value === "Financial Information" ||
            item.value === "Last Activity" ||
            item.value === "Billing" ||
            item.value === "Receipt" ||
            item.value === "Account Statement" ||
            item.value === "Promo" ||
            item.value === "User Access"
        )
      );
    } else {
      setTabs(data);
    }
  }, [data, type]);

  const [typeAccountInfoDetailSection, setTypeAccountInfoDetailSection] =
    useState(section || data[0].value);

  const handleAccountInfoDetailSection = (e) => {
    setTypeAccountInfoDetailSection(e.target.value);
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
  ];

  return (
    <LayoutMenu>
      <Spin spinning={loading} className={"w-full justify-bottom"}>
        <BreadCrumb routes={routes} />
        <div className="w-full">
          <HeaderDetail
            data_header={["CUSTOMER INFORMATION", "ACCOUNT INFORMATION"]}
            dispatch={dispatch}
            idAccount={id}
            idCustomer={idCustomer}
            type={type}
          />
        </div>
        <div className="flex flex-col gap-3 mt-8">
          {/* {type.section === "" ? ( */}
          <div>
            <AccountDetailInformation
              id={id}
              section={typeAccountInfoDetailSection}
              options={tabs}
              handleChangeOption={handleAccountInfoDetailSection}
              idCustomer={idCustomer}
              type={type}
              setTypeAccountInfoDetailSection={setTypeAccountInfoDetailSection}
              dispatch = {dispatch}
              // handleChangeInteraction={handleSetType}
            />
            <div className="my-5 flex">
              <Link
                to={
                  type === "standard"
                    ? ACCOUNT_MANAGEMENT_ROUTES.VIEW_ACCOUNT_STANDARD
                    : ACCOUNT_MANAGEMENT_ROUTES.VIEW_ACCOUNT_ONETIME
                }
              >
                <ButtonComponent
                  type={"submit"}
                  // onClick={() => {
                  //   navigate(-1)
                  // }}
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
              </Link>
            </div>
          </div>
          {/* ) : (
           <UpdatePageInformation 
          type={type} 
          handleChangeInteraction={handleSetType}
          />
        )} */}
        </div>
      </Spin>
    </LayoutMenu>
  );
};

export default CustomerAccountDetail;
