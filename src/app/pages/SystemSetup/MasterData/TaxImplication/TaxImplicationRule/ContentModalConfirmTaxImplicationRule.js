import React, { Fragment, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import ApprovalSectionForm from "../../../../ProductAndPromo/Pricing/Form/ApprovalSectionForm";
import { getFormula } from "./util";
import TableTaxImplicationRuleFormula from "./TableTaxImplicationRuleFormula";
import TableTaxImplicationRuleCondition from "./TableTaxImplicationRuleCondition";
import DetailText from "../../../../../../components/DetailText";
import AttachmentSectionForm from "../../../../ProductAndPromo/Pricing/Form/AttachmentSectionForm";
import RadioTabs from "../../../../../../components/RadioTabs";
import TableTaxImplicationRuleOverride from "./TableTaxImplicationRuleOverride";
import moment from "moment";
import { dateFormatting } from "../../../../../../utils";

const type = "preview";
const ContentModalConfirmTaxImplicationRule = ({
  data = {},
  listSectionInfo = [],
  dataTaxImplication = {},
  listDataDetailCondition = [],
  listDataAttachment = [],
  listDataDetailFormula = [],
  listDataAppHierDetail = [],
  dataOption = [],
  selectedHierarchy,
  listDataDetailOverride =[],
  dataTaxImplicationRule = {}
}) => {
  const {dataImplicationType = []} = useSelector((state) => state.tax_implication);
  const [typeTaxImplicationRuleInfo, setTypeTaxImplicationRuleInfo] = useState(
    listSectionInfo[0].value
  );
  const getImplicationType = (val) => {
    const implicationName = dataImplicationType && dataImplicationType?.filter((item) =>  item?.value === val)
    if(implicationName === undefined){
      return ''
    }
    if(implicationName.length !== 0){
      return implicationName[0].label 
    } 
  }

  const transactionCodeName = useMemo(() => { return data?.find(item => item?.id === dataTaxImplicationRule?.transactionCode)?.code}, [data, dataTaxImplicationRule?.transactionCode])
  
  const showSection = () => {
    switch (typeTaxImplicationRuleInfo) {
      case listSectionInfo[0].value:
        return (
          <>
            <div className="text-primary text-xs font-bold uppercase">
              {"Tax Implication information"}
            </div>
            <div className="grid grid-cols-3 gap-2">
              <DetailText label={"Tax Implication Name"}>
                {dataTaxImplication.taxImplicationName}
              </DetailText>
              <DetailText label={"Category"}>
                {dataTaxImplication.category}
              </DetailText>
              <DetailText label={"Service Type"}>
                {dataTaxImplication.serviceType}
              </DetailText>
              {/* <div className="col-span-3">
                <DetailText label={"Criteria"}>
                  {dataTaxImplication.criteriaName}
                </DetailText>
              </div> */}
              {/* <div className="col-span-3">
                <DetailText label={"Description"}>
                  {dataTaxImplication.description}
                </DetailText>
              </div> */}
            </div>

            <div className="text-primary text-xs font-bold uppercase">
              {"Tax Implication rule information"}
            </div>
            <div className="grid grid-cols-3 gap-2">
              <DetailText label={"Document Number"}>
                {dataTaxImplicationRule?.documentNumber}
              </DetailText>
              <DetailText label={"VAT INvoice Issuance"}>
                {dataTaxImplicationRule?.vatInvoiceIssuance=== true ? "Yes" : "No"}
              </DetailText>
              <DetailText label={"Gunggung"}>
                {dataTaxImplicationRule?.gunggung === true ? "Yes" : "No" }
              </DetailText>
              <DetailText label={"Implication Type"}>
                {getImplicationType(dataTaxImplicationRule?.implicationType)}
              </DetailText>
              <DetailText label={"Transaction Code"}>
                {transactionCodeName}
              </DetailText>
              <DetailText label={"Start Date"}>
                {dataTaxImplicationRule?.startDate ? moment(dataTaxImplicationRule?.startDate).format(dateFormatting.date) : ''}
              </DetailText>
              <div className="col-span-3">
                <DetailText label={"Description"}>
                  {dataTaxImplicationRule?.description}
                </DetailText>
              </div>
            </div>

            <div className="text-primary text-xs font-bold uppercase">
              {"Tax Implication rule override"}
            </div>
            <TableTaxImplicationRuleOverride
              data={listDataDetailOverride}
              type="view"
              dataTransCode={data}
            />
          </>
        );
      case listSectionInfo[1].value:
        return (
          <>
            <div className="text-primary text-xs font-bold uppercase">
              {typeTaxImplicationRuleInfo}
            </div>
            <ApprovalSectionForm
              showSelect={false}
              disableSelect={true}
              approvalName={
                (dataOption || []).filter(
                  (data) => data.value === selectedHierarchy
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
              {typeTaxImplicationRuleInfo}
            </div>
            <AttachmentSectionForm type={type} data={listDataAttachment} />
          </>
        );
      default:
        return <Fragment></Fragment>;
    }
  };

  const handleTaxImplicationRuleInfo = (e) => {
    setTypeTaxImplicationRuleInfo(e.target.value);
  };
  return (
    <div className="flex flex-col gap-4">
      <RadioTabs
        data={listSectionInfo}
        onChange={handleTaxImplicationRuleInfo}
        currentPosition={typeTaxImplicationRuleInfo}
      />
      <div className="flex flex-col gap-4">{showSection()}</div>
    </div>
  )
}

export default ContentModalConfirmTaxImplicationRule