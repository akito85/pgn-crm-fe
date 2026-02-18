import React, { useState } from "react";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import RadioTabs from "../../../../../../components/RadioTabs";
import AttachmentComponent from "../../../../../../components/Attachment/AttachmentComponent";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import ApprovalComponentGeneral from "../../../../../../components/Approval/ApprovalComponentGeneral";
import DetailText from "../../../../../../components/DetailText";
import moment from "moment";
import { dateFormatting } from "../../../../../../utils";

const ConfirmationBillingItemCategory = ({
  isOpen,
  data,
  selectedHierarchy,
  listDataAppHierDetail = [],
  listDataAttachment = [],
  handleCancel = () => {},
  handleConfirm = () => {},
  dataOption = [],
}) => {
  // State
  const [valuePage, setValuePage] = useState("Billing Item Category");

  const [tabPages, setTabPages] = useState([
    { value: "Billing Item Category" },
    { value: "Approval" },
    { value: "Attachment" },
  ]);

  // Rendering Section
  const renderSection = (valuePage) => {
    switch (valuePage) {
      case "Billing Item Category":
        return (
          <div>
            <p className="text-primary text-xs font-bold uppercase pt-[30px]">
              {"BILLING ITEM CATEGORY INFORMATION"}
            </p>
            <div className="w-full grid grid-cols-4 gap-3 pt-[20px]">
              <DetailText label={"Category Code"}>{data?.code}</DetailText>
              <DetailText label={"Category Name"}>{data?.name}</DetailText>
              <DetailText label={"Start Date"}>
                {data?.startDate
                  ? moment(data?.startDate).format(dateFormatting.date)
                  : "-"}
              </DetailText>
              <DetailText label={"End Date"}>
                {data?.endDate
                  ? moment(data?.endDate).format(dateFormatting.date)
                  : "-"}
              </DetailText>
            </div>
            <div className="w-full grid grid-cols-1 gap-3">
              <DetailText label={"Description"}>
                {data?.description || "-"}
              </DetailText>
            </div>
          </div>
        );
      case "Approval":
        return (
          <>
            <p className="text-primary text-xs font-bold uppercase pt-[30px]">
              {"APPROVAL INFORMATION"}
            </p>
            <ApprovalComponentGeneral
              showSelect={false}
              disableSelect={true}
              approvalName={
                (dataOption || []).filter(
                  (d) => d.value === selectedHierarchy
                )?.[0]?.name || ""
              }
              dataTable={listDataAppHierDetail}
              selectedHierarchy
            />
          </>
        );
      case "Attachment":
        return (
          <>
            <p className="text-primary text-xs font-bold uppercase pt-[30px]">
              {"ATTACHMENT INFORMATION"}
            </p>
            <AttachmentComponent
              type={"preview"}
              data={listDataAttachment}
              typeSelector="billingItemCategory"
            />
          </>
        );
      default:
        return (
          <div>
            <p className="text-primary text-xs font-bold uppercase pt-[30px]">
              {"BILLING ITEM CATEGORY INFORMATION"}
            </p>
            <div className="w-full grid grid-cols-4 gap-3 pt-[20px]">
              <DetailText label={"Category Code"}>{data?.code}</DetailText>
              <DetailText label={"Category Name"}>{data?.name}</DetailText>
              <DetailText label={"Start Date"}>
                {data?.startDate
                  ? moment(data?.startDate).format(dateFormatting.date)
                  : "-"}
              </DetailText>
              <DetailText label={"End Date"}>
                {data?.endDate
                  ? moment(data?.endDate).format(dateFormatting.date)
                  : "-"}
              </DetailText>
            </div>
            <div className="w-full grid grid-cols-1 gap-3">
              <DetailText label={"Description"}>
                {data?.description || "-"}
              </DetailText>
            </div>
          </div>
        );
    }
  };
  return (
    <ModalCustom
      isOpen={isOpen}
      type={"confirmation"}
      header={"confirmation"}
      width={1000}
      handleCancel={handleCancel}
      handleConfirm={handleConfirm}
      footer={
        <div className={"w-full flex justify-end gap-5"}>
          <ButtonComponent type={"default"} onClick={handleCancel}>
            Cancel
          </ButtonComponent>
          <ButtonComponent
            type={"submit"}
            border={false}
            onClick={handleConfirm}
          >
            Confirm
          </ButtonComponent>
        </div>
      }
    >
      <RadioTabs
        data={tabPages}
        onChange={(e) => setValuePage(e.target.value)}
        currentPosition={valuePage}
      />
      {renderSection(valuePage)}
    </ModalCustom>
  );
};

export default ConfirmationBillingItemCategory;
