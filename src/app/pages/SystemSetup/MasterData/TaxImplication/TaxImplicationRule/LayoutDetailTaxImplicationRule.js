import React from "react";
import DetailText from "../../../../../../components/DetailText";
import { getListCategory } from "../../../../../../redux/slices/account_management/MasterData/late_charges";
import accountManagementService from "../../../../../../redux/services/account_management/accountManagementService";
import AttachmentSectionForm from "../../../../ProductAndPromo/Pricing/Form/AttachmentSectionForm";
import BaseContainer from "../../../../../../components/BaseContainer";
import TableTaxImplicationRuleOverride from "./TableTaxImplicationRuleOverride";
import { getFormula } from "./util";

const LayoutDetailTaxImplicationRule = ({
  dataTaxImplicationRule = {},
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
  dataOverrideRule,
  transactionCodeData,
}) => {
  const dataOverrideTemp = dataOverrideRule?.listRuleOverride?.map((item) => {
    return {
      implicationType: item?.implicationType?.name,
      transactionCode: item?.transCode,
      description: item?.description,
      dataDetail: item?.listRuleOverrideCondition?.map((itemSecond) => {
        return {
          conditionName: {
            label: itemSecond?.name?.name,
          },
          operator: {
            label: itemSecond?.operator?.name,
          },
          value: itemSecond?.value,
        };
      }),
    };
  });
  console.log(dataTaxImplicationRule);

  return (
    <>
      <div className="drop-shadow-lg bg-white rounded-lg w-full mt-2 p-[20px]">
        <div className="flex flex-col gap-4 p-4">
          <div className="flex flex-col gap-2">
            <div className="text-primary text-xs font-bold uppercase">
              {"Tax Implication Rule Information"}
            </div>
            <div className="grid grid-cols-3 gap-2">
              <DetailText label={"Document Number"}>
                {dataTaxImplicationRule.documentNumber}
              </DetailText>
              <DetailText label={"Implication Type"}>
                {dataTaxImplicationRule.implicationType}
              </DetailText>
              <DetailText label={"VAT Invoice Issuance"}>
                {dataTaxImplicationRule.isVatInv}
              </DetailText>
              <DetailText label={"Gunggung"}>
                {dataTaxImplicationRule.isGunggung}
              </DetailText>
              <DetailText label={"Transaction Code"}>
                {dataTaxImplicationRule.transCode}
              </DetailText>
              <DetailText label={"Start Date"}>
                {dataTaxImplicationRule.startDate}
              </DetailText>
              <DetailText label={"End Date"}>
                {dataTaxImplicationRule.endDate}
              </DetailText>
              <DetailText label={"Status"}>
                {dataTaxImplicationRule.status}
              </DetailText>
              <DetailText label={"Status Approval"}>
                {dataTaxImplicationRule.approvalStatus}
              </DetailText>
              <div className="col-span-3">
                <DetailText label={"Description"}>{description}</DetailText>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-primary text-xs font-bold uppercase">
              {"tax implication rule override"}
            </div>
            <div className="font-bold">
              <TableTaxImplicationRuleOverride
                data={dataOverrideTemp}
                type="view"
                dataTransCode={transactionCodeData}
              />
            </div>
          </div>
        </div>
      </div>

      {/* <BaseContainer header={"Attachment Information"}>
        <AttachmentSectionForm
          type={type}
          data={listDataAttachment}
          updateData={setListDataAttachment}
          dispatch={dispatch}
          getAPICategory={getListCategory}
          service={accountManagementService}
          typeSelector={"tax_implication"}
        />
      </BaseContainer> */}

      <BaseContainer header={"HISTORY LOG INFORMATION"}>
        <div className="grid grid-cols-5 w-full">
          <DetailText label={"Record ID"}>
            {dataLogInformation?.taxImplicationRuleId}
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

export default LayoutDetailTaxImplicationRule;
