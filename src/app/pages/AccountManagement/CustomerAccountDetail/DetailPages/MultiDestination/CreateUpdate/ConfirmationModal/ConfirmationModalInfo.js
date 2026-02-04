import moment from "moment";
import { dateFormatting } from "../../../../../../../../utils";
import NxBaseContainer from "../../../../../../../../components/Nx/NxBaseContainer";
import NxDetailText from "../../../../../../../../components/Nx/NxDetailText";

const ConfirmationModalInfo = ({
  data = {},
}) => {
  return (
    <NxBaseContainer border header={"MULTI DESTINATION INFORMATION"}>
      <div className="flex flex-col gap-y-4">
        <div className="w-full grid grid-cols-3 gap-4">
          <NxDetailText label="Account">{data.account}</NxDetailText>
          <NxDetailText label="Account SOR">{data.accountSor}</NxDetailText>
          <NxDetailText label="Account Cost Center">{data.accountCostCenter}</NxDetailText>
          <NxDetailText label="Meter Reading Code">{data.meterReadingCode}</NxDetailText>
          <NxDetailText label="Account Segment">{data.accountSegment}</NxDetailText>
          <NxDetailText label="Account Group Type">{data.accountGroupType}</NxDetailText>
          <NxDetailText label="Account Type">{data.accountType}</NxDetailText>
          <NxDetailText label="Premise Address">{data.premiseAddress}</NxDetailText>
          <NxDetailText label="Subdistrict">{data.subDistrict}</NxDetailText>
          <NxDetailText label="District">{data.district}</NxDetailText>
          <NxDetailText label="City">{data.city}</NxDetailText>
          <NxDetailText label="Country">{data.country}</NxDetailText>
          <NxDetailText label="Longitude">{data.longitude}</NxDetailText>
          <NxDetailText label="Latitude">{data.latitude}</NxDetailText>
          <NxDetailText label="Start Date">{moment(data.startDate, dateFormatting.f_date).format(dateFormatting.date)}</NxDetailText>
          <NxDetailText label="End Date">{data.endDate ? moment(data.endDate, dateFormatting.f_date).format(dateFormatting.date) : ""}</NxDetailText>
        </div>
        <div className="w-full">
          <NxDetailText label="Description">{data.description}</NxDetailText>
        </div>
      </div>
    </NxBaseContainer>
  );
};

export default ConfirmationModalInfo;
