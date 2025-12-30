import { Fragment } from "react";
import DetailText from "../../../../../../../../../components/DetailText";
import moment from "moment";
import { dateFormatting } from "../../../../../../../../../utils";

const ConfirmationModalInfo = ({
  data = {},
}) => {
  return (
    <Fragment>
      <div className="text-primary text-xs font-bold uppercase">
        INVOICE RELATION INFORMATION
      </div>
      <div className="w-full grid grid-cols-3 gap-x-5">
        <DetailText label="Account Number">{data.accountNumber}</DetailText>
        <DetailText label="Account Name">{data.accountName}</DetailText>
        <DetailText label="Priority">{data.priority}</DetailText>
        <DetailText label="Start Date">{moment(data.startDate, dateFormatting.f_date).format(dateFormatting.date)}</DetailText>
        <DetailText label="End Date">{data.endDate ? moment(data.endDate, dateFormatting.f_date).format(dateFormatting.date) : ""}</DetailText>
      </div>
      <div className="w-full">
        <DetailText label="Description">{data.description}</DetailText>
      </div>
    </Fragment>
  );
};

export default ConfirmationModalInfo;
