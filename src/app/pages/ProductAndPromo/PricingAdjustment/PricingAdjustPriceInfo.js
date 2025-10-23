import React from "react";
import DetailText from "../../../../components/DetailText";

export const PricingAdjustPriceInfo = ({ data, type, prevPage }) => {
  return (
    <div className="grid grid-cols-4 w-full">
      <DetailText label={"Price Code"}>{data.priceCode}</DetailText>
      {type === "create" && prevPage !== "detail-pricing" ? (
        <div className="col-span-3">
          <DetailText label={"Description"}>{data.description}</DetailText>
        </div>
      ) : (
        <>
          <DetailText label={"Currency"}>{data.currency}</DetailText>
          <DetailText label={"Value"}>{data.value}</DetailText>
          <DetailText label={"UOM"}>{data.uom}</DetailText>
        </>
      )}
    </div>
  );
};
