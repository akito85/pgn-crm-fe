import React from "react";
import CardComponent from "../../../../../components/Card/CardComponent";
import DetailText from "../../../../../components/DetailText";

const EFakturCodeInfo = ({ data }) => {
  return (
    <CardComponent header={""} cols={2}>
      <DetailText label="Efaktur Code">{data?.efakturCode || "-"}</DetailText>
      <div></div>
      <DetailText label="Description" className="col-span-2">
        {data?.description || "-"}
      </DetailText>
    </CardComponent>
  );
};

export default EFakturCodeInfo;
