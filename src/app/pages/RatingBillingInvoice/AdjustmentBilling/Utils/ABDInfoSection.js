import React, { Fragment } from "react";
import moment from "moment";
import { dateFormatting } from "../../../../../utils";
import DetailText from "../../../../../components/DetailText";
import InvoiceSectionForm from "../Form/InvoiceSectionForm";
import AdjustmentBillingInfoSection from "./AdjustmentBillingInfoSection";
import CustomerInfoSection from "./CustomerInfoSection";
import AdjustmentBISectionForm from "../Form/AdjustmentBISectionForm";
import { currencyFormatting } from "../../../../../utils/formatCurrency";
import CardContainer from "../../../../../components/CardContainer";

const ABDInfoSection = ({ data, listDataABI = [] }) => {
  // Sum Total Adjustment IDR
  let dataIDR = listDataABI
    .filter((v) => v.currency === "IDR")
    .map((a) => a.adjustmentAmount);
  const sumIDR = dataIDR.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0,
  );

  // Sum Total Adjustment USD
  let dataUSD = listDataABI
    .filter((v) => v.currency === "USD")
    .map((a) => a.adjustmentAmount);
  const sumUSD = dataUSD.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0,
  );

  return (
    <Fragment>
      <CardContainer header={"CUSTOMER INFORMATION"}>
        <CustomerInfoSection data={data} />
      </CardContainer>

      <CardContainer header={"ADJUSTMENT BILLING INFORMATION"}>
        <AdjustmentBillingInfoSection data={data} />
      </CardContainer>
      <CardContainer header={"INVOICE INFORMATION"}>
        <InvoiceSectionForm
          listDataABI={listDataABI}
          type={"detail"}
          data={data?.invoiceInformation}
        />
      </CardContainer>

      <CardContainer header={"Adjustment Billing Item Information"}>
        <AdjustmentBISectionForm
          listDataABI={listDataABI}
          type="detail"
          // showAction={"show"}
          // children={
          //   <div className="w-full grid grid-cols-2 gap-4">
          //     <DetailText label={"Total Adjustment IDR"}>
          //       {sumIDR ? currencyFormatting(sumIDR, "idr") : sumIDR}
          //     </DetailText>
          //     <DetailText label={"Total Adjustment USD"}>
          //       {sumUSD ? currencyFormatting(sumUSD, "idr") : sumUSD}
          //     </DetailText>
          //   </div>
          // }
        />
      </CardContainer>

      <CardContainer header={"HISTORY LOG INFORMATION"}>
        <div className="w-full grid grid-cols-5 gap-3">
          <DetailText label="Record ID">{data?.id}</DetailText>
          <DetailText label="Created Date">
            {data?.createdDate
              ? moment(data.createdDate).format(dateFormatting.dateTime)
              : "-"}
          </DetailText>
          <DetailText label="Created By">{data?.createdBy}</DetailText>
          <DetailText label="Updated Date">
            {data?.updatedDate
              ? moment(data.updatedDate).format(dateFormatting.dateTime)
              : "-"}
          </DetailText>
          <DetailText label="Updated By">{data?.updatedBy}</DetailText>
        </div>
      </CardContainer>
    </Fragment>
  );
};

export default ABDInfoSection;
