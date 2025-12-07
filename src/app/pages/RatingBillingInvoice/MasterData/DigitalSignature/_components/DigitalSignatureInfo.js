import React from "react";
import CardComponent from "../../../../../components/Card/CardComponent";
import DetailText from "../../../../../components/DetailText";
import { Image } from "antd";

const DigitalSignatureInfo = ({ data }) => {
  return (
    <CardComponent header={"Digital Signature Information"} cols={2}>
      <DetailText label="Name">{data?.name || "-"}</DetailText>
      <div className="flex gap-3">
        <DetailText label="Employee">{data?.employeeCode || "-"}</DetailText>
        <DetailText label="Primary Position">
          {data?.primaryPosition || "-"}
        </DetailText>
      </div>

      <DetailText label="Description">{data?.description || "-"}</DetailText>
      <DetailText label="Signature">
        <Image src={data?.signatureBase64} />
      </DetailText>
    </CardComponent>
  );
};

export default DigitalSignatureInfo;
