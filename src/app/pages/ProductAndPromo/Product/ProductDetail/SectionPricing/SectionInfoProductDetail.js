import React from "react";
import CardComponent from "../../../../../../components/Card/CardComponent";
import DetailText from "../../../../../../components/DetailText";
import moment from "moment";

const SectionInfoProductDetail = ({ dataDetailProduct = {} }) => {
  return (
    <CardComponent header={"PRODUCT INFORMATION"} cols={1}>
      <div className="w-full grid grid-cols-4 gap-4">
        <DetailText label={"Name"}>{dataDetailProduct.productName}</DetailText>
        <DetailText label={"Product Type"}>
          {dataDetailProduct.productType}
        </DetailText>
        <DetailText label={"Product Class"}>
          {dataDetailProduct.productClass}
        </DetailText>
        <DetailText label={"Service Type"}>
          {dataDetailProduct.serviceType}
        </DetailText>
        <DetailText label={"Start Date"}>
          {dataDetailProduct.startDate
            ? moment(dataDetailProduct.startDate).format("DD MMM YYYY")
            : ""}
        </DetailText>
        <DetailText label={"End Date"}>
          {dataDetailProduct.endDate &&
          dataDetailProduct.endDate !== "" &&
          dataDetailProduct.endDate !== "Invalid date"
            ? moment(dataDetailProduct.endDate).format("DD MMM YYYY")
            : ""}
        </DetailText>
      </div>
      <div className="w-full">
        <DetailText label={"Description"}>
          {dataDetailProduct.productDescription}
        </DetailText>
      </div>
    </CardComponent>
  );
};

export default SectionInfoProductDetail;
