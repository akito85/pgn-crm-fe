import { Fragment } from "react";
import React, { useEffect, useRef } from "react";
import moment from "moment";
import DetailText from "../../../../../../components/DetailText";

const ServicePointConfirm = ({ data = {} }) => {
  // useEffect(() => {},[]);
  return (
    <Fragment>
      <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
        {"SERVICE POINT INFORMATION"}
      </div>

      <div className="w-full grid grid-cols-2 gap-2">
        <div className="col-span-2">
          <DetailText label="Premise Address">
            {data?.accountAddressId}
          </DetailText>
        </div>
        <DetailText label="Service Point Name">
          {data?.servicePointName}
        </DetailText>
        <DetailText label="Description">{data?.description}</DetailText>
      </div>
    </Fragment>
  );
};

export default ServicePointConfirm;
