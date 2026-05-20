import moment from "moment";
import React from "react";
import DetailText from "../../../../../components/DetailText";
import { dateFormatting } from "../../../../../utils";

const AdjustmentBillingInfoSection = ({
  data,
  apiType = [],
  apiBillingCycle = [],
  apiBillingPeriod = [],
  apiInvoice = [],
  apiAdjustmentReason = [],
  apiCurrency = [],
}) => {
  const labelType = apiType
    ?.filter((a) => a.id === data?.adjustmentType)
    ?.find((v) => v.name)?.name;

  const labelBillingCycle = apiBillingCycle
    ?.filter((a) => a.id === data?.billingCycle)
    ?.find((v) => v.period)?.period;

  const labelBillingPeriod = apiBillingPeriod
    ?.filter(
      (a) => a.id === (data?.correctionBillingPeriod ?? data?.billingPeriod),
    )
    ?.find((v) => v.period)?.period;

  const labelInvoice = apiInvoice
    ?.filter((a) => a.referenceInvoiceNumber === data?.referenceInvoiceNumber)
    ?.find((v) => v.referenceInvoiceNumber)?.referenceInvoiceNumber;

  const labelAdjustmentReason = apiAdjustmentReason
    ?.filter((a) => a.Id === data?.adjustmentReason)
    ?.find((v) => v.text)?.text;

  const labelCurrency = apiCurrency
    ?.filter((a) => a.Id === data?.currency)
    ?.find((v) => v.text)?.text;

  const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return !isNaN(date);
  };

  return (
    <div className="w-full grid grid-cols-5 gap-4">
      <DetailText label={"Type"}>
        {labelType ? labelType : data?.adjustmentTypeName}
      </DetailText>
      <DetailText label={"Billing Cycle"}>
        {labelBillingCycle ? labelBillingCycle : data?.billingCycleName}
      </DetailText>
      <DetailText label={"Current Billing Period"}>
        {data?.currentBillingPeriodName ||
          data?.currentBillingPeriod ||
          data?.billingPeriodName}
      </DetailText>
      <DetailText label={"Correction Billing Period"}>
        {labelBillingPeriod
          ? labelBillingPeriod
          : data?.correctionBillingPeriodName || data?.billingPeriodName}
      </DetailText>
      <DetailText label={"Invoice Number"}>
        {typeof data?.referenceInvoiceNumber === "string"
          ? data?.referenceInvoiceNumber
          : labelInvoice}
      </DetailText>
      <DetailText label={"Currency"}>
        {typeof data?.currency === "string" ? data?.currency : labelCurrency}
      </DetailText>
      <DetailText label={"Rate"}>{data?.rate}</DetailText>
      <DetailText label={"Document Date"}>
        {data?.documentDate
          ? moment(data?.documentDate).format(dateFormatting.date)
          : ""}
      </DetailText>
      <DetailText label={"Transaction Date"}>
        {data?.transactionDate
          ? moment(data?.transactionDate).format(dateFormatting.date)
          : ""}
      </DetailText>
      <DetailText label={"Accounting Date"}>
        {data?.accountingDate
          ? moment(data?.accountingDate).format(dateFormatting.date)
          : ""}
      </DetailText>

      <DetailText label={"Terms Of Payment"}>
        {moment.isMoment(data?.termsOfPayment) === true &&
        isValidDate(data?.termsOfPayment) === true
          ? moment(data?.termsOfPayment).format(dateFormatting.date)
          : data?.termsOfPayment}
      </DetailText>

      <DetailText label={"Adjustment Reason"}>
        {labelAdjustmentReason
          ? labelAdjustmentReason
          : data?.adjustmentReasonName}
      </DetailText>

      <DetailText label={"Classification Adjustment"}>
        {data?.classification}
      </DetailText>

      <DetailText label={"Post Invoice"}>{data?.postInvoice}</DetailText>

      <DetailText label={"On Demand"}>{data?.onDemand}</DetailText>

      <div className="col-span-5">
        <DetailText label={"Remark"}>{data?.remark}</DetailText>
      </div>
    </div>
  );
};

export default AdjustmentBillingInfoSection;
