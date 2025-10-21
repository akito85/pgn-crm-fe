import React, { Fragment, useState } from "react";
import moment from "moment";
import ApprovalSectionForm from "../../../../ProductAndPromo/Pricing/Form/ApprovalSectionForm";
import { getFormula } from "./util";
import TableLateChargeRuleFormula from "./TableLateChargeRuleFormula";
import TableLateChargeRuleCondition from "./TableLateChargeRuleCondition";
import DetailText from "../../../../../../components/DetailText";
import AttachmentSectionForm from "../../../../ProductAndPromo/Pricing/Form/AttachmentSectionForm";
import RadioTabs from "../../../../../../components/RadioTabs";
import { dateFormatting } from "../../../../../../utils";

const type = "preview";
const ContentModalConfirmLateChargeRule = ({
  data = {},
  listSectionInfo = [],
  dataLateCharge = {},
  listDataDetailCondition = [],
  listDataAttachment = [],
  listDataDetailFormula = [],
  listDataAppHierDetail = [],
  dataOption = [],
  selectedHierarchy,
  dataRuleInfo = {},
}) => {
  const [typeLateChargeRuleInfo, setTypeLateChargeRuleInfo] = useState(
    listSectionInfo[0].value,
  );
  const showSection = () => {
    switch (typeLateChargeRuleInfo) {
      case listSectionInfo[0].value:
        return (
          <>
            <div className="text-primary text-xs font-bold uppercase">
              {"Late charge information"}
            </div>
            <div className="grid grid-cols-3 gap-2">
              <DetailText label={"Late Charge Name"}>
                {dataLateCharge.lateChargeName}
              </DetailText>
              <DetailText label={"Currency"}>
                {dataLateCharge.currency}
              </DetailText>
              {/* <DetailText label={"Criteria"}>
                {dataLateCharge.criteriaName}
              </DetailText> */}
              <div className="col-span-3">
                <DetailText label={"Description"}>
                  {dataLateCharge.description}
                </DetailText>
              </div>
            </div>
            {/* late charge rule information */}
            <div className="text-primary text-xs font-bold uppercase">
              {"Late charge rule information"}
            </div>
            <div className="grid grid-cols-3 gap-2">
              <DetailText label={"Document Number"}>
                {dataRuleInfo.documentNumber}
              </DetailText>
              <DetailText label={"Late Charge Maximum Amount"}>
                {dataRuleInfo?.maxAmount?.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </DetailText>
              <DetailText label={"Start Date"}>
                {dataRuleInfo.startDate
                  ? moment(dataRuleInfo.startDate).format(dateFormatting.date)
                  : ""}
              </DetailText>
              <div className="col-span-3">
                <DetailText label={"Description"}>
                  {dataRuleInfo.description}
                </DetailText>
              </div>
            </div>

            <div className="text-primary text-xs font-bold uppercase">
              {"LATE CHARGE RULE DETAIL"}
            </div>
            <TableLateChargeRuleFormula
              dataTable={listDataDetailFormula}
              dataLateChargeRule={data}
              type={type}
            />

            <div className="mt-6 text-primary text-xs font-bold uppercase">
              {"Late charge rule formula"}
            </div>
            <div className="font-bold uppercase underline">
              {getFormula(listDataDetailFormula)}
            </div>

            <div className="mt-6 text-primary text-xs font-bold uppercase">
              {"Late charge condition"}
            </div>
            <TableLateChargeRuleCondition
              dataTable={listDataDetailCondition}
              dataLateChargeRule={data}
              type={type}
            />
          </>
        );
      case listSectionInfo[1].value:
        return (
          <>
            <div className="text-primary text-xs font-bold uppercase">
              {typeLateChargeRuleInfo}
            </div>
            <ApprovalSectionForm
              showSelect={false}
              disableSelect={true}
              approvalName={
                (dataOption || []).filter(
                  (data) => data.value === selectedHierarchy,
                )?.[0].name || ""
              }
              dataTable={listDataAppHierDetail}
              selectedHierarchy={selectedHierarchy}
            />
          </>
        );
      case listSectionInfo[2].value:
        return (
          <>
            <div className="text-primary text-xs font-bold uppercase">
              {typeLateChargeRuleInfo}
            </div>
            <AttachmentSectionForm type={type} data={listDataAttachment} />
          </>
        );
      default:
        return <Fragment></Fragment>;
    }
  };
  const handleLateChargeRuleInfo = (e) => {
    setTypeLateChargeRuleInfo(e.target.value);
  };
  return (
    <div className="flex flex-col gap-4">
      <RadioTabs
        data={listSectionInfo}
        onChange={handleLateChargeRuleInfo}
        currentPosition={typeLateChargeRuleInfo}
      />
      <div className="flex flex-col gap-4">{showSection()}</div>
    </div>
  );
};

export default ContentModalConfirmLateChargeRule;
