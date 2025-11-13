import React from "react";
import SectionInfoProductDetail from "./SectionInfoProductDetail";
import Detail from "../../../PricingRule/Form/Detail";
import CardComponent from "../../../../../../components/Card/CardComponent";
import DetailText from "../../../../../../components/DetailText";
import { dateFormatting } from "../../../../../../utils";
import moment from "moment";

const ContentModalPricingRulePDI = ({
  dataPricing = {},
  dataDetailProduct = {},
  id = 0,
  data = [],
  type = "form",
  typeLog = false,
}) => {
  return (
    <div className="flex flex-col w-full gap-4">
      {type === "form" ? (
        <SectionInfoProductDetail dataDetailProduct={dataDetailProduct} />
      ) : null}
      <Detail data={data} type={"detail"} />
      {typeLog ? (
        <CardComponent header={"HISTORY LOG INFORMATION"} cols={5}>
          <DetailText label="Record ID">{dataPricing.id}</DetailText>
          <DetailText label="Created Date">
            {dataPricing?.createdDate
              ? moment(dataPricing.createdDate).format(dateFormatting.dateTime)
              : ""}
          </DetailText>
          <DetailText label="Created By">{dataPricing?.createdBy}</DetailText>
          <DetailText label="Updated Date">
            {dataPricing?.updatedDate
              ? moment(dataPricing.updatedDate).format(dateFormatting.dateTime)
              : ""}
          </DetailText>
          <DetailText label="Updated By">{dataPricing?.updatedBy}</DetailText>
        </CardComponent>
      ) : null}
    </div>
  );
};

export default ContentModalPricingRulePDI;
