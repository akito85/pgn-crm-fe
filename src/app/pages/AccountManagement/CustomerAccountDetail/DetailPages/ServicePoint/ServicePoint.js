import React, { useEffect, useRef } from "react";
import { Spin } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import RadioTabs from "../../../../../../components/RadioTabs";
import ServicePointAsset from "./ServicePointAsset";
import HeaderServicePoint from "./HeaderServicePoint";
import LayoutMenu from "../../../../../../components/SidebarMenu/LayoutMenu";
import BreadCrumbAdvanced from "../../../../../../components/BreadCrumbAdvanced";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../routes/account_management/customer_account_routes";
import HeaderDetail from "../../HeaderDetail";
import { LeftOutlined } from "@ant-design/icons";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import { useDispatch, useSelector } from "react-redux";
import { getDetailServicePoint } from "../../../../../../redux/slices/account_management/detailAccount/ServicePoint";
import { getGrantedAccessAccount } from "../../../../../../redux/slices/account_management/accountManagement";

const listServicePointPage = [
  { value: "Asset Assignment" },
  { value: "Activity", disabled: true },
  // { value: "Update Asset Assignment" },
];

const ServicePoint = () => {
  //declare
  const navigate = useNavigate();
  const location = useLocation();
  const id = location?.state?.id;
  const idAccount = location?.state?.idAccount;
  const idCustomer = location?.state?.idCustomer;
  const type = location?.state?.type;
  const status = location?.state?.status;

  const dispatch = useDispatch();
  const { data_detailServicePoint, loading } = useSelector(
    (state) => state.servicePoint
  );
  const { access_account } = useSelector(
    (state) => state.accountManagement
    );

  // Use State
  useEffect(() => {
    if(location?.pathname.includes('account-standard')) {
      dispatch(getGrantedAccessAccount('/account-management/account-standard/service-point/asset'))
    }else{
      dispatch(getGrantedAccessAccount('/account-management/account-onetime/service-point/asset'))
    }
  }, [dispatch])

  //useEffect
  useEffect(() => {
    if (id) {
      dispatch(getDetailServicePoint(id));
    }
  }, [dispatch, id]);

  //getHeaderDetailId

  const [servicePage, setServicePointPage] = useState(
    listServicePointPage[0].value
  );

  const handleServicePointPage = (e) => {
    setServicePointPage(e.target.value);
  };

  const renderSection = () => {
    switch (servicePage) {
      case listServicePointPage[0].value:
        return (
          <ServicePointAsset
            id={id}
            dispatch={dispatch}
            idAccount={idAccount}
            idCustomer={idCustomer}
            type={type}
            status={status}
            access={access_account}
          />
        );
      // case listServicePointPage[1].value:
      //   return <ServicePointActivity />;
      // case listServicePointPage[1].value:
      //   return (
      //     <ServicePointAssetAssign
      //       handleChangeInteraction={handleChangeInteraction}
      //       handleServicePointPage={handleServicePointPage}
      //     />
      //   );
      default:
        return <></>;
    }
  };
  const routes = (id) => {
    return [
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
          type == "standard" ? "Account Standard" : "Account One Time",
      },
      {
        path:
          type == "standard"
            ? ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_STANDARD
            : ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_ONETIME,
        breadcrumbName: "Detail Account",
        state: {
          idAccount: id,
        }
      },
      {
        path: "",
        breadcrumbName: "Detail Service Point",
      },
    ];
  }

  return (
    <Spin spinning={loading}>
      <LayoutMenu>
        <BreadCrumbAdvanced routes={routes(idAccount)} />

        <div className="w-full mb-5">
          <HeaderDetail
            dispatch={dispatch}
            data_header={["CUSTOMER INFORMATION", "ACCOUNT INFORMATION"]}
            idAccount={idAccount}
            idCustomer={idCustomer}
            type={type}
          />
        </div>

        <HeaderServicePoint data={data_detailServicePoint} />

        <div className="mt-5">
          <RadioTabs
            data={listServicePointPage}
            onChange={handleServicePointPage}
          />
        </div>

        <div className={"w-full"}>{renderSection()}</div>

        <div className="my-5 flex">
          <Link
            to={
              type === "standard"
                ? ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_STANDARD
                : ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_ONETIME
            }
            state={{
              section: "Premise",
              idAccount: idAccount,
              idCustomer: idCustomer,
            }}
          >
            <ButtonComponent
              type={"submit"}
              // onClick={() => {
              //   navigate(-1);
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
      </LayoutMenu>
    </Spin>
  );
};

export default ServicePoint;
