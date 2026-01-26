import React from "react";
import { Modal } from "antd";
import moment from "moment";
import DetailText from "../../../../../components/DetailText";
import { dateFormatting } from "../../../../../utils";
import ButtonComponent from "../../../../../components/ButtonComponent";

const ConfirmationLayout = ({
  isOpen,
  handleCancel,
  handleConfirm,
  data,
  listDataAppHierDetail,
  apiApproval,
  listDataAttachment,
  listDataDetail,
  selectedHierarchy,
  dataOption,
}) => {
  // Get approval hierarchy name
  const approvalHierarchyName = dataOption?.find(
    (item) => item.value === selectedHierarchy
  )?.name;

  // Get approval levels count
  const approvalLevelsCount = listDataAppHierDetail?.length || 0;

  return (
    <Modal
      title={
        <div className="text-[18px] font-bold">
          Confirmation - Create E-Faktur
        </div>
      }
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
      width={900}
      centered
    >
      <div className="px-4 py-4">
        {/* Documentation Transaction Section */}
        <div className="mb-6">
          <h3 className="text-[16px] font-semibold mb-3 text-blue-600">
            DOCUMENTATION TRANSACTION
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <DetailText label="Faktur Type">{data?.fakturType || "-"}</DetailText>
            <DetailText label="Faktur Date">
              {data?.fakturDate
                ? moment(data.fakturDate).format(dateFormatting.date)
                : "-"}
            </DetailText>
            <DetailText label="Tax Period">{data?.taxPeriod || "-"}</DetailText>
            <DetailText label="Faktur Code">{data?.fakturCode || "-"}</DetailText>
            <DetailText label="Tax Year">{data?.taxYear || "-"}</DetailText>
            <DetailText label="Country">{data?.country || "-"}</DetailText>
            <div className="col-span-2">
              <DetailText label="Description">{data?.description || "-"}</DetailText>
            </div>
          </div>
        </div>

        {/* Customer Information Section */}
        <div className="mb-6">
          <h3 className="text-[16px] font-semibold mb-3 text-blue-600">
            CUSTOMER INFORMATION
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <DetailText label="Customer Name">{data?.customerName || "-"}</DetailText>
            <DetailText label="Email">{data?.email || "-"}</DetailText>
            <DetailText label="Tax Identification Number">
              {data?.taxIdentificationNumber || "-"}
            </DetailText>
            <DetailText label="NPWP">{data?.npwp || "-"}</DetailText>
            <div className="col-span-2">
              <DetailText label="Customer Address">
                {data?.customerAddress || "-"}
              </DetailText>
            </div>
          </div>
        </div>

        {/* Down Payment Section */}
        <div className="mb-6">
          <h3 className="text-[16px] font-semibold mb-3 text-blue-600">
            DOWN PAYMENT INFORMATION
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <DetailText label="Down Payment">
              {data?.downPayment
                ? `Rp ${data.downPayment.toLocaleString("id-ID")}`
                : "-"}
            </DetailText>
          </div>
        </div>

        {/* Detail Transaction Section */}
        <div className="mb-6">
          <h3 className="text-[16px] font-semibold mb-3 text-blue-600">
            DETAIL TRANSACTION
          </h3>
          <DetailText label="Total Detail Entries">
            {listDataDetail?.length || 0} items
          </DetailText>
        </div>

        {/* Approval Information Section */}
        <div className="mb-6">
          <h3 className="text-[16px] font-semibold mb-3 text-blue-600">
            APPROVAL INFORMATION
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <DetailText label="Approval Hierarchy">
              {approvalHierarchyName || "-"}
            </DetailText>
            <DetailText label="Approval Levels">
              {approvalLevelsCount} level(s)
            </DetailText>
          </div>
        </div>

        {/* Attachment Information Section */}
        <div className="mb-6">
          <h3 className="text-[16px] font-semibold mb-3 text-blue-600">
            ATTACHMENT INFORMATION
          </h3>
          <DetailText label="Total Attachments">
            {listDataAttachment?.length || 0} file(s)
          </DetailText>
        </div>

        {/* Confirmation Message */}
        <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-6">
          <p className="text-sm text-gray-700">
            <strong>Note:</strong> Please review all information carefully before
            submitting. Once submitted, this E-Faktur will be sent for approval.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <ButtonComponent type="default" onClick={handleCancel}>
            Cancel
          </ButtonComponent>
          <ButtonComponent type="submit" onClick={handleConfirm}>
            Confirm & Submit
          </ButtonComponent>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationLayout;