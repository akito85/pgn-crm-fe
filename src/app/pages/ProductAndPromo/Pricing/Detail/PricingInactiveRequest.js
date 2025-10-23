import moment from "moment";
import React from "react";
import { dateFormatting } from "../../../../../utils";
import DetailText from "../../../../../components/DetailText";

const PricingInactiveRequest = ({ data = {} }) => {
  return (
    <div className="grid grid-cols-4 w-full">
      <DetailText label={"Requested Date"}>
        {data.requestedDate
          ? moment(data.requestedDate).format(dateFormatting.dateTime)
          : ""}
      </DetailText>
      <DetailText label={"Requested By"}>{data.requestedBy}</DetailText>
      <DetailText label={"Remark"}>{data.remarks}</DetailText>
    </div>
  );
};

export default PricingInactiveRequest;
