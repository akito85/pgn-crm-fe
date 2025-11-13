import React from "react";
import moment from "moment";
import BaseContainer from "../../../../../components/BaseContainer";
import DetailText from "../../../../../components/DetailText";
import { dateFormatting } from "../../../../../utils";
import { currencyFormatting } from "../../../../../utils/formatCurrency";

const InvoiceSectionForm = ({ data, type, listDataABI = [] }) => {
  const renderStatus = (status) => {
    let text;
    switch (status) {
      case "WAITING APPROVAL":
        text = "Waiting Approval";
        break;
      case "INPROGRESS":
        text = "In Progress";
        break;
      default:
        text = status
          ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
          : status;
        break;
    }
    return text ? text : text;
  };

  return (
    <div>
      {type === "create" || type === "update" ? (
        <BaseContainer header={"Invoice Information"}>
          <div className="w-full grid grid-cols-4 gap-4">
            <DetailText label={"Invoice Number"}>
              {data?.invoiceNumber}
            </DetailText>
            <DetailText label={"Billing Code"}>{data?.billingCode}</DetailText>
            <DetailText label={"Invoice Date"}>
              {data?.invoiceDate
                ? moment(data?.invoiceDate).format(dateFormatting.date)
                : data?.invoiceDate}
            </DetailText>
            <DetailText label={"Terms Of Payment"}>
              {data?.termsOfPayment}
            </DetailText>
            <DetailText label={"Billing Cycle"}>
              {data?.billingCycle}
            </DetailText>
            <DetailText label={"Billing Period"}>
              {data?.billingPeriod
                ? moment(data?.billingPeriod).format(dateFormatting.datePeriod)
                : data?.billingPeriod}
            </DetailText>
            <DetailText label={"Total Amount IDR"}>
              {data?.totalAmountIdr
                ? currencyFormatting(data?.totalAmountIdr, "idr")
                : data?.totalAmountIdr}
            </DetailText>
            <DetailText label={"Total Amount USD"}>
              {data?.totalAmountUsd
                ? currencyFormatting(data?.totalAmountUsd, "usd")
                : data?.totalAmountUsd}
            </DetailText>
            <DetailText label={"Total Amount EQV IDR"}>
              {data?.totalAmountEqvIdr
                ? currencyFormatting(data?.totalAmountEqvIdr, "idr")
                : data?.totalAmountEqvIdr}
            </DetailText>
            <DetailText label={"Total Amount EQV USD"}>
              {data?.totalAmountEqvUsd
                ? currencyFormatting(data?.totalAmountEqvUsd, "usd")
                : data?.totalAmountEqvUsd}
            </DetailText>
            <DetailText label={"Currency"}>{data?.currency}</DetailText>
            <DetailText label={"Withholding Tax"}>
              {data?.withholdingTax
                ? currencyFormatting(data?.withholdingTax, "idr")
                : data?.withholdingTax || 0}
            </DetailText>
            <DetailText label={"Tax Basis IDR"}>
              {data?.taxBasicIdr
                ? currencyFormatting(data?.taxBasicIdr, "idr")
                : data?.taxBasicIdr}
            </DetailText>
            <DetailText label={"Tax Basis USD"}>
              {data?.taxBasicUsd
                ? currencyFormatting(data?.taxBasicUsd, "usd")
                : data?.taxBasicUsd}
            </DetailText>
            <DetailText label={"VAT IDR"}>
              {data?.vatIdr
                ? currencyFormatting(data?.vatIdr, "idr")
                : data?.vatIdr}
            </DetailText>
            <DetailText label={"VAT USD"}>
              {data?.vatUsd
                ? currencyFormatting(data?.vatUsd, "usd")
                : data?.vatUsd}
            </DetailText>
            <DetailText label={"Rate"}>
              {data?.rate ? currencyFormatting(data?.rate, "idr") : data?.rate}
            </DetailText>
            <DetailText label={"Rate Type"}>{data?.rateType}</DetailText>
            <DetailText label={"Rate Date"}>
              {data?.rateDate
                ? moment(data?.rateDate).format(dateFormatting.date)
                : data?.rateDate}
            </DetailText>
            <DetailText label={"Status"}>
              {renderStatus(data?.status)}
            </DetailText>
          </div>
        </BaseContainer>
      ) : (
        <div className="w-full grid grid-cols-4 gap-4">
          <DetailText label={"Invoice Number"}>
            {data?.invoiceNumber}
          </DetailText>
          <DetailText label={"Billing Code"}>{data?.billingCode}</DetailText>
          <DetailText label={"Invoice Date"}>
            {data?.invoiceDate
              ? moment(data?.invoiceDate).format(dateFormatting.date)
              : data?.invoiceDate}
          </DetailText>
          <DetailText label={"Terms Of Payment"}>
            {data?.termsOfPayment}
          </DetailText>
          <DetailText label={"Billing Cycle"}>{data?.billingCycle}</DetailText>
          <DetailText label={"Billing Period"}>
            {data?.billingPeriod
              ? moment(data?.billingPeriod).format(dateFormatting.datePeriod)
              : data?.billingPeriod}
          </DetailText>
          <DetailText label={"Total Amount IDR"}>
            {data?.totalAmountIdr
              ? currencyFormatting(data?.totalAmountIdr, "idr")
              : data?.totalAmountIdr}
          </DetailText>
          <DetailText label={"Total Amount USD"}>
            {data?.totalAmountUsd
              ? currencyFormatting(data?.totalAmountUsd, "usd")
              : data?.totalAmountUsd}
          </DetailText>
          <DetailText label={"Total Amount EQV IDR"}>
            {data?.totalAmountEqvIdr
              ? currencyFormatting(data?.totalAmountEqvIdr, "idr")
              : data?.totalAmountEqvIdr}
          </DetailText>
          <DetailText label={"Total Amount EQV USD"}>
            {data?.totalAmountEqvUsd
              ? currencyFormatting(data?.totalAmountEqvUsd, "usd")
              : data?.totalAmountEqvUsd}
          </DetailText>
          <DetailText label={"Currency"}>{data?.currency}</DetailText>
          <DetailText label={"Withholding Tax"}>
            {data?.withholdingTax
              ? currencyFormatting(data?.withholdingTax, "idr")
              : data?.withholdingTax || 0}
          </DetailText>
          <DetailText label={"Tax Basis IDR"}>
            {data?.taxBasicIdr
              ? currencyFormatting(data?.taxBasicIdr, "idr")
              : data?.taxBasicIdr}
          </DetailText>
          <DetailText label={"Tax Basis USD"}>
            {data?.taxBasicUsd
              ? currencyFormatting(data?.taxBasicUsd, "usd")
              : data?.taxBasicUsd}
          </DetailText>
          <DetailText label={"VAT IDR"}>
            {data?.vatIdr
              ? currencyFormatting(data?.vatIdr, "idr")
              : data?.vatIdr}
          </DetailText>
          <DetailText label={"VAT USD"}>
            {data?.vatUsd
              ? currencyFormatting(data?.vatUsd, "usd")
              : data?.vatUsd}
          </DetailText>
          <DetailText label={"Rate"}>
            {data?.rate ? currencyFormatting(data?.rate, "idr") : data?.rate}
          </DetailText>
          <DetailText label={"Rate Type"}>{data?.rateType}</DetailText>
          <DetailText label={"Rate Date"}>
            {data?.rateDate
              ? moment(data?.rateDate).format(dateFormatting.date)
              : data?.rateDate}
          </DetailText>
          <DetailText label={"Status"}>{renderStatus(data?.status)}</DetailText>
        </div>
      )}
    </div>
  );
};

export default InvoiceSectionForm;
