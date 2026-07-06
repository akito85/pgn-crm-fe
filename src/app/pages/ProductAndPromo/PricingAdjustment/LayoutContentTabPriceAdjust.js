import React from "react";
import BaseContainer from "../../../../components/BaseContainer";
import DetailText from "../../../../components/DetailText";
import PricingLogInformationDetail from "../Pricing/Detail/PricingLogInformationDetail";
import { lowerCaseStatus } from "../Product/utils";
import { columnsTableCriteriaAll } from "../UtilsProduct/TableCriteriaAllProduct";
import FunctionalCriteriaProduct from "../UtilsProduct/FunctionalCriteriaProduct";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import NxBaseContainer from "../../../../components/Nx/NxBaseContainer";

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
      <NxCardContainer header={"PRICING DETAIL INFORMATION"}>
        <NxBaseContainer border>
          <div className="grid grid-cols-4 w-full">
            <DetailText label={"Price Code"}>{bodyPricing.priceCode}</DetailText>
            <DetailText label={"Currency"}>{bodyPricing.currency}</DetailText>
            <DetailText label={"Value"}>{bodyPricing.value}</DetailText>
            <DetailText label={"UOM"}>{bodyPricing.uom}</DetailText>
          </div>
        </NxBaseContainer>
      </NxCardContainer>
      <NxCardContainer header={"PRICE ADJUSTMENT INFORMATION"}>
        <NxBaseContainer border>
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
        </NxBaseContainer>
      </NxCardContainer>
      <NxCardContainer header={"PRICE ADJUSTMENT DETAIL INFORMATION"}>
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
      </NxCardContainer>
      <NxCardContainer header={"HISTORY LOG INFORMATION"}>
        <PricingLogInformationDetail data={dataLogInformation} />
      </NxCardContainer>
    </>
  );
};

export default LayoutContentTabPriceAdjust;
