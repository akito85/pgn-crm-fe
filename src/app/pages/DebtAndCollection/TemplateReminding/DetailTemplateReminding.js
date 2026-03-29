/* eslint-disable default-case */
import BreadCrumb from "../../../../components/BreadCrumb.js";
import { DEBT_AND_COLLECTION_ROUTES } from "../../../../routes/DebtAndCollection/rc_routes.js";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getDetailTemplateRemindingPaginate } from "../../../../redux/slices/debt_and_collection/templateReminding";
import DetailText from "../../../../components/DetailText";
import BaseContainer from "../../../../components/BaseContainer";
import { Spin } from "antd";
import ButtonComponent from "../../../../components/ButtonComponent";
import { LeftOutlined } from "@ant-design/icons";

const ListDetailTemplateReminding = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const id = location?.state?.id;
  const { dataDetailTemplateReminding,  loading } = useSelector((state) => state.templateReminding);

  useEffect(() => {
    if (id) {
      // console.log("id", id);
      dispatch(getDetailTemplateRemindingPaginate(id));
    }
  }, [dispatch, id]);

  const routes = [
    {
      path: "",
      breadcrumbName: "Debt & Collection",
    },
    {
      path: DEBT_AND_COLLECTION_ROUTES.VIEW_TEMPLATE_REMINDING,
      breadcrumbName: "Template Reminding",
    },
    {
      path: DEBT_AND_COLLECTION_ROUTES.DETAIL_TEMPLATE_REMINDING,
      breadcrumbName: `Detail`,
    },
  ];
  return (
    <>
      <BreadCrumb routes={routes} />
      <Spin spinning={loading}>
        <BaseContainer header={"Detail Template Reminding"}>
          <div className="w-full grid grid-cols-4 gap-3">
            <DetailText label={"Type"}>{dataDetailTemplateReminding?.remindingType}</DetailText>
            <DetailText label={"Content"}>{dataDetailTemplateReminding?.content}</DetailText>
          </div>
          <div className="w-full grid grid-cols-4 gap-3">
            <DetailText label={"Email Subject"}>{dataDetailTemplateReminding?.emailSubject}</DetailText>
            <DetailText label={"Email Body"}>{dataDetailTemplateReminding?.emailBody}</DetailText>
            <DetailText label={"Template Code"}>{dataDetailTemplateReminding?.templateCode}</DetailText>
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

export default ListDetailTemplateReminding;
