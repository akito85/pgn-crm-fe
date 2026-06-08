import React, { useState } from "react";
import moment from "moment";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import RadioTabs from "../../../../../../components/RadioTabs";
import AttachmentComponent from "../../../../../../components/Attachment/AttachmentComponent";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import ApprovalComponentGeneral from "../../../../../../components/Approval/ApprovalComponentGeneral";
import DetailText from "../../../../../../components/DetailText";
import FunctionalCriteriaBillingBucket from "../../../../RatingBillingInvoice/MasterData/BillingBucket/Form/FunctionalCriteriaBillingBucket";
import { dateFormatting } from "../../../../../../utils";

const CalendarInfo = ({ data, apiHolidayType = [], apiCriteria = [] }) => {
  const holidayTypeLabel =
    apiHolidayType?.find((h) => h.code === data?.holidayType)?.text ||
    data?.holidayType ||
    "-";

  const criteriaNames =
    apiCriteria
      ?.filter((item) => data?.criteria?.includes(item?.id))
      ?.map((item) => item?.text)
      ?.join(", ") || "-";

  return (
    <div className="w-full grid grid-cols-3 gap-3">
      <DetailText label={"Name"}>{data?.name || "-"}</DetailText>
      <DetailText label={"Start Date"}>
        {data?.startDate
          ? moment(data.startDate).format(dateFormatting.date)
          : "-"}
      </DetailText>
      <DetailText label={"End Date"}>
        {data?.endDate ? moment(data.endDate).format(dateFormatting.date) : "-"}
      </DetailText>
      <DetailText label={"Holiday Type"}>{holidayTypeLabel}</DetailText>
      <div className="col-span-2">
        <DetailText label={"Criteria"}>{criteriaNames}</DetailText>
      </div>
      <div className="col-span-3">
        <DetailText label={"Description"}>
          {data?.description || "-"}
        </DetailText>
      </div>
    </div>
  );
};

const ConfirmationCalendar = ({
  isOpen,
  data,
  selectedHierarchy,
  apiHolidayType = [],
  apiCriteria = [],
  criteriaValues = [],
  listDataAppHierDetail = [],
  listDataAttachment = [],
  listDataCriteria = [],
  dataOption = [],
  handleCancel = () => {},
  handleConfirm = () => {},
}) => {
  const [valuePage, setValuePage] = useState("Calendar");

  const [tabPages] = useState([
    { value: "Calendar" },
    { value: "Approval" },
    { value: "Attachment" },
  ]);

  const renderSection = (page) => {
    switch (page) {
      case "Calendar":
        return (
          <div>
            <p className="text-primary text-xs font-bold uppercase pt-[30px]">
              {"CALENDAR INFORMATION"}
            </p>
            <CalendarInfo
              data={data}
              apiHolidayType={apiHolidayType}
              apiCriteria={apiCriteria}
            />
            <p className="text-primary text-xs font-bold uppercase pt-[30px]">
              {"CRITERIA INFORMATION"}
            </p>
            <FunctionalCriteriaBillingBucket
              type={"preview"}
              data={listDataCriteria}
              dataCriteria={criteriaValues}
            />
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
                (dataOption || []).find((d) => d.value === selectedHierarchy)
                  ?.name || ""
              }
              dataTable={listDataAppHierDetail}
              selectedHierarchy={selectedHierarchy}
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
              typeSelector="calendar"
            />
          </>
        );
      default:
        return null;
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
        <div className={"w-full flex justify-end gap-2"}>
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

export default ConfirmationCalendar;
