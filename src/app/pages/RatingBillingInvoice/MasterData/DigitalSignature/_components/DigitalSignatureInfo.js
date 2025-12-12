import React from "react";
import { Image, Button, message } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import CardComponent from "../../../../../../components/Card/CardComponent";
import DetailText from "../../../../../../components/DetailText";
import { downloadDigitalSignatureFile } from "../../../../../../redux/slices/rating_billing_invoice/MasterData/digitalSignature";

const DigitalSignatureInfo = ({ data, uploadedSignatureFile, signatureFileId }) => {
  const dispatch = useDispatch();
  const signatureMethod = data?.signatureMethod || "DRAW";

  // Handle download file
  const handleDownloadFile = async () => {
    if (!signatureFileId) {
      message.error("File ID not found!");
      return;
    }

    try {
      await dispatch(downloadDigitalSignatureFile({ id: signatureFileId })).unwrap();
      message.success("File downloaded successfully!");
    } catch (error) {
      message.error("Failed to download file!");
    }
  };

  // Render signature based on method
  const renderSignature = () => {
    if (signatureMethod === "UPLOAD" && uploadedSignatureFile) {
      // Show file name for UPLOAD method (new file, not yet saved)
      return (
        <div className="flex items-center gap-2">
          <span className="text-gray-700">{uploadedSignatureFile.name}</span>
          <span className="text-gray-500 text-sm">
            ({(uploadedSignatureFile.size / 1024).toFixed(2)} KB)
          </span>
        </div>
      );
    } else if (signatureMethod === "UPLOAD" && signatureFileId) {
      // Show download button for UPLOAD method (existing file from database)
      return (
        <div className="flex items-center gap-3">
          <span className="text-gray-700">Uploaded signature file</span>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            size="small"
            onClick={handleDownloadFile}
          >
            Download
          </Button>
        </div>
      );
    } else if (signatureMethod === "DRAW" && data?.signatureBase64) {
      // Show image for DRAW method
      return <Image src={data.signatureBase64} width={200} />;
    } else {
      return "-";
    }
  };

  return (
    <CardComponent header={"Digital Signature Information"} cols={2}>
      <DetailText label="Name">{data?.name || "-"}</DetailText>
      <div className="flex gap-3">
        <DetailText label="Employee">{data?.employeeCode || "-"}</DetailText>
        <DetailText label="Primary Position">
          {data?.primaryPosition || "-"}
        </DetailText>
      </div>

      <DetailText label="Description">{data?.description || "-"}</DetailText>
      <DetailText label="Signature">
        {renderSignature()}
      </DetailText>
    </CardComponent>
  );
};

export default DigitalSignatureInfo;
