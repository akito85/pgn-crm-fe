import React from "react";
import DetailText from "../../../../../../components/DetailText";
import BaseContainer from "../../../../../../components/BaseContainer";
import TableLateChargeRuleCondition from "./TableLateChargeRuleCondition";
import { getFormula } from "./util";
import TableLateChargeRuleFormula from "./TableLateChargeRuleFormula";

const LayoutDetailLateChargeRule = ({
  dataLateChargeRule = {},
  description = "",
  type = "detail",
  listDataAttachment = [],
  setListDataAttachment = () => {},
  listDataDetailCondition = [],
  setListDataDetailCondition = () => {},
  listDataDetailFormula = [],
  setListDataDetailFormula = () => {},
  dispatch = () => {},
  dataLogInformation = {},
}) => {
  return (
    <>
      <div className="drop-shadow-lg bg-white rounded-lg w-full p-[20px]">
        <div className="flex flex-col gap-4 p-4">
          <div className="flex flex-col gap-2">
            <div className="text-primary text-xs font-bold uppercase">
              {"late charge rule information"}
            </div>
            <div className="grid grid-cols-3 gap-2">
              <DetailText label={"Document Number"}>
                {dataLateChargeRule.documentNumber}
              </DetailText>
              <DetailText label={"Late Charges Maximum Amount"}>
                {dataLateChargeRule.maxAmount}
              </DetailText>
              <DetailText label={"Start Date"}>
                {dataLateChargeRule.startDate}
              </DetailText>
              <DetailText label={"End Date"}>
                {dataLateChargeRule.endDate}
              </DetailText>
              <DetailText label={"Status"}>
                {dataLateChargeRule.status}
              </DetailText>
              <DetailText label={"Status Approval"}>
                {dataLateChargeRule.approvalStatus}
              </DetailText>
              <div className="col-span-3">
                <DetailText label={"Description"}>{description}</DetailText>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-primary text-xs font-bold uppercase">
              {"LATE CHARGE RULE DETAIL"}
            </div>
            <TableLateChargeRuleFormula
              dataTable={listDataDetailFormula}
              updateTable={setListDataDetailFormula}
              dataLateChargeRule={dataLateChargeRule}
              type={type}
              dispatch={dispatch}
            />
          </div>
          <div className="flex flex-col gap-2 mt-6">
            <div className="text-primary text-xs font-bold uppercase">
              {"late charge rule formula"}
            </div>
            <div className="font-bold uppercase underline">
              {getFormula(listDataDetailFormula)}
            </div>
          </div>
        </div>
      </div>
      <BaseContainer header={"late charge condition"}>
        <TableLateChargeRuleCondition
          dataTable={listDataDetailCondition}
          updateTable={setListDataDetailCondition}
          dataLateChargeRule={dataLateChargeRule}
          type={type}
          dispatch={dispatch}
        />
      </BaseContainer>
      {/* <BaseContainer header={"Attachment Information"}>
        <AttachmentSectionForm
          type={type}
          data={listDataAttachment}
          updateData={setListDataAttachment}
          dispatch={dispatch}
          getAPICategory={getListCategory}
          service={accountManagementService}
          typeSelector={"late_charge"}
        />
      </BaseContainer> */}
      <BaseContainer header={"HISTORY LOG INFORMATION"}>
        <div className="grid grid-cols-5 w-full">
          <DetailText label={'Record ID'}>
            {dataLogInformation?.lateChargeRuleId}
          </DetailText>
          <DetailText label={"Created Date"}>
            {dataLogInformation.createdDate}
          </DetailText>
          <DetailText label={"Created By"}>
            {dataLogInformation.createdBy}
          </DetailText>
          <DetailText label={"Updated Date"}>
            {dataLogInformation.updatedDate}
          </DetailText>
          <DetailText label={"Updated By"}>
            {dataLogInformation.updatedBy}
          </DetailText>
        </div>
      </BaseContainer>
    </>
  );
};

export default LayoutDetailLateChargeRule;
