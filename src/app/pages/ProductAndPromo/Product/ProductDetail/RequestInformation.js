import React from "react";
import DetailText from "../../../../../components/DetailText";
import moment from "moment";
import { dateFormat } from "../../../../../utils";
import NxBaseContainer from "../../../../../components/Nx/NxBaseContainer";

const RequestInformation = ({ data = {}, status = "" }) => {
  return (
    <NxBaseContainer border>
      <div className="grid grid-cols-4 w-full">
        {status !== "INACTIVE_PRODUCT" ? (
          <DetailText label={"New End Date"}>
            {data.newEndDate ? moment(data.newEndDate).format(dateFormat) : ""}
          </DetailText>
        ) : null}
        <DetailText label={"Requested Date"}>
          {data.requestedDate
            ? moment(data.requestedDate).format(dateFormat)
            : ""}
        </DetailText>
        <DetailText label={"Requested By"}>{data.requestedBy}</DetailText>
        <DetailText label={"Remark"}>{data.remarks}</DetailText>
      </div>
    </NxBaseContainer>
  );
};

export default RequestInformation;
