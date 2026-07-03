import moment from "moment";
import React from "react";
import { dateFormatting } from "../../../../../utils";
import DetailText from "../../../../../components/DetailText";
import NxBaseContainer from "../../../../../components/Nx/NxBaseContainer";

const PricingLogInformationDetail = ({ data }) => {
  return (
    <NxBaseContainer border>
      <div className="w-full grid grid-cols-5 gap-5">
        {console.log(data, "data")}
        <DetailText label="Record ID">{data?.recordId}</DetailText>
        <DetailText label={"Created Date"}>
          {moment(data.createdDate).format(dateFormatting.dateTime)}
        </DetailText>
        <DetailText label={"Created By"}>{data.createdBy}</DetailText>
        <DetailText label={"Updated Date"}>
          {data.updatedDate
            ? moment(data.updatedDate).format(dateFormatting.dateTime)
            : ""}
        </DetailText>
        <DetailText label={"Updated By"}>{data.updatedBy}</DetailText>
      </div>
    </NxBaseContainer>
  );
};

export default PricingLogInformationDetail;
