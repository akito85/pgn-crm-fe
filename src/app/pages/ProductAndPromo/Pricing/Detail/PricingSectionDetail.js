import React from "react";
import DetailText from "../../../../../components/DetailText";
import { lowerCaseStatus } from "../../Product/utils";

const PricingSectionDetail = ({ data }) => {
  return (
    <>
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
    </>
  );
};

export default PricingSectionDetail;
