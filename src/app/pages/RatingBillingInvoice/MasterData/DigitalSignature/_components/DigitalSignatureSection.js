import React, { useEffect } from "react";
import BaseContainer from "../../../../../../components/BaseContainer";
import DetailText from "../../../../../../components/DetailText";
import { useDispatch, useSelector } from "react-redux";
import { dateFormatting } from "../../../../../../utils";
import moment from "moment";
import {
  getPositionEmployee,
  downloadDigitalSignatureFile,
} from "../../../../../../redux/slices/rating_billing_invoice/MasterData/digitalSignature";
import { Image, Button, message } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

const DigitalSignatureSection = ({
  dataDetailSignature = {},
  dataHistory = {},
}) => {
  const dispatch = useDispatch();

  // Handle download signature file
  const handleDownloadSignatureFile = async () => {
    const fileId = dataDetailSignature?.signatureId;

    if (!fileId) {
      message.error("File ID not found!");
      return;
    }

    try {
      await dispatch(downloadDigitalSignatureFile({ id: fileId })).unwrap();
      message.success("Signature file downloaded successfully!");
    } catch (error) {
      message.error("Failed to download signature file!");
    }
  };

  // Render signature based on method
  const renderSignature = () => {
    const method = dataDetailSignature?.signatureMethod;
    const fileDetail = dataDetailSignature?.fileDetail;

    if (method === "UPLOAD" && fileDetail?.id) {
      // Show download button for UPLOAD method
      return (
        <div className="flex items-center gap-3">
          <span className="text-gray-700">Uploaded signature file</span>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            size="small"
            onClick={handleDownloadSignatureFile}
          >
            Download
          </Button>
        </div>
      );
    } else if (method === "DRAW" && dataDetailSignature?.signatureBase64) {
      // Show image for DRAW method
      return (
        <Image
          src={`data:image/png;base64,${dataDetailSignature.signatureBase64}`}
          width={250}
          alt="Signature"
        />
      );
    } else {
      return "-";
    }
  };

  return (
    <>
      {/* Digital Signature Information */}
      <BaseContainer header={"Digital Signature Information"}>
        <div className="flex flex-col gap-3 w-full">
          <div className="flex w-full gap-3 justify-between">
            <DetailText label={"Name"}>
              {dataDetailSignature?.name || "-"}
            </DetailText>

            <DetailText label={"Employee"}>
              {dataDetailSignature?.employee || "-"}
            </DetailText>

            <DetailText label={"Primary Position"}>
              {dataDetailSignature?.primaryPosition || "-"}
            </DetailText>
          </div>

          <div className="flex gap-3">
            <DetailText label={"Status"}>
              {dataDetailSignature?.status || "-"}
            </DetailText>
            <DetailText label={"Status Approval"}>
              {dataDetailSignature?.statusApproval || "-"}
            </DetailText>
          </div>

          <div className="flex w-full">
            <DetailText label={"Description"}>
              {dataDetailSignature?.description || "-"}
            </DetailText>
          </div>

          <div className="flex w-fit">
            <DetailText label={"Signature"}>{renderSignature()}</DetailText>
          </div>
        </div>
      </BaseContainer>

      <BaseContainer header={"History Log Information"}>
        <div className="w-full grid grid-cols-5 gap-3">
          <DetailText label={"Record ID"}>
            {dataHistory?.recordId || "-"}
          </DetailText>
          <DetailText label={"Created Date"}>
            {dataHistory?.createdDate
              ? moment(dataHistory.createdDate).format(dateFormatting.dateTime)
              : "-"}
          </DetailText>
          <DetailText label={"Created By"}>
            {dataHistory?.createdBy || "-"}
          </DetailText>
          <DetailText label={"Updated Date"}>
            {dataHistory?.updatedDate
              ? moment(dataHistory.updatedDate).format(dateFormatting.dateTime)
              : "-"}
          </DetailText>
          <DetailText label={"Updated By"}>
            {dataHistory?.updatedBy || "-"}
          </DetailText>
        </div>
      </BaseContainer>
    </>
  );
};

export default DigitalSignatureSection;
