/* eslint-disable default-case */
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu.js";
import BreadCrumb from "../../../../components/BreadCrumb.js";
import { DEBT_AND_COLLECTION_ROUTES } from "../../../../routes/DebtAndCollection/rc_routes.js";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getDetailActivityTypePaginate } from "../../../../redux/slices/debt_and_collection/activityType";
import DetailText from "../../../../components/DetailText";
import BaseContainer from "../../../../components/BaseContainer";
import { Spin } from "antd";
import ButtonComponent from "../../../../components/ButtonComponent";
import { LeftOutlined } from "@ant-design/icons";

const DetailActivityType = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const id = location?.state?.id;
  const { dataDetailActivityType,  loading } = useSelector((state) => state.activityType);

  useEffect(() => {
    if (id) {
      // console.log("id", id);
      dispatch(getDetailActivityTypePaginate(id));
    }
  }, [dispatch, id]);

  const routes = [
    {
      path: "",
      breadcrumbName: "Debt & Collection",
    },
    {
      path: DEBT_AND_COLLECTION_ROUTES.VIEW_ACTIVITY_TYPE,
      breadcrumbName: "Activity Type",
    },
    {
      path: DEBT_AND_COLLECTION_ROUTES.DETAIL_ACTIVITY_TYPE,
      breadcrumbName: `Detail`,
    },
  ];
  return (
    <LayoutMenu>
      <BreadCrumb routes={routes} />
      <Spin spinning={loading}>
        <BaseContainer header={"Detail Activity Type"}>
          <div className="w-full grid grid-cols-4 gap-3">
            <DetailText label={"Activity Type"}>{dataDetailActivityType?.activityType}</DetailText>
          </div>
          <div className="w-full grid grid-cols-4 gap-3">
            <DetailText label={"Description"}>{dataDetailActivityType?.description}</DetailText>
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
    </LayoutMenu>
  );
};

export default DetailActivityType;
