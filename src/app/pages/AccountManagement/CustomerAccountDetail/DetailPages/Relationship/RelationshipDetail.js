import { LeftOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import BaseContainer from "../../../../../../components/BaseContainer";
import BreadCrumbAdvanced from "../../../../../../components/BreadCrumbAdvanced";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import DetailText from "../../../../../../components/DetailText";
import LayoutMenu from "../../../../../../components/SidebarMenu/LayoutMenu";
import StatusComponent from "../../../../../../components/StatusComponent";
import RadioTabs from "../../../../../../components/RadioTabs";
import ModalApproveOrReject from "../../../../../../components/Modal/ModalApproveOrReject";
import {
  downloadAttachment,
  getAttachmentList,
  getRelationshipDetail,
  approveOrRejectRelationship,
  approveOrRejectInactiveRelationship
} from "../../../../../../redux/slices/account_management/detailAccount/relationshipSlice";
import { showModalError } from "../../../../../../redux/slices/general_slice";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../routes/account_management/customer_account_routes";
import { dateFormatting } from "../../../../../../utils";
import HeaderDetail from "../../HeaderDetail";
import RelationshipAttachment from "./RelationshipAttachment";
import RelatedDetailCard from "./RelationshipInformation/RelatedDetailCard";

const RelationshipDetail = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

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
  const [activeTab, setActiveTab] = useState("Relationship Information");
  const [isApproval, setIsApproval] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approveOrReject, setApproveOrReject] = useState("");

  // Tab options for RadioTabs
  const tabOptions = [
    { value: "Relationship Information" },
    { value: "Attachment" },
  ];

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

  useEffect(() => {
    if (data_relationshipDetail) {
      const { approvalType } = data_relationshipDetail;

      if (approvalType === "ACCOUNT_RELATIONSHIP" || approvalType === "INACTIVE_ACCOUNT_RELATIONSHIP")
        setIsApproval(true);
      else
        setIsApproval(false);
    }
  }, [data_relationshipDetail]);

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

  // Handle tab change
  const handleTabChange = (e) => {
    setActiveTab(e.target.value);
  };

  /**
   * @param {boolean} show
   * @param {"approve"|"reject"} action
   */
  const handleApprovalModal = (show, action) => {
    if (show) {
      setShowApprovalModal(true);
      setApproveOrReject(action);
    } else {
      setShowApprovalModal(false);
      setApproveOrReject("");
    }
  };

  /**
   * @param {"approve"|"reject"} action
   */
  const handleApproveOrReject = (description, action, handleClear) => {
    if (data_relationshipDetail) {
      const body = [{
        id: data_relationshipDetail.id,
        approvalId: data_relationshipDetail.tappId,
        action: action.toUpperCase(),
        description,
      }];

      if (data_relationshipDetail.approvalType === "ACCOUNT_RELATIONSHIP") {
        dispatch(approveOrRejectRelationship({
          idAccount,
          body,
          action: action.toUpperCase(),
        }))
        .unwrap()
        .then(() => {
          dispatch(getRelationshipDetail({
            idAccount,
            idRelationship,
          }));
          handleClear();
          handleApprovalModal(false);
        })
        .catch((error) => {
          dispatch(showModalError({
            title: "Failed",
            description: error.message || "An error occurred"
          }));
        });
      } else if (data_relationshipDetail.approvalType === "INACTIVE_ACCOUNT_RELATIONSHIP") {
        dispatch(approveOrRejectInactiveRelationship({
          idAccount,
          body,
          action: action.toUpperCase(),
        }))
        .unwrap()
        .then(() => {
          dispatch(getRelationshipDetail({
            idAccount,
            idRelationship,
          }));
          handleClear();
          handleApprovalModal(false);
        })
        .catch((error) => {
          dispatch(showModalError({
            title: "Failed",
            description: error.message || "An error occurred"
          }));
        });
      } else {
        const errorBody = {
          title: "Failed",
          description: `The approval type is invalid.`,
        };

        dispatch(showModalError(errorBody));
      }
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

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "Relationship Information":
        return (
          <>
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
                    {data?.subjectNumber || data?.objectNumber || ""}
                  </DetailText>
                  <DetailText label="Start Date">
                    {data?.startDate
                      ? moment(data.startDate).format("DD MMM YYYY")
                      : ""}
                  </DetailText>
                  <DetailText label="End Date">
                    {data?.endDate
                      ? moment(data.endDate).format("DD MMM YYYY")
                      : ""}
                  </DetailText>
                </div>

                <div className="w-full grid grid-cols-3 gap-5">
                  <DetailText label="Status">
                    <div className="flex items-center">
                      <StatusComponent colour={data?.status}>
                        {data?.status || ""}
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

            {/* Related Detail Section */}
            <RelatedDetailCard
              data={data?.relatedDetail || []}
              className="mt-4"
            />

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
          </>
        );
      case "Attachment":
        return (
          <RelationshipAttachment
            data={attachmentData}
            hideActions={true}
            showUploadButton={false}
            onDownload={handleDownloadAttachment}
          />
        );
      default:
        return null;
    }
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

        {/* Toggle Buttons for Relationship Information and Attachment */}
        <div className="mt-4 mb-4">
          <RadioTabs
            currentPosition={activeTab}
            data={tabOptions}
            onChange={handleTabChange}
          />
        </div>

        {/* Render content based on active tab */}
        {renderContent()}

        {/* Back Button */}
        <div className="my-5 flex">
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
            onClick={() => navigate(-1)}
          >
            Back
          </ButtonComponent>

          {isApproval && (
            <div className={"w-full flex justify-end gap-5"}>
              <ButtonComponent
                type="reject"
                onClick={() => handleApprovalModal(true, "reject")}
              >
                Reject
              </ButtonComponent>
              <ButtonComponent
                type="approve"
                onClick={() => handleApprovalModal(true, "approve")}
              >
                Approve
              </ButtonComponent>
            </div>
          )}
        </div>
      </Spin>
      <ModalApproveOrReject
        isOpen={showApprovalModal}
        header={approveOrReject === "approve" ? "Approve" : approveOrReject === "reject" ? "Reject" : ""}
        handleCloseModal={() => handleApprovalModal(false)}
        customMessage={`Are you sure you want to ${approveOrReject} relationship - ${data?.subjectName || data?.objectName || ""}?`}
        onFinish={({ remark }, handleClear) => handleApproveOrReject(remark, approveOrReject, handleClear)}
      />
    </LayoutMenu>
  );
};

export default RelationshipDetail;
