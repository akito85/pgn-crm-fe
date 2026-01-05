import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Spin, Tabs } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import BreadCrumb from "../../../../components/BreadCrumb";
import ButtonComponent from "../../../../components/ButtonComponent";
import { RBI_ROUTES } from "../../../../routes/rating_billing/rbi_routes";
import PrabillingDetailInformation from "./PrabillingDetailInformation";
import PrabillingDetailLog from "./PrabillingDetailLog";
import { getDetailPrabillingInit } from "../../../../redux/slices/rating_billing_invoice/praBilling";

const PrabillingDetail = () => {
  // Selector
  const { detail_prabilling_init, loading_detail_prabilling } = useSelector(
    (state) => state.rbi_prabilling
  );

  // Declaration
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const initId = location?.state?.id;

  // State
  const [activeTab, setActiveTab] = useState("information");

  useEffect(() => {
    if (initId) {
      dispatch(getDetailPrabillingInit(initId));
    }
  }, [dispatch, initId]);

  const routes = [
    {
      path: "",
      breadcrumbName: "Rating Billing",
    },
    {
      path: RBI_ROUTES.PRABILLING_VIEW,
      breadcrumbName: "Prabilling",
    },
    {
      path: RBI_ROUTES.PRABILLING_DETAIL,
      breadcrumbName: "Detail Prabilling",
    },
  ];

  const tabItems = [
    {
      key: "information",
      label: "Prabilling Information",
      children: (
        <PrabillingDetailInformation
          data={detail_prabilling_init}
          tabHeader="Prabilling Information"
        />
      ),
    },
    {
      key: "log",
      label: "Prabilling Log",
      children: (
        <PrabillingDetailLog
          data={detail_prabilling_init}
          tabHeader="Prabilling Log"
        />
      ),
    },
  ];

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  return (
      <LayoutMenu>
        <BreadCrumb routes={routes} />

        <div className="w-full">
          <Tabs
            activeKey={activeTab}
            items={tabItems}
            onChange={handleTabChange}
            style={{ marginBottom: '-24px' }}
          />
        </div>

        <div className="w-full flex justify-start mt-4">
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
      </LayoutMenu>
  );
};

export default PrabillingDetail;