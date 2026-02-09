import React from "react";
import DetailSection from "../../../../../../components/DetailSection";
import DetailText from "../../../../../../components/DetailText";
import dayjs from "dayjs";

const DetailRateIndex = (props) => {
  const { data } = props;
  const rateIndex = data?.rateIndex || {};

  return (
    <div className="flex flex-col gap-2">
      <DetailSection header={"RATE INDEX INFORMATION"}>
        <div className="grid grid-cols-2 gap-5">
          <DetailText label="Index Code">{rateIndex.indexCode}</DetailText>
          <DetailText label="Index Name">{rateIndex.indexName}</DetailText>
          <DetailText label="Currency">{rateIndex.currencyCode}</DetailText>
          <DetailText label="Tenor">{`${rateIndex.tenorValue} ${rateIndex.tenorUnit}`}</DetailText>
          <DetailText label="Rate Percentage">{`${rateIndex.ratePercentage}%`}</DetailText>
        </div>
        <div className="grid grid-cols-2 gap-5 mt-5">
          <DetailText label="Start Date">{rateIndex.startDate ? dayjs(rateIndex.startDate).format("YYYY-MM-DD") : "-"}</DetailText>
          <DetailText label="End Date">{rateIndex.endDate ? dayjs(rateIndex.endDate).format("YYYY-MM-DD") : "-"}</DetailText>
        </div>
        <div className="grid grid-cols-1 gap-5 mt-5">
          <DetailText label="Description">{rateIndex.remarks || "-"}</DetailText>
        </div>
      </DetailSection>
    </div>
  );
};

export default DetailRateIndex;
