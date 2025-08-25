import React, { Fragment, useMemo, useState } from "react";
import AttachmentSectionForm from "../../../../../ProductAndPromo/Pricing/Form/AttachmentSectionForm";
import ApprovalSectionForm from "../../../../../ProductAndPromo/Pricing/Form/ApprovalSectionForm";
import DetailText from "../../../../../../../components/DetailText";
import { dateFormatting } from "../../../../../../../utils";
import RadioTabs from "../../../../../../../components/RadioTabs";
import TableDetailTos from "./TableDetailTos";

const listSection = [
  {
    value: "TOS",
  },
  { value: "Approval" },
  { value: "Attachment" },
];
const ContentModalConfirm = ({
  selectedHierarchy,
  dataTosSubmissionObj = {},
  listDataAttachment = [],
  listDataAppHierDetail = [],
  dataDetailTosSubmission = [],
  listApproval
}) => {
  const [typeTosSubmissionInfo, setTypeTosSubmissionInfo] = useState(
    listSection[0].value
  );
  const handleTosSubmissionInfo = (e) => {
    setTypeTosSubmissionInfo(e.target.value);
  };
  const approvalName = useMemo(() => listApproval?.find(item => item?.value === selectedHierarchy)?.name, [listApproval, selectedHierarchy])
  
  const showSection = () => {
    switch (typeTosSubmissionInfo) {
      case listSection[0].value:
        return (
          <div>
            <div className="text-primary text-xs font-bold uppercase py-4">TERM OF SERVICE INFORMATION</div>
            <div className="grid grid-cols-4 w-full gap-4">
              <DetailText label={"Term of Service"}>
                {dataTosSubmissionObj?.tosName}
              </DetailText>
            </div>
            <div className="py-4">
              <div className="text-primary text-xs font-bold uppercase py-4">TERM OF SERVICE DETAIL</div>
              <TableDetailTos
                type={"preview"}
                editDetail={false}
                dataTable={dataDetailTosSubmission}
              />
            </div>
            <div className="py-4">
              <div className="text-primary text-xs font-bold uppercase py-4">TERM OF SERVICE SUBMISSION INFORMATION</div>
              <div className="grid grid-cols-4 w-full gap-4">
                <DetailText label={"Start Date"}>
                  {dataTosSubmissionObj?.startDate
                    ? dataTosSubmissionObj.startDate.format(dateFormatting.date)
                    : ""}
                </DetailText>
                <DetailText label={"End Date"}>
                  {dataTosSubmissionObj?.endDate
                    ? dataTosSubmissionObj.endDate.format(dateFormatting.date)
                    : ""}
                </DetailText>
              </div>
              <div className="grid grid-cols-1 w-full gap-4 py-4">
                <DetailText label={"Remark"}>
                  {dataTosSubmissionObj?.remark}
                </DetailText>
              </div>
            </div>
          </div>
        );
      case listSection[1].value:
        return (
          <ApprovalSectionForm
            showSelect={false}
            disableSelect={true}
            dataTable={listDataAppHierDetail}
            selectedHierarchy={selectedHierarchy}
            approvalName={approvalName}
          />
        );
      case listSection[2].value:
        return (
          <AttachmentSectionForm type={"preview"} data={listDataAttachment} />
        );
      default:
        return <Fragment></Fragment>;
    }
  };
  return (
    <div className="flex flex-col gap-4 w-full">
      {/* <div className="pt-4">
        <div className="text-primary text-xs font-bold uppercase">
          TERM OF SERVICE INFORATION
        </div>
      </div> */}
      <RadioTabs data={listSection} onChange={handleTosSubmissionInfo} />
      {showSection()}
    </div>
  );
};

export default ContentModalConfirm;
