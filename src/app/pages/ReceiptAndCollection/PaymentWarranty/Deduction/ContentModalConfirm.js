import moment from "moment";
import { Fragment, useState } from "react";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import DetailText from "../../../../../components/DetailText";
import RadioTabs from "../../../../../components/RadioTabs";
import { dateFormatting } from "../../../../../utils";
import AttachmentSectionForm from "../../../ProductAndPromo/Pricing/Form/AttachmentSectionForm";

const ContentModalConfirm = ({
  data,
  listDataAttachment = [],
  listDataAppHierDetail = [],
  tabData = [],
  dataOption,
  selectedHierarchy,
}) => {
  const [valuePage, setValuePage] = useState(tabData[0].value);

  console.log("data in content modal confirm: ", data);

  const showSection = () => {
    switch (valuePage) {
      case tabData[0].value:
        return (
          <div className="grid grid-cols-2 w-full">
            <DetailText label={"Date Start"}>
              {data?.dateStart}
            </DetailText>

            <DetailText label={"Date End"}>
              {data?.dateEnd}
            </DetailText>

            <DetailText label={"Hour Start"}>
              {data?.hourStart}
            </DetailText>

            <DetailText label={"Hour End"}>
              {data?.hourEnd}
            </DetailText>

            <DetailText label={"Minute Start"}>
              {data?.minuteStart}
            </DetailText>

            <DetailText label={"Minute End"}>
              {data?.minuteEnd}
            </DetailText>

            <DetailText label={"CA Code"}>
              {data?.caCode}
            </DetailText>


            <DetailText label={"Partner Code"}>
              {data?.partnerCode}
            </DetailText>

            <DetailText label={"CI Code"}>
              {data?.ciCode}
            </DetailText>

            <DetailText label={"Type"}>
              {data?.type}
            </DetailText>
          </div>
        );
      case tabData[1].value:
        return (
          <ApprovalComponentGeneral
            showSelect={false}
            disableSelect={true}
            approvalName={
              (dataOption || []).filter(
                (data) => data.value === selectedHierarchy
              )?.[0].name || ""
            }
            dataTable={listDataAppHierDetail}
            selectedHierarchy
          />
        );
      case tabData[2].value:
        return (
          <AttachmentSectionForm type={"preview"} data={listDataAttachment} />
        );
      default:
        return <Fragment></Fragment>;
    }
  };
  const handleMethod = (e) => {
    setValuePage(e.target.value);
  };

  return (
    <div className="flex flex-col gap-4">
      <RadioTabs data={tabData} onChange={handleMethod} />
      <div className="flex flex-col gap-4">
        <div className="text-primary text-xs font-bold uppercase">
          {`${valuePage} INFORMATION`}
        </div>
        {showSection()}
      </div>
    </div>
  );
};

export default ContentModalConfirm;
