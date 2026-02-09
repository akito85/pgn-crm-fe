import React from "react";
import DetailSection from "../../../../../components/DetailSection";
import DetailText from "../../../../../components/DetailText";

const DetailLiborRate = (props) => {
  const { data } = props;

  return (
    <div className="flex flex-col gap-2">
      <DetailSection header={"LIBOR RATE INFORMATION"}>
        <div className="grid grid-cols-2 gap-5">
          <DetailText label="Source Code">{data?.rateSource?.sourceCode}</DetailText>
          <DetailText label="Source Name">{data?.rateSource?.sourceName}</DetailText>
        </div>
        <div className="grid grid-cols-1 gap-5 mt-5">
          <DetailText label="Description">{data?.rateSource?.description}</DetailText>
        </div>
      </DetailSection>
    </div>
  );
};

export default DetailLiborRate;
