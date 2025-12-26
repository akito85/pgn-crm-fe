import { LeftOutlined } from "@ant-design/icons";
import { Spin, Tabs } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import BaseContainer from "../../../../../../components/BaseContainer";
import BreadCrumbAdvanced from "../../../../../../components/BreadCrumbAdvanced";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import DetailText from "../../../../../../components/DetailText";
import LayoutMenu from "../../../../../../components/SidebarMenu/LayoutMenu";
import StatusComponent from "../../../../../../components/StatusComponent";
import {
  downloadAttachment,
  getAttachmentList,
  getRelationshipDetail
} from "../../../../../../redux/slices/account_management/detailAccount/relationshipSlice";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../routes/account_management/customer_account_routes";
import { dateFormatting } from "../../../../../../utils";
import HeaderDetail from "../../HeaderDetail";
import RelationshipAttachment from "./RelationshipAttachment";

const { TabPane } = Tabs;

const RelationshipDetail = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  // Get params from location state
  const idAccount = location?.state?.idAccount;
  const idRelationship = location?.state?.idRelationship;
  const idCustomer = location?.state?.idCustomer;
  const type = location?.state?.type || "standard";

  const { data_relationshipDetail, loadingDetail, data_attachmentList } = useSelector(
    (state) => state.relationship
  );

  const [data, setData] = useState({});
  const [attachmentData, setAttachmentData] = useState([]);

  // Fetch relationship detail
  useEffect(() => {
    if (idAccount && idRelationship) {
      dispatch(
        getRelationshipDetail({
          idAccount,
          idRelationship,
        })
      );
      // Fetch attachments
      dispatch(
        getAttachmentList({
          idAccount,
          idRelationship,
        })
      );
    }
  }, [dispatch, idAccount, idRelationship]);

  // Update local data when API response changes
  useEffect(() => {
    if (data_relationshipDetail && Object.keys(data_relationshipDetail).length > 0) {
      setData(data_relationshipDetail);
    }
  }, [data_relationshipDetail]);

  // Update attachment data
  useEffect(() => {
    if (data_attachmentList && data_attachmentList.length > 0) {
      const formattedAttachments = data_attachmentList.map((item, index) => ({
        key: index + 1,
        type: item.fileCategoryName || item.categoryName || item.type || "-",
        fileName: item.fileName || "-",
        fileSize: item.fileSize || 0,
        fileId: item.fileId || item.id,
        urlFile1: item.urlFile1,
        fileType: item.fileType,
        dataType: "exist",
      }));
      setAttachmentData(formattedAttachments);
    }
  }, [data_attachmentList]);

  // Handle download attachment
  const handleDownloadAttachment = (record) => {
    if (record.urlFile1 || record.fileId) {
      dispatch(
        downloadAttachment({
          idAccount,
          idFile: record.fileId,
          urlFile1: record.urlFile1,
          fileName: record.fileName,
        })
      );
    }
  };

  // Breadcrumb configuration
  const routes = () => {
    return [
      {
        path: "",
        breadcrumbName: "Account Management",
      },
      {
        path:
          type === "standard"
            ? ACCOUNT_MANAGEMENT_ROUTES.VIEW_ACCOUNT_STANDARD
            : ACCOUNT_MANAGEMENT_ROUTES.VIEW_ACCOUNT_ONETIME,
        breadcrumbName:
          type === "standard" ? "Account - Standard" : "Account - One Time",
      },
      {
        path:
          type === "standard"
            ? ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_STANDARD
            : ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_ONETIME,
        breadcrumbName: "Detail Account",
        state: {
          idAccount: idAccount,
        },
      },
      {
        path: "",
        breadcrumbName: "Detail Relationship",
      },
    ];
  };

  return (
    <LayoutMenu>
      <Spin spinning={loadingDetail} className={"w-full top-20"}>
        <BreadCrumbAdvanced routes={routes()} />

        <div className="w-full">
          <HeaderDetail
            data_header={["CUSTOMER INFORMATION", "ACCOUNT INFORMATION"]}
            dispatch={dispatch}
            idAccount={idAccount}
            idCustomer={idCustomer}
            type={type}
          />
        </div>

        {/* Tabs for Relationship Information and Attachment */}
        <Tabs defaultActiveKey="1" className="mt-4">
          <TabPane tab="Relationship Information" key="1">
            {/* Relationship Information Section */}
            <BaseContainer header={"RELATIONSHIP INFORMATION"}>
              <div className="flex flex-col gap-5">
                <div className="w-full grid grid-cols-3 gap-5">
                  <DetailText label="Relationship Type">
                    {data?.relationshipTypeName
                      ? data.relationshipTypeName.toUpperCase()
                      : "-"}
                  </DetailText>
                  <DetailText label="Relationship Category">
                    {data?.relationshipCategoryName
                      ? data.relationshipCategoryName.toUpperCase()
                      : "-"}
                  </DetailText>
                  <DetailText label="Related Name">
                    {data?.subjectName || data?.objectName || "-"}
                  </DetailText>
                </div>

                <div className="w-full grid grid-cols-3 gap-5">
                  <DetailText label="Related Number">
                    {data?.subjectValue || data?.objectValue || "-"}
                  </DetailText>
                  <DetailText label="Start Date">
                    {data?.startDate
                      ? moment(data.startDate).format("DD MMM YYYY")
                      : "-"}
                  </DetailText>
                  <DetailText label="End Date">
                    {data?.endDate
                      ? moment(data.endDate).format("DD MMM YYYY")
                      : "-"}
                  </DetailText>
                </div>

                <div className="w-full grid grid-cols-3 gap-5">
                  <DetailText label="Status">
                    <div className="flex items-center">
                      <StatusComponent colour={data?.status}>
                        {data?.status || "-"}
                      </StatusComponent>
                    </div>
                  </DetailText>
                </div>

                <div className="w-full mt-4">
                  <DetailText label="Description">
                    {data?.description || "-"}
                  </DetailText>
                </div>
              </div>
            </BaseContainer>

            {/* History Log Information */}
            <BaseContainer header={"HISTORY LOG INFORMATION"}>
              <div className="w-full grid grid-cols-5 gap-5">
                <DetailText label="Record Id">{data?.id || "-"}</DetailText>
                <DetailText label="Created Date">
                  {data?.createdDate
                    ? moment(data.createdDate).format(dateFormatting.dateTime)
                    : "-"}
                </DetailText>
                <DetailText label="Created By">
                  {data?.createdBy || "-"}
                </DetailText>
                <DetailText label="Updated Date">
                  {data?.updatedDate
                    ? moment(data.updatedDate).format(dateFormatting.dateTime)
                    : "-"}
                </DetailText>
                <DetailText label="Updated By">
                  {data?.updatedBy || "-"}
                </DetailText>
              </div>
            </BaseContainer>
          </TabPane>

          <TabPane tab="Attachment" key="2">
            {/* Attachment Section */}
            <BaseContainer header={"ATTACHMENT"}>
              <RelationshipAttachment
                data={attachmentData}
                hideActions={true}
                showUploadButton={false}
                onDownload={handleDownloadAttachment}
              />
            </BaseContainer>
          </TabPane>
        </Tabs>

        {/* Back Button */}
        <div className="my-5 flex">
          <Link
            to={
              type === "standard"
                ? ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_STANDARD
                : ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_ONETIME
            }
            state={{
              section: "Relationship",
              idAccount: idAccount,
              idCustomer: idCustomer,
            }}
          >
            <ButtonComponent
              type={"submit"}
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
          </Link>
        </div>
      </Spin>
    </LayoutMenu>
  );
};

export default RelationshipDetail;
