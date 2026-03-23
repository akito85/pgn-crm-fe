/* eslint-disable default-case */
import BreadCrumb from "../../../../components/BreadCrumb.js";
import { DEBT_AND_COLLECTION_ROUTES } from "../../../../routes/DebtAndCollection/rc_routes.js";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getDetailActivity,downloadEvidence } from "../../../../redux/slices/debt_and_collection/activities.js";
import DetailText from "../../../../components/DetailText";
import BaseContainer from "../../../../components/BaseContainer";
import { Spin } from "antd";
import ButtonComponent from "../../../../components/ButtonComponent";
import { DownloadOutlined, LeftOutlined } from "@ant-design/icons";

const DetailActivityAction = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const id = location?.state?.id;
  const { dataDetailActivities,  loading } = useSelector((state) => state.activities);

  const handleDownload = (id) => {
      console.log("Download clicked for ID:", id);
      dispatch(downloadEvidence({ id: id }))
    }

  useEffect(() => {
    if (id) {
      console.log("id", id); 
      dispatch(getDetailActivity(id));
    }
  }, [dispatch, id]);

  const routes = [
    {
      path: "",
      breadcrumbName: "Debt & Collection",
    },
    {
      path: DEBT_AND_COLLECTION_ROUTES.VIEW_ACTIVITY_ACTION,
      breadcrumbName: "Activity",
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
        <BaseContainer header={"Detail Activity"}>
          {/* Row 1 */}
          <div className="w-full flex gap-5">
            <div className="w-full flex-col">
              <DetailText label="Account Number">
                {dataDetailActivities?.accountNum}
              </DetailText>
            </div>
            <div className="w-full flex-col">
              <DetailText label="Date">
                {dataDetailActivities?.date}
              </DetailText>
            </div>
          </div>

          {/* Row 2 */}
          <div className="w-full flex gap-5">
            <div className="w-full flex-col">
              <DetailText label="Customer Name">
                {dataDetailActivities?.picCustomer}
              </DetailText>
            </div>
            <div className="w-full flex-col">
              <DetailText label="Internal PIC">
                {dataDetailActivities?.internalPicName}
              </DetailText>
            </div>
          </div>

          {/* Row 3 */}
          <div className="w-full flex gap-5">
            <div className="w-full flex-col">
              <DetailText label="Activity Name">
                {dataDetailActivities?.activityName}
              </DetailText>
            </div>
            <div className="w-full flex-col">
              <DetailText label="Activity Action">
                {dataDetailActivities?.activityActionName}
              </DetailText>
            </div>
          </div>

          {/* Row 4 */}
          <div className="w-full flex gap-5">
            <div className="w-full flex-col">
              <DetailText label="Period">
                {dataDetailActivities?.period}
              </DetailText>
            </div>
            <div className="w-full flex-col">
              <DetailText label="Action Date">
                {dataDetailActivities?.actionDate}
              </DetailText>
            </div>
          </div>

          {/* Row 5 */}
          <div className="w-full flex gap-5">
            <div className="w-full flex-col">
              <DetailText label="Result Date">
                {dataDetailActivities?.resultDate}
              </DetailText>
            </div>
            <div className="w-full flex-col">
              <DetailText label="Result">
                {dataDetailActivities?.result}
              </DetailText>
            </div>
          </div>

          {/* Evidence */}
          <div className="w-full">
            <DetailText label="Evidence File">
              {dataDetailActivities?.evidence ? (
                <div className="flex items-center gap-2">

                  <ButtonComponent
                    type={"submit"}
                    size={"small"}
                    onClick={() => handleDownload(dataDetailActivities?.id)}
                    fontSizeClassname="text-[12px]"
                    icon={
                      <DownloadOutlined
                        style={{
                          color: "#fff",
                          fontSize: 14, // kecil
                        }}
                      />
                    }
                    className="w-auto px-2"
                  >
                    {dataDetailActivities.evidence}
                  </ButtonComponent>
                </div>
              ) : (
                "-"
              )}
            </DetailText>
          </div>
        </BaseContainer>
      </Spin>
      <div className="flex  justify-between py-5">
        <ButtonComponent
          type={"submit"}
          onClick={() => navigate(DEBT_AND_COLLECTION_ROUTES.VIEW_ACTIVITIES, { state: { accountNum: dataDetailActivities?.accountNum } })}
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
