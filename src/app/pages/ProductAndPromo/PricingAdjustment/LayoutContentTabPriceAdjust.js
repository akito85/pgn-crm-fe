import React from "react";
import BaseContainer from "../../../../components/BaseContainer";
import DetailText from "../../../../components/DetailText";
import PricingLogInformationDetail from "../Pricing/Detail/PricingLogInformationDetail";
import { lowerCaseStatus } from "../Product/utils";
import { columnsTableCriteriaAll } from "../UtilsProduct/TableCriteriaAllProduct";
import FunctionalCriteriaProduct from "../UtilsProduct/FunctionalCriteriaProduct";

const LayoutContentTabPriceAdjust = ({
  type = "detail",
  listDataDetailPricingAdjust = [],
  criteriaValues = [],
  setListDataDetailPricingAdjust = () => {},
  dataDetail = {},
  dataLogInformation = {},
  bodyPricing = {},
  countryCriteriaId,
}) => {
  return (
    <>
      <BaseContainer header={"PRICING DETAIL INFORMATION"}>
        <div className="grid grid-cols-4 w-full">
          <DetailText label={"Price Code"}>{bodyPricing.priceCode}</DetailText>
          <DetailText label={"Currency"}>{bodyPricing.currency}</DetailText>
          <DetailText label={"Value"}>{bodyPricing.value}</DetailText>
          <DetailText label={"UOM"}>{bodyPricing.uom}</DetailText>
        </div>
      </BaseContainer>
      <BaseContainer header={"PRICE ADJUSTMENT INFORMATION"}>
        <div className="grid grid-cols-4 w-full">
          <DetailText label={"Adjustment Id"}>
            {dataDetail.adjustmentId}
          </DetailText>
          <DetailText label={"Adjustment Name"}>
            {dataDetail.adjustmentName}
          </DetailText>
          <DetailText label={"Status"}>
            {dataDetail.status ? lowerCaseStatus(dataDetail.status) : ""}
          </DetailText>
          <DetailText label={"Status Approval"}>
            {dataDetail.statusApproval
              ? lowerCaseStatus(dataDetail.statusApproval)
              : ""}
          </DetailText>
        </div>
        <div>
          <DetailText label={"Criteria"}>{dataDetail.criteria}</DetailText>
          <DetailText label={"Description"}>
            {dataDetail.description}
          </DetailText>
        </div>
      </BaseContainer>
      <BaseContainer header={"PRICE ADJUSTMENT DETAIL INFORMATION"}>
        {/* <PricingAdjustTableDetail
          type={type}
          data={listDataDetailPricingAdjust}
          dataCriteria={criteriaValues}
          updateData={setListDataDetailPricingAdjust}
        /> */}
        <FunctionalCriteriaProduct
            data={listDataDetailPricingAdjust} //data
            dataCriteria={criteriaValues} //ddl
            type={"detail"}
            selector="pricingAdjust"
            columnsTable={columnsTableCriteriaAll}
            fixedColumn={[
              "ADJUSTMENT TYPE",
              "ADJUSTMENT VALUE",
              // "DESCRIPTION",
            ]}
            countryCriteriaId={countryCriteriaId}
          />
      </BaseContainer>
      <BaseContainer header={"HISTORY LOG INFORMATION"}>
        <PricingLogInformationDetail data={dataLogInformation} />
      </BaseContainer>
    </>
  );
};

export default LayoutContentTabPriceAdjust;
