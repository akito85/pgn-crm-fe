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
            <DetailText label={"Partner Code"}>
              {data?.partnerCode}
            </DetailText>
            <DetailText label={"Partner Name"}>{data?.partnerName}</DetailText>
            <DetailText label={"Sec Key Signature"}>{data?.seckeySignature}</DetailText>
            <DetailText label={"Token Expiration Time"}>{data?.tokenExpirationTime}</DetailText>
            <DetailText label={"Eff Start Date"}>
              {moment(data?.effStartDate).format(dateFormatting.date)}
            </DetailText>
            <DetailText label={"End Date"}>
              {data?.effEndDate
                ? moment(data?.effEndDate).format(dateFormatting.date)
                : ""}
            </DetailText>
            <DetailText label={"Type"}>{data?.type}</DetailText>
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
