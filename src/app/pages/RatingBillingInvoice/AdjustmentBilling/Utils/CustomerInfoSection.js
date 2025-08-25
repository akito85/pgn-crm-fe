import React from "react";
import DetailText from "../../../../../components/DetailText";

const CustomerInfoSection = ({ data }) => {
  return (
    <div className="w-full grid grid-cols-4 gap-4">
      <DetailText label={"Customer Number"}>{data?.customerNumber}</DetailText>
      <DetailText label={"Customer Name"}>{data?.customerName}</DetailText>
      <DetailText label={"Account Number"}>{data?.accountNumber}</DetailText>
      <DetailText label={"Account Name"}>{data?.accountName}</DetailText>
      {/* <DetailText label={"Service Agreement Class"}>{data?.serviceAgreementClass}</DetailText> */}
      <DetailText label={"Account Segment"}>{data?.accountSegment}</DetailText>
      <DetailText label={"Account Group Type"}>{data?.accountGroupType}</DetailText>
      <DetailText label={"SOR"}>{data?.sor}</DetailText>
      <DetailText label={"Cost Center Code"}>{data?.costCenterCode}</DetailText>
      <DetailText label={"Cost Center Name"}>{data?.costCenterName}</DetailText>
      <DetailText label={"Meter Reading Code"}>{data?.meterReadingCode}</DetailText>
    </div>
  );
};

export default CustomerInfoSection;
