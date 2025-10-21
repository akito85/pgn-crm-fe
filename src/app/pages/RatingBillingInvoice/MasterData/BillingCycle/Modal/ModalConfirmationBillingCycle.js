import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import ApprovalComponentGeneral from "../../../../../../components/Approval/ApprovalComponentGeneral";
import AttachmentComponent from "../../../../../../components/Attachment/AttachmentComponent";
import { useState } from "react";
import DetailText from "../../../../../../components/DetailText";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import RadioTabs from "../../../../../../components/RadioTabs";
import moment from "moment";
import { dateFormatting } from "../../../../../../utils";

const ModalConfirmationBillingCycle = ({
  isOpen,
  data,
  selectedHierarchy,
  listDataAppHierDetail = [],
  listDataAttachment = [],
  handleCancel = () => {},
  handleConfirm = () => {},
  dataOption = [],
  apiTimeUnit,
}) => {
  const [valuePage, setValuePage] = useState("Billing Cycle");
  const [tabPages, setTabPages] = useState([
    { value: "Billing Cycle" },
    { value: "Approval" },
    { value: "Attachment" },
  ]);

  const labelTimeUnit = apiTimeUnit
    ?.filter((a) => a.id === data?.timeUnit)
    ?.find((v) => v.name)?.name;

  const showSection = (valuePage) => {
    switch (valuePage) {
      case "Billing Cycle":
        return (
          <>
            <p className="text-primary text-xs font-bold uppercase pt-[30px]">
              {"BILLING CYCLE INFORMATION"}
            </p>
            <div className="grid grid-cols-3 w-full">
              <DetailText label={"Begin Cycle"}>{data.beginCycle}</DetailText>
              <DetailText label={"End Cycle"}>{data.endCycle}</DetailText>
              <DetailText label={"Time Unit"}>{labelTimeUnit}</DetailText>
              <DetailText label={"Invoice Date"}>{data.invoiceDate}</DetailText>
              <DetailText label={"Start Date"}>
                {data?.startDate
                  ? moment(data?.startDate).format(dateFormatting.date)
                  : ""}
              </DetailText>
              <DetailText label={"End Date"}>
                {data?.endDate
                  ? moment(data?.endDate).format(dateFormatting.date)
                  : ""}
              </DetailText>
              <DetailText
                label={"Description"}
                className={"col-span-3 w-full break-words"}
              >
                {data.description}
              </DetailText>
            </div>
          </>
        );
      case "Approval":
        return (
          <>
            <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
              {"APPROVAL INFORMATION"}
            </div>
            <ApprovalComponentGeneral
              showSelect={false}
              disableSelect={true}
              approvalName={
                (dataOption || []).filter(
                  (data) => data.value === selectedHierarchy,
                )?.[0].name || ""
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
              typeSelector="billingCycle"
            />
          </>
        );
      default:
        return (
          <div className="grid grid-cols-3 w-full">
            <DetailText label={"Begin Cycle"}>{data.beginCycle}</DetailText>
            <DetailText label={"End Cycle"}>{data.endCycle}</DetailText>
            <DetailText label={"Time Unit"}>{labelTimeUnit}</DetailText>
            <DetailText label={"Invoice Date"}>{data.invoiceDate}</DetailText>
            <DetailText label={"Start Date"}>{data.startDate}</DetailText>
            <DetailText label={"End Date"}>{data.endDate}</DetailText>
            <DetailText label={"Description"}>{data.description}</DetailText>
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
      />
      {showSection(valuePage)}
    </ModalCustom>
  );
};
export default ModalConfirmationBillingCycle;
