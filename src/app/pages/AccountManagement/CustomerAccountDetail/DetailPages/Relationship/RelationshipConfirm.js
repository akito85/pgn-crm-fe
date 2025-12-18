import { useState } from "react";
import DetailText from "../../../../../../components/DetailText";
import RelationshipApproval from "./RelationshipApproval";
import RelationshipAttachment from "./RelationshipAttachment";
import { Button, Divider } from "antd";

const RelationshipConfirm = ({
  data = {},
  approvalData = [],
  attachmentData = [],
  approvalHierarchyName = "Hierarchy SA 1", // Nama approval hierarchy yang dipilih
}) => {
  const [activeTab, setActiveTab] = useState("1");

  const renderContent = () => {
    switch (activeTab) {
      case "1":
        return (
          <div>
            <div className="text-primary text-sm font-bold uppercase mb-4">
              RELATIONSHIP INFORMATION
            </div>
            <div className="w-full grid grid-cols-3 gap-4">
              <DetailText label="Direction Flag">
                {data?.directionFlag || "Forward"}
              </DetailText>
              <DetailText label="Relationship Type">
                {data?.relationshipType || "PARTNER OF"}
              </DetailText>
              <DetailText label="Relationship Category">
                {data?.relationshipCategory || "CUSTOMER"}
              </DetailText>
              <DetailText label="Related Name">
                {data?.relatedName || "PT XYZ"}
              </DetailText>
              <DetailText label="Related Number">
                {data?.relatedNumber || "00899849211"}
              </DetailText>
              <DetailText label="Start Date">
                {data?.startDate || "22 Aug 2022"}
              </DetailText>
              <DetailText label="End Date">
                {data?.endDate || "22 Aug 2022"}
              </DetailText>
            </div>
            <div className="w-full mt-4">
              <DetailText label="Description">
                {data?.description ||
                  "Lorem ipsum dolor sit amet consectetur. Malesuada turpis arcu morbi elit sed lorem at adipiscing imperdiet. Aliquam quis tempus feugiat amet. Viverra metus tincidunt nibh mauris nisl. At et etiam non dignissim ultricies tellus in lacus fermentum. Sollicitudin purus viverra tincidunt proin."}
              </DetailText>
            </div>
          </div>
        );
      case "2":
        return (
          <RelationshipApproval
            dataDetailApproval={approvalData}
            hideSelector={true}
            approvalHierarchyLabel={approvalHierarchyName}
          />
        );
      case "3":
        return (
          <RelationshipAttachment
            data={attachmentData}
            hideActions={true}
            showUploadButton={false}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      {/* Custom Tab Buttons - Sesuai Design Figma */}
      <div className="flex gap-3 mb-6 border-b border-gray-200 pb-1">
        <Button
          onClick={() => setActiveTab("1")}
          size="large"
          type={activeTab === "1" ? "primary" : "default"}
        >
          Relationship Information
        </Button>
        <Button
          onClick={() => setActiveTab("2")}
          size="large"
          type={activeTab === "2" ? "primary" : "default"}
        >
          Approval
        </Button>
        <Button
          onClick={() => setActiveTab("3")}
          size="large"
          type={activeTab === "3" ? "primary" : "default"}
        >
          Attachment
        </Button>
      </div>
      <Divider />

      {/* Content */}
      <div className="w-full">{renderContent()}</div>
    </div>
  );
};

export default RelationshipConfirm;
