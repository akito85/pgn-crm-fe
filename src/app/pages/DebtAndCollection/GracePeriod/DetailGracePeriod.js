/* eslint-disable default-case */
import BreadCrumb from "../../../../components/BreadCrumb.js";
import { DEBT_AND_COLLECTION_ROUTES } from "../../../../routes/DebtAndCollection/rc_routes.js";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getDetailGracePeriodPaginate } from "../../../../redux/slices/debt_and_collection/gracePeriod";
import DetailText from "../../../../components/DetailText";
import BaseContainer from "../../../../components/BaseContainer";
import { Spin } from "antd";
import ButtonComponent from "../../../../components/ButtonComponent";
import { LeftOutlined } from "@ant-design/icons";

const ListDetailGracePeriod = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const id = location?.state?.id;
  const { dataDetailGracePeriod,  loading } = useSelector((state) => state.gracePeriod);

  useEffect(() => {
    if (id) {
      // console.log("id", id);
      dispatch(getDetailGracePeriodPaginate(id));
    }
  }, [dispatch, id]);

  const routes = [
    {
      path: "",
      breadcrumbName: "Debt & Collection",
    },
    {
      path: DEBT_AND_COLLECTION_ROUTES.VIEW_GRACE_PERIOD,
      breadcrumbName: "Grace Period",
    },
    {
      path: DEBT_AND_COLLECTION_ROUTES.DETAIL_GRACE_PERIOD,
      breadcrumbName: `Detail`,
    },
  ];
  return (
    <>
      <BreadCrumb routes={routes} />
      <Spin spinning={loading}>
        <BaseContainer header={"Detail Grace Period"}>
          <div className="w-full grid grid-cols-4 gap-3">
            <DetailText label={"Customer Segment"}>{dataDetailGracePeriod?.customerSegment}</DetailText>
            <DetailText label={"Grace Period"}>{dataDetailGracePeriod?.gracePeriod}</DetailText>
          </div>
          <div className="w-full grid grid-cols-4 gap-3">
            <DetailText label={"Grace Period Unit"}>{dataDetailGracePeriod?.gracePeriodUnit}</DetailText>
            <DetailText label={"Description"}>{dataDetailGracePeriod?.description}</DetailText>
          </div>
        </BaseContainer>
      </Spin>
      <div className="flex  justify-between py-5">
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
    </>
  );
};

export default ListDetailGracePeriod;
