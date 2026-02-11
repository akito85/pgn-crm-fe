import React from "react";
import DetailSection from "../../../../../components/DetailSection";
import DetailText from "../../../../../components/DetailText";
import dayjs from "dayjs";

const DetailLiborRate = (props) => {
  const { data } = props;
  const rateSource = data?.rateSource || {};
  const rateIndex = data?.rateIndex || {};

  return (
    <div className="flex flex-col gap-2">
      <DetailSection header={"SOURCE INFORMATION"}>
        <div className="grid grid-cols-5 gap-5">
          <DetailText label="Source Code">{rateSource.sourceCode}</DetailText>
          <DetailText label="Source Name">{rateSource.sourceName}</DetailText>
          <DetailText label="Description">{rateSource.description || "-"}</DetailText>
        </div>
      </DetailSection>

      <DetailSection header={"RATE INDEX INFORMATION"}>
        <div className="grid grid-cols-5 gap-5">
          <DetailText label="Index Code">{rateIndex.indexCode}</DetailText>
          <DetailText label="Index Name">{rateIndex.indexName}</DetailText>
          <DetailText label="Tenor">{rateIndex.tenorValue}</DetailText>
          <DetailText label="Rate Percentage">{rateIndex.ratePercentage}</DetailText>
          <DetailText label="Unit">{rateIndex.tenorUnit}</DetailText>
          <DetailText label="Currency">{rateIndex.currencyCode}</DetailText>
          <DetailText label="Start Date">{rateIndex.startDate ? dayjs(rateIndex.startDate).format("YYYY-MM-DD") : "-"}</DetailText>
          <DetailText label="End Date">{rateIndex.endDate ? dayjs(rateIndex.endDate).format("YYYY-MM-DD") : "-"}</DetailText>
        </div>
        <div className="grid grid-cols-1 gap-5 mt-5">
          <DetailText label="Description">{rateIndex.remarks || "-"}</DetailText>
        </div>
      </DetailSection>

      <DetailSection header={"HISTORY LOG INFORMATION"}>
        <div className="grid grid-cols-5 gap-5">
          <DetailText label="Record ID">{rateIndex.id}</DetailText>
          <DetailText label="Created Date">{rateIndex.createdDate ? dayjs(rateIndex.createdDate).format("DD MMM YYYY HH:mm:ss") : "-"}</DetailText>
          <DetailText label="Created By">{rateIndex.createdBy}</DetailText>
          <DetailText label="Updated Date">{rateIndex.updatedDate ? dayjs(rateIndex.updatedDate).format("DD MMM YYYY HH:mm:ss") : "-"}</DetailText>
          <DetailText label="Updated By">{rateIndex.updatedBy || "-"}</DetailText>
        </div>
      </DetailSection>
    </div>
  );
};

export default DetailLiborRate;
