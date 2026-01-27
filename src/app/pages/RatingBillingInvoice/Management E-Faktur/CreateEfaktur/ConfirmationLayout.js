import React from "react";
import { Modal } from "antd";
import moment from "moment";
import DetailText from "../../../../../components/DetailText";
import CardContainer from "../../../../../components/CardContainer";
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
        <div className="w-full space-y-4">
          {/* Documentation Transaction Section */}
          <CardContainer
            header={
              <div className="flex -my-4 justify-between items-center">
                <p className="mt-[15px] text-primary text-xs uppercase">
                  Documentation Transaction
                </p>
              </div>
            }
          >
            <div className="w-full grid grid-cols-2 gap-x-8 gap-y-2">
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
          </CardContainer>

          {/* Customer Information Section */}
          <CardContainer
            header={
              <div className="flex -my-4 justify-between items-center">
                <p className="mt-[15px] text-primary text-xs uppercase">
                  Customer Information
                </p>
              </div>
            }
          >
            <div className="w-full grid grid-cols-2 gap-x-8 gap-y-2">
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
          </CardContainer>

          {/* Down Payment Section */}
          <CardContainer
            header={
              <div className="flex -my-4 justify-between items-center">
                <p className="mt-[15px] text-primary text-xs uppercase">
                  Down Payment Information
                </p>
              </div>
            }
          >
            <div className="w-full grid grid-cols-2 gap-x-8 gap-y-2">
              <DetailText label="Down Payment">
                {data?.downPayment
                  ? `Rp ${data.downPayment.toLocaleString("id-ID")}`
                  : "-"}
              </DetailText>
            </div>
          </CardContainer>

          {/* Detail Transaction Section */}
          <CardContainer
            header={
              <div className="flex -my-4 justify-between items-center">
                <p className="mt-[15px] text-primary text-xs uppercase">
                  Detail Transaction
                </p>
              </div>
            }
          >
            <div className="w-full grid grid-cols-2 gap-x-8 gap-y-2">
              <DetailText label="Total Detail Entries">
                {listDataDetail?.length || 0} items
              </DetailText>
            </div>
          </CardContainer>

          {/* Approval Information Section */}
          <CardContainer
            header={
              <div className="flex -my-4 justify-between items-center">
                <p className="mt-[15px] text-primary text-xs uppercase">
                  Approval Information
                </p>
              </div>
            }
          >
            <div className="w-full grid grid-cols-2 gap-x-8 gap-y-2">
              <DetailText label="Approval Hierarchy">
                {approvalHierarchyName || "-"}
              </DetailText>
              <DetailText label="Approval Levels">
                {approvalLevelsCount} level(s)
              </DetailText>
            </div>
          </CardContainer>

          {/* Attachment Information Section */}
          <CardContainer
            header={
              <div className="flex -my-4 justify-between items-center">
                <p className="mt-[15px] text-primary text-xs uppercase">
                  Attachment Information
                </p>
              </div>
            }
          >
            <div className="w-full grid grid-cols-2 gap-x-8 gap-y-2">
              <DetailText label="Total Attachments">
                {listDataAttachment?.length || 0} file(s)
              </DetailText>
            </div>
          </CardContainer>

          {/* Confirmation Message */}
          <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
            <p className="text-sm text-gray-700">
              <strong>Note:</strong> Please review all information carefully before
              submitting. Once submitted, this E-Faktur will be sent for approval.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6">
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