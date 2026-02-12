import DetailText from "../../../../../../../components/DetailText";
import RelationshipApproval from "./../CreateUpdate/StepContents/ApprovalForm/RelationshipApproval";
import RelationshipAttachment from "./../RelationshipAttachment";
import { Button, Divider, Form } from "antd";
import { downloadAttachment } from "../../../../../../../redux/slices/account_management/detailAccount/relationshipSlice";
import InputComponent from "../../../../../../../components/InputComponent";
import { requiredMessage } from "../../../../../../../utils";

const ConfirmationModal = ({
  data = {},
  approvalData = [],
  attachmentData = [],
  approvalHierarchyName = "",
  idAccount,
  dispatch,
  activeTab,
  setActiveTab,
  isDraftSubmission,
}) => {
  // Handle download for existing attachments
  const handleDownloadAttachment = (record) => {
    if ((record.urlFile1 || record.fileId) && dispatch) {
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

  const renderContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <div className={`${activeTab !== 0 ? "hidden" : ""}`}>
            <div className="text-primary text-sm font-bold uppercase mb-4">
              RELATIONSHIP INFORMATION
            </div>
            <div className="w-full grid grid-cols-3 gap-4">
              <DetailText label="Relationship Type">
                {data?.relationshipTypeName || "-"}
              </DetailText>
              <DetailText label="Relationship Category">
                {data?.relationshipCategoryName || "-"}
              </DetailText>
              <DetailText label="Related Name">
                {data?.relatedName || data?.objectName || "-"}
              </DetailText>
              <DetailText label="Related Number">
                {data?.relatedNumber || data?.objectValue || "-"}
              </DetailText>
              <DetailText label="Start Date">
                {data?.startDateDisplay || "-"}
              </DetailText>
              <DetailText label="End Date">
                {data?.endDateDisplay || "-"}
              </DetailText>
            </div>
            <div className="w-full mt-4">
              <DetailText label="Description">
                {data?.description || "-"}
              </DetailText>
            </div>
          </div>
        )
      
      case 1:
        return (
          <RelationshipApproval
            dataDetailApproval={approvalData}
            hideSelector={true}
            approvalHierarchyLabel={approvalHierarchyName}
            className={`${activeTab !== 1 ? "hidden" : ""}`}
          />
        )

      case 2:
        return (
          <RelationshipAttachment
            data={attachmentData}
            hideActions={true}
            showUploadButton={false}
            onDownload={handleDownloadAttachment}
            className={`${activeTab !== 2 ? "hidden" : ""}`}
          />
        )
      
      case 3:
        return (
          <div className={`${activeTab !== 3 ? "hidden" : ""}`}>
            <div className="flex">
              <div className="text-primary text-xs font-bold uppercase">
                REMARK
              </div>
              <span className={"pl-1"} style={{ color: "red" }}>
                *
              </span>
            </div>
            <Form.Item
              key="remark"
              name={"remark"}
              rules={[{ message: requiredMessage("Remark"), required: !isDraftSubmission }]}
              labelCol={{ span: 24 }}
            >
              <InputComponent
                group
                type="textarea"
                placeholder={"Type your remark"}
              />
            </Form.Item>
          </div>
        )
    }
  }

  return (
    <div className="w-full">
      {/* Custom Tab Buttons - Sesuai Design Figma */}
      <div className="flex gap-3 mb-6 border-b border-gray-200 pb-1">
        <Button
          onClick={() => setActiveTab(0)}
          size="large"
          type={activeTab === 0 ? "primary" : "default"}
        >
          Relationship Information
        </Button>
        <Button
          onClick={() => setActiveTab(1)}
          size="large"
          type={activeTab === 1 ? "primary" : "default"}
        >
          Approval
        </Button>
        <Button
          onClick={() => setActiveTab(2)}
          size="large"
          type={activeTab === 2 ? "primary" : "default"}
        >
          Attachment
        </Button>
        {
          !isDraftSubmission && (
            <Button
              onClick={() => setActiveTab(3)}
              size="large"
              type={activeTab === 3 ? "primary" : "default"}
            >
              Remark
            </Button>
          )
        }
      </div>
      <Divider />

      {/* Content */}
      <div className="w-full">{renderContent()}</div>
    </div>
  );
};

export default ConfirmationModal;

