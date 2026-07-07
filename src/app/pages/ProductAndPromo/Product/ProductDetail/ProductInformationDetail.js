import React from "react";
import DetailText from "../../../../../components/DetailText";
import NxBaseContainer from "../../../../../components/Nx/NxBaseContainer";

const ProductInformationDetail = ({ data }) => {
  return (
    <NxBaseContainer border>
      <div className="grid grid-cols-4 w-full gap-2">
        <DetailText label={"Product Name"}>{data.productName}</DetailText>
        <DetailText label={"Product Type"}>{data.productType}</DetailText>
        <DetailText label={"Product Class"}>{data.productClass}</DetailText>
        <DetailText label={"Service Type"}>{data.serviceType}</DetailText>

        <DetailText label={"Pricing"}>{data.pricing || ""}</DetailText>
        <DetailText label={"Locked By"}>{data.lockedBy || ""}</DetailText>
        <DetailText label={"Start Date"}>{data.startDate || ""}</DetailText>
        <DetailText label={"End Date"}>
          {data.endDate && data.endDate !== "-" ? `${data.endDate}` : ""}
        </DetailText>

        <DetailText label={"Status"}>{data.status || ""}</DetailText>
        <DetailText label={"Status Approval"}>
          {data.statusApproval || ""}
        </DetailText>
      </div>
      <div className="w-full">
        <DetailText label={"Description"}>{data.productDescription}</DetailText>
      </div>
    </NxBaseContainer>
    // <div>
    // </div>
  );
};

export default ProductInformationDetail;
