import React from "react";

import { Fragment } from "react";
import DetailText from "../../../../../../components/DetailText";
import MiniBaseContainer from "../../../../../../components/MiniBaseContainer";

const HeaderServicePoint = ({ data = {} }) => {
  return (
    <Fragment>
      <MiniBaseContainer header={"Premise Information"}>
        <div className="w-full">
          <DetailText label="Premise Address">
            {data?.premiseAddress}
          </DetailText>
        </div>

        <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
          {"SERVICE POINT INFORMATION"}
        </div>

        <div className="w-full grid grid-cols-2 gap-2">
          <DetailText label="Service Point Name">
            {data?.servicePointName}
          </DetailText>
          <DetailText label="Description">{data?.description}</DetailText>
        </div>
      </MiniBaseContainer>
    </Fragment>
  );
};

export default HeaderServicePoint;
