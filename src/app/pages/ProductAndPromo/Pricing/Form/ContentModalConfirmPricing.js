import React, { Fragment, useState } from "react";
import RadioTabs from "../../../../../components/RadioTabs";
import ApprovalSectionForm from "./ApprovalSectionForm";
import AttachmentSectionForm from "./AttachmentSectionForm";
import DetailText from "../../../../../components/DetailText";
import PricingDetailTableDetail from "./PricingDetailTableDetail";
import FunctionalCriteriaProduct from "../../UtilsProduct/FunctionalCriteriaProduct";
import { columnsTableCriteriaAll } from "../../UtilsProduct/TableCriteriaAllProduct";

const ContentModalConfirmPricing = ({
  data,
  listSectionInfo = [],
  listSectionPricingDetail = [],
  listDataAttachment = [],
  listDataDetail = [],
  listDataCriteria = [],
  criteriaValues = [],
  listDataAppHierDetail = [],
  listCriteria = [],
  selectedHierarchy,
  dataOption = [],
  countryCriteriaId,
}) => {
  const [typePricingInfo, setTypePricingInfo] = useState(
    listSectionInfo[0].value
  );
  const [typePricingDetail, setTypePricingDetail] = useState(
    listSectionPricingDetail[0].value
  );
  const showSection = () => {
    switch (typePricingInfo) {
      case listSectionInfo[0].value:
        const criteria = listCriteria.reduce(
          (current, next) => current + `, ${next}`,
          ""
        );
        return (
          <div>
            <div className="grid grid-cols-3 w-full">
              <DetailText label={"Price Code"}>{data.priceCode}</DetailText>
              <DetailText label={"Criteria"}>
                {criteria ? criteria.slice(1) : ""}
              </DetailText>
            </div>
            <div className="w-full">
              <DetailText label={"Description"}>
                {data.priceDescription}
              </DetailText>
            </div>
          </div>
        );
      case listSectionInfo[1].value:
        return (
          <ApprovalSectionForm
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
      case listSectionInfo[2].value:
        return (
          <AttachmentSectionForm type={"preview"} data={listDataAttachment} />
        );
      default:
        return <Fragment></Fragment>;
    }
  };
  const handlePricingInfo = (e) => {
    setTypePricingInfo(e.target.value);
  };
  const handlePricingDetail = (e) => {
    setTypePricingDetail(e.target.value);
  };
  return (
    <div className="flex flex-col gap-4">
      <RadioTabs
        data={listSectionInfo}
        onChange={handlePricingInfo}
        currentPosition={typePricingInfo}
      />
      <div className="flex flex-col gap-4">
        <div className="text-primary text-xs font-bold uppercase">
          {`${typePricingInfo} INFORMATION`}
        </div>
        {showSection()}
      </div>
      {typePricingInfo === listSectionInfo[0].value ? (
        <div className="flex flex-col gap-4">
          <div className="text-primary text-xs font-bold uppercase">
            {"PRICING DETAIL INFORMATION"}
          </div>

          <RadioTabs
            data={listSectionPricingDetail}
            onChange={handlePricingDetail}
            currentPosition={typePricingDetail}
          />
          {typePricingDetail === listSectionPricingDetail[0].value ? (
            <PricingDetailTableDetail type={"preview"} data={listDataDetail} />
          ) : (
            // <PricingDetailTableCriteria
            //   type={"preview"}
            //   data={listDataCriteria}
            //   dataCriteria={criteriaValues}
            // />
            <FunctionalCriteriaProduct
            type={"preview"}
            data={listDataCriteria}
            dataCriteria={criteriaValues}
            columnsTable={columnsTableCriteriaAll}
            countryCriteriaId={countryCriteriaId}
          />
          )}
        </div>
      ) : null}
    </div>
  );
};

export default ContentModalConfirmPricing;
