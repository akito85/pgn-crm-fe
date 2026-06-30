import React, { useState } from "react";
import { PricingAdjustPriceInfo } from "./PricingAdjustPriceInfo";
import ApprovalSectionForm from "../Pricing/Form/ApprovalSectionForm";
import AttachmentSectionForm from "../Pricing/Form/AttachmentSectionForm";
import DetailText from "../../../../components/DetailText";
import { Fragment } from "react";
import RadioTabs from "../../../../components/RadioTabs";
import { columnsTableCriteriaAll } from "../UtilsProduct/TableCriteriaAllProduct";
import FunctionalCriteriaProduct from "../UtilsProduct/FunctionalCriteriaProduct";

const ContentModalConfirmPriceAdjust = ({
  type,
  prevPage,
  data,
  detailInfo = {},
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
  const handlePriceAdjustInfo = (e) => {
    setTypePricingInfo(e.target.value);
  };

  const showSection = () => {
    switch (typePricingInfo) {
      case listSectionInfo[0].value:
        const criteria = listCriteria.reduce(
          (current, next) => current + `, ${next}`,
          ""
        );
        return (
          <>
            <div className="flex flex-col gap-4">
              <div className="text-primary text-xs font-bold uppercase">
                {"PRICING DETAIL INFORMATION"}
              </div>
              <PricingAdjustPriceInfo
                data={detailInfo}
                type={"create"}
                prevPage={"detail-pricing"}
              />
            </div>
            <div className="flex flex-col gap-4">
              <div className="text-primary text-xs font-bold uppercase">
                {"PRICE ADJUSTMENT INFORMATION"}
              </div>
              <div className="grid grid-cols-4 w-full">
                <DetailText label={"Adjustment Name"}>
                  {data.adjustName}
                </DetailText>
                <DetailText label={"Criteria"}>
                  {criteria ? criteria.slice(1) : ""}
                </DetailText>
                <DetailText label={"Description"}>
                  {data.priceAdjustDescription}
                </DetailText>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="text-primary text-xs font-bold uppercase">
                {"PRICE ADJUSTMENT DETAIL INFORMATION"}
              </div>
              <FunctionalCriteriaProduct
                type={"preview"}
                data={listDataCriteria || []} //data
                dataCriteria={criteriaValues || []} //ddl
                columnsTable={columnsTableCriteriaAll}
                fixedColumn={["ADJUSTMENT TYPE", "ADJUSTMENT VALUE"]}
                countryCriteriaId={countryCriteriaId}
              />
              {/* <PricingAdjustTableDetail
                type={"detail"}
                data={listDataCriteria}
                dataCriteria={criteriaValues}
              /> */}
            </div>
          </>
        );
      case listSectionInfo[1].value:
        return (
          <div className="flex flex-col gap-4">
            <div className="text-primary text-xs font-bold uppercase">
              {"APPROVAL INFORMATION"}
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
              selectedHierarchy
            />
          </div>
        );
      case listSectionInfo[2].value:
        return (
          <div className="flex flex-col gap-4">
            <div className="text-primary text-xs font-bold uppercase">
              {"ATTACHMENT INFORMATION"}
            </div>
            <AttachmentSectionForm type={"preview"} data={listDataAttachment} />
          </div>
        );
      default:
        return <Fragment></Fragment>;
    }
  };

  const filterSection = (listSection) => {
    if (type === "create" && prevPage !== "detail-pricing") {
      return listSection.filter((item) => item.value !== "Attachment");
    }
    return listSection;
  };

  return (
    <div className="flex flex-col gap-4">
      <RadioTabs
        data={filterSection(listSectionInfo)}
        onChange={handlePriceAdjustInfo}
        currentPosition={typePricingInfo}
      />

      {showSection()}
    </div>
  );
};

export default ContentModalConfirmPriceAdjust;
