import { Fragment } from "react";
import DetailText from "../../../../../../../../../components/DetailText";
import moment from "moment";
import { dateFormatting } from "../../../../../../../../../utils";

const ConfirmationModalInfo = ({
  data = {},
}) => {
  const renderDate = (date) => {
    if (date) {
      return moment(date).format(dateFormatting.dateTime);
    } else {
      return "";
    }
  };

  return (
    <Fragment>
      <div className="text-primary text-xs font-bold uppercase">
        INVOICE RELATION INFORMATION
      </div>
      <div className="w-full grid grid-cols-3 gap-x-5">
        <DetailText label="Account Number">{data.customerNumber}</DetailText>
        <DetailText label="Account Name">{data.identificationType}</DetailText>
        <DetailText label="Priority">{data.customerIdentificationNumber}</DetailText>
        <DetailText label="Start Date">{renderDate(data.startDate)}</DetailText>
        <DetailText label="End Date">{renderDate(data.endDate)}</DetailText>
      </div>
      <div className="w-full">
        <DetailText label="Description">{data.description}</DetailText>
      </div>
    </Fragment>
  );
};

export default ConfirmationModalInfo;
