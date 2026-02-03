import { Fragment } from "react";
import DetailText from "../../../../../../../../components/DetailText";
import moment from "moment";
import { dateFormatting } from "../../../../../../../../utils";

const InvoiceRelationDetailInfo = ({
  subjectAccountNumber,
  dataDetail = {},
}) => {
  return (
    <Fragment>
      <div className="w-full grid grid-cols-3 gap-4">
        {/* Invoice Relation Information */}
        <DetailText label="Account Number">{subjectAccountNumber === dataDetail.accountNumber ? dataDetail.relatedAccountNumber : dataDetail.accountNumber}</DetailText>
        <DetailText label="Account Name">{subjectAccountNumber === dataDetail.accountNumber ? dataDetail.relatedAccountName : dataDetail.accountName}</DetailText>
        <DetailText label="Start Date">{dataDetail.startDate ? moment(dataDetail.startDate, dateFormatting.f_date).format(dateFormatting.date) : ""}</DetailText>
        <DetailText label="End Date">{dataDetail.endDate ? moment(dataDetail.endDate, dateFormatting.f_date).format(dateFormatting.date) : ""}</DetailText>
        <DetailText label="Status">{dataDetail.status}</DetailText>
      </div>
      <div className="w-full">
        <DetailText label="Description">{dataDetail.description}</DetailText>
      </div>
    </Fragment>
  );
};

export default InvoiceRelationDetailInfo;
