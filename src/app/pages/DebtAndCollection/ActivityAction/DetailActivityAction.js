/* eslint-disable default-case */
import BreadCrumb from "../../../../components/BreadCrumb.js";
import { DEBT_AND_COLLECTION_ROUTES } from "../../../../routes/DebtAndCollection/rc_routes.js";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getDetailActivityActionPaginate } from "../../../../redux/slices/debt_and_collection/activityAction";
import DetailText from "../../../../components/DetailText";
import BaseContainer from "../../../../components/BaseContainer";
import { Spin } from "antd";
import ButtonComponent from "../../../../components/ButtonComponent";
import { LeftOutlined } from "@ant-design/icons";

const DetailActivityAction = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const id = location?.state?.id;
  const { dataDetailActivityAction,  loading } = useSelector((state) => state.activityAction);

  useEffect(() => {
    if (id) {
      // console.log("id", id);
      dispatch(getDetailActivityActionPaginate(id));
    }
  }, [dispatch, id]);

  const routes = [
    {
      path: "",
      breadcrumbName: "Debt & Collection",
    },
    {
      path: DEBT_AND_COLLECTION_ROUTES.VIEW_ACTIVITY_ACTION,
      breadcrumbName: "Activity Action",
    },
    {
      path: DEBT_AND_COLLECTION_ROUTES.DETAIL_ACTIVITY_ACTION,
      breadcrumbName: `Detail`,
    },
  ];
  return (
    <>
      <BreadCrumb routes={routes} />
      <Spin spinning={loading}>
        <BaseContainer header={"Detail Activity Action"}>
          <div className="w-full grid grid-cols-4 gap-3">
            <DetailText label={"Activity Name"}>{dataDetailActivityAction?.activityName}</DetailText>
          </div>
          <div className="w-full grid grid-cols-4 gap-3">
            <DetailText label={"Result Code"}>{dataDetailActivityAction?.resultCode}</DetailText>
          </div>
          <div className="w-full grid grid-cols-4 gap-3">
            <DetailText label={"Description"}>{dataDetailActivityAction?.description}</DetailText>
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

export default DetailActivityAction;
