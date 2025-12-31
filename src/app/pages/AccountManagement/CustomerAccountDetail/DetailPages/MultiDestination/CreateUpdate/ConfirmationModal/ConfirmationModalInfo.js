import { Fragment } from "react";
import DetailText from "../../../../../../../../components/DetailText";
import moment from "moment";
import { dateFormatting } from "../../../../../../../../utils";

const ConfirmationModalInfo = ({
  data = {},
}) => {
  return (
    <Fragment>
      <div className="text-primary text-xs font-bold uppercase">
        MULTI DESTINATION INFORMATION
      </div>
      <div className="w-full grid grid-cols-3 gap-x-5">
        <DetailText label="Account">{data.account}</DetailText>
        <DetailText label="Account SOR">{data.accountSor}</DetailText>
        <DetailText label="Account Cost Center">{data.accountCostCenter}</DetailText>
        <DetailText label="Metering Reading Code">{data.meteringReadingCode}</DetailText>
        <DetailText label="Account Segment">{data.accountSegment}</DetailText>
        <DetailText label="Account Group Type">{data.accountGroupType}</DetailText>
        <DetailText label="Account Type">{data.accountType}</DetailText>
        <DetailText label="Premise Address">{data.premiseAddress}</DetailText>
        <DetailText label="Subdistrict">{data.subdistrict}</DetailText>
        <DetailText label="District">{data.district}</DetailText>
        <DetailText label="City">{data.city}</DetailText>
        <DetailText label="Country">{data.country}</DetailText>
        <DetailText label="Longitude">{data.longitude}</DetailText>
        <DetailText label="Latitude">{data.latitude}</DetailText>
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
