import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LeftOutlined } from "@ant-design/icons";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import { RBI_ROUTES } from "../../../../../routes/rating_billing/rbi_routes";
import DetailInformation from "./DetailInformation";
import {
  getDetailCalculationJob,
  resetCalculationDetail,
} from "../../../../../redux/slices/rating_billing_invoice/calculation";

const CalculationDetail = () => {
  // Selector
  const { detail_calculation_job } = useSelector(
    (state) => state.rbi_calculation
  );

  // Declaration
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const calJobId = location?.state?.id;

  // Use Effect
  useEffect(() => {
    if (calJobId) {
      dispatch(resetCalculationDetail());
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

  return (
    <>
      <BreadCrumb routes={routes} />

      <DetailInformation data={detail_calculation_job} />

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
    </>
  );
};

export default CalculationDetail;