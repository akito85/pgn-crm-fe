import React from "react";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import { RBI_ROUTES } from "../../../../../routes/rating_billing/rbi_routes";
import BreadCrumb from "../../../../../components/BreadCrumb";
import RadioTabs from "../../../../../components/RadioTabs";
import { useState } from "react";
import DetailInformation from "./DetailInformation";
import DetailLog from "./DetailLog";
import ButtonComponent from "../../../../../components/ButtonComponent";
import { LeftOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spin } from "antd";
import { getDetailCalculationJob } from "../../../../../redux/slices/rating_billing_invoice/calculation";

const CalculationDetail = () => {
  // Selector
  const { detail_calculation_job, loading } = useSelector(
    (state) => state.rbi_calculation
  );

  // Declaration
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const calJobId = location?.state?.id;

  // state
  const [tabHeader, setTabHeader] = useState("Calculation Information");

  // Use Effect
  useEffect(() => {
    if (calJobId) {
      dispatch(getDetailCalculationJob(calJobId));
    }
  }, [dispatch, calJobId]);

  const routes = [
    {
      path: "",
      breadcrumbName: "Rating Billing",
    },
    {
      path: RBI_ROUTES.CALCULATION_VIEW,
      breadcrumbName: "Calculation",
    },
    {
      path: RBI_ROUTES.CALCULATION_DETAIL,
      breadcrumbName: "Detail Calculation",
    },
  ];
  const dataTabs = [
    { value: "Calculation Information" },
    { value: "Calculation Log" },
  ];
  const changeTabHeader = (e) => {
    setTabHeader(e.target.value);
  };

  return (
    <Spin spinning={loading}>
      <LayoutMenu>
        <BreadCrumb routes={routes} />
        <div className={"w-full justify-start mt-5"}>
          <RadioTabs
            data={dataTabs}
            onChange={changeTabHeader}
            currentPosition={tabHeader}
          />
        </div>
        {tabHeader === "Calculation Information" ? (
          <DetailInformation
            data={detail_calculation_job}
            tabHeader={tabHeader}
          />
        ) : (
          <DetailLog data={detail_calculation_job} tabHeader={tabHeader} />
        )}
        <div className={"w-full flex justify-start my-5"}>
          <ButtonComponent
            type={"submit"}
            border={false}
            icon={
              <LeftOutlined
                style={{
                  color: "#fff",
                  fontSize: 16,
                  justifyItems: "left",
                }}
              />
            }
            onClick={() => navigate(-1)}
          >
            Back
          </ButtonComponent>
        </div>
      </LayoutMenu>
    </Spin>
  );
};

export default CalculationDetail;
