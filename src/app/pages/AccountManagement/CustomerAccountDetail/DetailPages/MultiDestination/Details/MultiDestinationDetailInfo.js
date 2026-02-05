import moment from "moment";
import { dateFormatting } from "../../../../../../../utils";
import NxDetailText from "../../../../../../../components/Nx/NxDetailText";
import NxBaseContainer from "../../../../../../../components/Nx/NxBaseContainer";

const MultiDestinationDetailInfo = ({
  subjectAccountNumber,
  dataDetail = {},
}) => {
  return (
    <NxBaseContainer border>
      <div className="flex flex-col gap-y-4">
        <div className="w-full grid grid-cols-3 gap-4">
          {/* Multi Destination Information */}
          <NxDetailText label="Account">{`${dataDetail.accountNumber}-${dataDetail.accountName}`}</NxDetailText>
          <NxDetailText label="Account SOR">{dataDetail.sor}</NxDetailText>
          <NxDetailText label="Account Cost Center">{dataDetail.costCenter}</NxDetailText>
          <NxDetailText label="Metering Reading Code">{dataDetail.meterReadingCodes}</NxDetailText>
          <NxDetailText label="Account Segment">{dataDetail.segment}</NxDetailText>
          <NxDetailText label="Account Group Type">{dataDetail.accountGroupType}</NxDetailText>
          <NxDetailText label="Account Type">{dataDetail.accountType}</NxDetailText>
          <NxDetailText label="Premise Address">{dataDetail.premiseAddress}</NxDetailText>
          <NxDetailText label="Subdistrict">{dataDetail.subDistrict}</NxDetailText>
          <NxDetailText label="District">{dataDetail.district}</NxDetailText>
          <NxDetailText label="City">{dataDetail.city}</NxDetailText>
          <NxDetailText label="Country">{dataDetail.country}</NxDetailText>
          <NxDetailText label="Longitude">{dataDetail.longitude}</NxDetailText>
          <NxDetailText label="Latitude">{dataDetail.latitude}</NxDetailText>
          <NxDetailText label="Start Date">{dataDetail?.startDate ? moment(dataDetail.startDate, dateFormatting.f_date).format(dateFormatting.date) : ""}</NxDetailText>
          <NxDetailText label="End Date">{dataDetail?.endDate ? moment(dataDetail.endDate, dateFormatting.f_date).format(dateFormatting.date) : ""}</NxDetailText>
          <NxDetailText label="Status">{dataDetail?.status}</NxDetailText>
        </div>
        <div className="w-full">
          <NxDetailText label="Description">{dataDetail?.description}</NxDetailText>
        </div>
      </div>
    </NxBaseContainer>
  );
};

export default MultiDestinationDetailInfo;
