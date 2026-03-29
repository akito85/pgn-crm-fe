import React from "react";
import DetailText from "../../../../components/DetailText";
import SectionCard from "../../../../components/SectionCard";
import moment from "moment";
import { dateFormatting } from "../../../../utils";

const DetailReceipt = ({ data_detail }) => {
  return (
    <div className="flex flex-col gap-4 pb-5 px-5 pt-5">
      <SectionCard title="CUSTOMER INFORMATION">
        <div className="grid grid-cols-5 w-full gap-y-4 gap-x-4">
          <DetailText label="Miscellaneous">{data_detail?.miscellaneous || "-"}</DetailText>
          <DetailText label="Customer Type">{data_detail?.customerType || "-"}</DetailText>
          <DetailText label="Account / Registration Number">{data_detail?.accountNumber || "-"}</DetailText>
          <DetailText label="Account Name">{data_detail?.accountName || "-"}</DetailText>
          <DetailText label="Customer Number">{data_detail?.customerNumber || "-"}</DetailText>
          <DetailText label="Customer Name">{data_detail?.customerName || "-"}</DetailText>
          <DetailText label="Account Segment">{data_detail?.accountSegment || "-"}</DetailText>
          <DetailText label="Account Group Type">{data_detail?.accountGroupType || "-"}</DetailText>
          <DetailText label="Account Type">{data_detail?.accountType || "-"}</DetailText>
          <DetailText label="Classification Type">{data_detail?.classificationType || "-"}</DetailText>
          <DetailText label="SOR">{data_detail?.sor || "-"}</DetailText>
          <DetailText label="Cost Center">{data_detail?.costCenter || "-"}</DetailText>
          <DetailText label="Meter Reading Code">{data_detail?.meterReadingCode || "-"}</DetailText>
        </div>
      </SectionCard>

      <SectionCard title="RECEIPT INFORMATION">
        <div className="w-full grid grid-cols-5 gap-y-4 gap-x-4">
          <DetailText label="Receipt Code">{data_detail?.receiptCode || "-"}</DetailText>
          <DetailText label="Receipt Number">{data_detail?.receiptNumber || "-"}</DetailText>
          <DetailText label="Receipt Channel">{data_detail?.receiptChannel || "-"}</DetailText>
          <DetailText label="Payment Type">{data_detail?.paymentType || "-"}</DetailText>
          <DetailText label="Partner">{data_detail?.paymentGateway || "-"}</DetailText>
          <DetailText label="Collecting Agent">{data_detail?.collectingAgent || "-"}</DetailText>
          <DetailText label="Delivery Channel">{data_detail?.deliveryChannel || "-"}</DetailText>
          <DetailText label="Receipt Method">{data_detail?.paymentMethod || "-"}</DetailText>
          <DetailText label="Bank">{data_detail?.bank || "-"}</DetailText>
          <DetailText label="Receipt Date">
            {data_detail?.receiptDate ? moment(data_detail?.receiptDate).format(dateFormatting.dateTime) : "-"}
          </DetailText>
          <DetailText label="Source">{data_detail?.source || "-"}</DetailText>
          <DetailText label="Status">{data_detail?.status || "-"}</DetailText>
          <div className="col-span-1" />
          <div className="col-span-1" />
          <div className="col-span-1" />
          <div className="col-span-5">
            <DetailText label="Remark">{data_detail?.remark || "-"}</DetailText>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="AMOUNT INFORMATION">
        <div className="w-full grid grid-cols-5 gap-y-4 gap-x-4">
          <DetailText label="Currency">{data_detail?.currency || "-"}</DetailText>
          <DetailText label="Amount">{data_detail?.amount || "-"}</DetailText>
          <DetailText label="Rate Type">{data_detail?.rateType || "-"}</DetailText>
          <DetailText label="Rate Date">
            {data_detail?.rateDate ? moment(data_detail?.rateDate).format(dateFormatting.dateCapital) : "-"}
          </DetailText>
          <DetailText label="Converted Currency">{data_detail?.convertedCurrency || "-"}</DetailText>
          <DetailText label="Rate">{data_detail?.rateAmount || "-"}</DetailText>
          <DetailText label="Equivalent Amount">{data_detail?.equivalentAmount || "-"}</DetailText>
          <DetailText label="Unapplied Amount / Balance">{data_detail?.unAppliedAmount || "-"}</DetailText>
          <DetailText label="Applied Amount">{data_detail?.appliedAmount || "-"}</DetailText>
          <DetailText label="Applied Equivalent Amount">{data_detail?.equivalentAppliedAmount || "-"}</DetailText>
          <DetailText label="Unapplied Equivalent Amount">{data_detail?.equivalentUnAppliedAmount || "-"}</DetailText>
          <DetailText label="Unidentified Amount">{data_detail?.unidentifiedAmount || "-"}</DetailText>
          <DetailText label="Hold Amount">{data_detail?.holdAmount || "-"}</DetailText>
          <DetailText label="Refund Amount">{data_detail?.refundAmount || "-"}</DetailText>
          <DetailText label="Transfer Amount">{data_detail?.transferAmount || "-"}</DetailText>
          <div className="col-span-5">
            <DetailText label="Remark">{data_detail?.description || "-"}</DetailText>
          </div>
        </div>
      </SectionCard>
    </div>
  );
};

export default DetailReceipt;
