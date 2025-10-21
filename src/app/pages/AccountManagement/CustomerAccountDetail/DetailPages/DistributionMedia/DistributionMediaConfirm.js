import { Fragment } from "react";
import React, { useEffect, useRef } from "react";
import moment from "moment";
import DetailText from "../../../../../../components/DetailText";

const DistributionMediaConfirm = ({ data = {} }) => {
  return (
    <Fragment>
      <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
        {"PRODUCT INFORMATION"}
      </div>

      <div className="w-full grid grid-cols-3 gap-3">
        <DetailText label="Media">{data?.productName}</DetailText>
        <DetailText label="Start Date">
          {moment(data?.startDate).format("DD MMM YYYY")}
        </DetailText>
        <DetailText label="Description">{data?.remark}</DetailText>
      </div>
    </Fragment>
  );
};

export default DistributionMediaConfirm;
