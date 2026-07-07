import React from "react";
import DetailText from "../../../../../components/DetailText";
import { lowerCaseStatus } from "../../Product/utils";
import NxBaseContainer from "../../../../../components/Nx/NxBaseContainer";

const PricingSectionDetail = ({ data }) => {
  return (
    <NxBaseContainer border>
      <div className="grid grid-cols-4 w-full">
        <DetailText label={"Price Code"}>{data.priceCode}</DetailText>
        <DetailText label={"Status"}>
          {data.status ? lowerCaseStatus(data.status) : ""}
        </DetailText>
        <DetailText label={"Status Approval"}>
          {data.statusApproval ? lowerCaseStatus(data.statusApproval) : ""}
        </DetailText>
      </div>
      <div className="w-full">
        <DetailText label={"Criteria"}>{data.criteria}</DetailText>
        <DetailText label={"Description"}>{data.description}</DetailText>
      </div>
    </NxBaseContainer>
  );
};

export default PricingSectionDetail;
