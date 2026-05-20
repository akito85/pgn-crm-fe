import React from "react";
import moment from "moment";
import DetailText from "../../../../../components/DetailText";
import CardContainer from "../../../../../components/CardContainer";
import { dateFormatting } from "../../../../../utils";

const ConfirmationLayout = ({
  data,
  listDataAppHierDetail,
  listDataAttachment,
  listDataDetail,
  selectedHierarchy,
  dataOption,
}) => {
  const approvalHierarchyName = dataOption?.find(
    (item) => item.value === selectedHierarchy
  )?.name;

  const approvalLevelsCount = listDataAppHierDetail?.length || 0;

  return (
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
          <DetailText label="Faktur Type">
            {data?.fakturType || ""}
          </DetailText>
          <DetailText label="Faktur Date">
            {data?.fakturDate
              ? moment(data.fakturDate).format(dateFormatting.date)
              : ""}
          </DetailText>
          <DetailText label="Tax Period">
            {data?.taxPeriod || ""}
          </DetailText>
          <DetailText label="Faktur Code">
            {data?.fakturCode || ""}
          </DetailText>
          <DetailText label="Tax Year">
            {data?.taxYear || ""}
          </DetailText>
          <DetailText label="Country">
            {data?.country || ""}
          </DetailText>
          <div className="col-span-2">
            <DetailText label="Description">
              {data?.description || ""}
            </DetailText>
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
          <DetailText label="Customer Name">
            {data?.customerName || ""}
          </DetailText>
          <DetailText label="Email">
            {data?.email || ""}
          </DetailText>
          <DetailText label="Tax Identification Number">
            {data?.taxIdentificationNumber || ""}
          </DetailText>
          <DetailText label="NPWP">
            {data?.npwp || ""}
          </DetailText>
          <div className="col-span-2">
            <DetailText label="Customer Address">
              {data?.customerAddress || ""}
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
              : ""}
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
            {listDataDetail?.length > 0
              ? listDataDetail.map((item, index, array) => (
                  <span key={index}>
                    {item?.name || item?.description || item?.id || ""}
                    {index < array.length - 1 && ", "}
                  </span>
                ))
              : ""}
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
            {approvalHierarchyName || ""}
          </DetailText>
          <DetailText label="Approval Levels">
            {approvalLevelsCount > 0
              ? listDataAppHierDetail.map((item, index, array) => (
                  <span key={index}>
                    {item?.name || item?.levelName || ""}
                    {index < array.length - 1 && ", "}
                  </span>
                ))
              : ""}
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
            {listDataAttachment?.length > 0
              ? listDataAttachment.map((item, index, array) => (
                  <span key={index}>
                    {item?.fileName || item?.name || ""}
                    {index < array.length - 1 && ", "}
                  </span>
                ))
              : ""}
          </DetailText>
        </div>
      </CardContainer>
    </div>
  );
};

export default ConfirmationLayout;