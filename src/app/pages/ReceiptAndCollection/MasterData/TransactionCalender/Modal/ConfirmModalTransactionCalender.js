import moment from "moment";
import { Fragment, useState } from "react";
import ApprovalComponentGeneral from "../../../../../../components/Approval/ApprovalComponentGeneral";
import DetailText from "../../../../../../components/DetailText";
import RadioTabs from "../../../../../../components/RadioTabs";
import { dateFormatting } from "../../../../../../utils";
import ApprovalSectionForm from "../../../../ProductAndPromo/Pricing/Form/ApprovalSectionForm";
import AttachmentSectionForm from "../../../../ProductAndPromo/Pricing/Form/AttachmentSectionForm";
import FunctionalTableCriteriaPayment from "../../Bank/Table/FunctionalTableCriteriaPayment";

const ConfirmModalTransactionCalender = ({
  data,
  listDataCriteria,
  criteriaValues,
  listDataAttachment = [],
  columns = [],
  pageSize = [],
  listDataDetail = [],
  listDataAppHierDetail = [],
  tabData = [],
  apiCriteria,
  current,
  onSort,
  handleChange,
  dataTimeUnit,
  dataOption,
  selectedHierarchy,
}) => {
  const [valuePage, setValuePage] = useState(tabData[0].value);
  // find data criteria
  const matchedObjectsCriteria = apiCriteria?.filter((obj) =>
    data?.criteria?.includes(obj?.Id)
  );

  const matchedNamesCriteria = matchedObjectsCriteria
    ?.map((obj) => obj.text)
    ?.reduce((current, next) => current + `, ${next}`, "");

  const time = dataTimeUnit
    ?.filter((a) => a.id === data?.timeUnit)
    ?.find((a) => a.name)?.name;

  const showSection = () => {
    switch (valuePage) {
      case tabData[0].value:
        return (
          <div className="w-full">
            <div className="grid grid-cols-3 w-full gap-5">
              <DetailText label={"Begin Cycle"}>{data?.beginCycle}</DetailText>
              <DetailText label={"End Cycle"}>{data?.endCycle}</DetailText>
              <DetailText label={"Time Unit"}>{time}</DetailText>
              <DetailText label={"Start Date"}>
                {moment(data?.startDate).format(dateFormatting.date)}
              </DetailText>
              <DetailText label={"End Date"}>
                {data?.endDate
                  ? moment(data?.endDate).format(dateFormatting.date)
                  : ""}
              </DetailText>
              <DetailText label="Criteria">
                {matchedNamesCriteria?.slice(2)}
              </DetailText>
              <div className="col-span-3">
                <DetailText label={"Description"}>
                  {data?.description}
                </DetailText>
              </div>
            </div>
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
  const handlePricingInfo = (e) => {
    setValuePage(e.target.value);
  };

  return (
    <div className="flex flex-col gap-4">
      <RadioTabs
        data={tabData}
        onChange={handlePricingInfo}
        currentPosition={valuePage}
      />
      <div className="flex flex-col gap-4">
        <div className="text-primary text-xs font-bold uppercase">
          {`${valuePage} INFORMATION`}
        </div>
        {showSection()}
      </div>
      {valuePage === tabData[0].value ? (
        <div className="flex flex-col gap-4">
          {/* <div className="text-primary text-xs font-bold uppercase">
            {"PAYMENT ITEM INFORMATION"}
          </div> */}
          <div className="text-primary text-xs font-bold uppercase">
            {"CRITERIA INFORMATION"}
          </div>
          <FunctionalTableCriteriaPayment
            type={"detail"}
            data={listDataCriteria}
            dataCriteria={criteriaValues}
          />
        </div>
      ) : null}
    </div>
  );
};

export default ConfirmModalTransactionCalender;
