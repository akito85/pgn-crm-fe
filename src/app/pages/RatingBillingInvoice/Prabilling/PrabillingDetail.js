import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Spin } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import BreadCrumb from "../../../../components/BreadCrumb";
import RadioTabs from "../../../../components/RadioTabs";
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
  const [tabHeader, setTabHeader] = useState("Prabilling Information");

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

  const dataTabs = [
    { value: "Prabilling Information" },
    { value: "Prabilling Log" },
  ];

  const changeTabHeader = (e) => {
    setTabHeader(e.target.value);
  };

  return (
    <Spin spinning={loading_detail_prabilling}>
      <LayoutMenu>
        <BreadCrumb routes={routes} />
        
        <div className={"w-full justify-start mt-5"}>
          <RadioTabs
            data={dataTabs}
            onChange={changeTabHeader}
            currentPosition={tabHeader}
          />
        </div>

        {tabHeader === "Prabilling Information" ? (
          <PrabillingDetailInformation
            data={detail_prabilling_init}
            tabHeader={tabHeader}
          />
        ) : (
          <PrabillingDetailLog
            data={detail_prabilling_init}
            tabHeader={tabHeader}
          />
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

export default PrabillingDetail;