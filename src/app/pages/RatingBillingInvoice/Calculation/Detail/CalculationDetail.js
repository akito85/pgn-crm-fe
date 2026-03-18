import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Spin, Tabs } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import { RBI_ROUTES } from "../../../../../routes/rating_billing/rbi_routes";
import DetailInformation from "./DetailInformation";
import DetailLog from "./DetailLog";
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

  // State
  const [activeTab, setActiveTab] = useState("information");

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

  const tabItems = [
    {
      key: "information",
      label: "Calculation Information",
      children: (
        <DetailInformation
          data={detail_calculation_job}
          tabHeader="Calculation Information"
        />
      ),
    },
    {
      key: "log",
      label: "Calculation Log",
      children: (
        <DetailLog
          data={detail_calculation_job}
          tabHeader="Calculation Log"
        />
      ),
    },
  ];

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  return (
      <div>
        <BreadCrumb routes={routes} />

        <div className="w-full mt-0">
          <Tabs
            activeKey={activeTab}
            items={tabItems}
            onChange={handleTabChange}
          />
        </div>

        <div className="w-full flex justify-start">
          <ButtonComponent
            type="submit"
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
      </div>
  );
};

export default CalculationDetail;