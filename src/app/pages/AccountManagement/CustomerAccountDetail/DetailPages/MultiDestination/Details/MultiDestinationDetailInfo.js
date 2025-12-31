import { Fragment } from "react";
import DetailText from "../../../../../../../components/DetailText";
import BaseContainer from "../../../../../../../components/BaseContainer";
import moment from "moment";
import { dateFormatting } from "../../../../../../../utils";

const MultiDestinationDetailInfo = ({
  dataDetail = {},
}) => {
  return (
    <Fragment>
      <BaseContainer header={"MULTI DESTINATION INFORMATION"}>
        <div className="w-full grid grid-cols-3 gap-4">
          {/* Multi Destination Information */}
          <DetailText label="Account">{`${dataDetail.accountNumber}-${dataDetail.accountName}`}</DetailText>
          <DetailText label="Account SOR">{dataDetail.sor}</DetailText>
          <DetailText label="Account Cost Center">{dataDetail.costCenter}</DetailText>
          <DetailText label="Metering Reading Code">{dataDetail.meterReadingCodes}</DetailText>
          <DetailText label="Account Segment">{dataDetail.segment}</DetailText>
          <DetailText label="Account Group Type">{dataDetail.accountGroupType}</DetailText>
          <DetailText label="Account Type">{dataDetail.accountType}</DetailText>
          <DetailText label="Premise Address">{dataDetail.premiseAddress}</DetailText>
          <DetailText label="Subdistrict">{dataDetail.subDistrict}</DetailText>
          <DetailText label="District">{dataDetail.district}</DetailText>
          <DetailText label="City">{dataDetail.city}</DetailText>
          <DetailText label="Country">{dataDetail.country}</DetailText>
          <DetailText label="Longitude">{dataDetail.longitude}</DetailText>
          <DetailText label="Latitude">{dataDetail.latitude}</DetailText>
          <DetailText label="Start Date">{dataDetail?.startDate ? moment(dataDetail.startDate, dateFormatting.f_date).format(dateFormatting.date) : ""}</DetailText>
          <DetailText label="End Date">{dataDetail?.endDate ? moment(dataDetail.endDate, dateFormatting.f_date).format(dateFormatting.date) : ""}</DetailText>
          <DetailText label="Status">{dataDetail?.status}</DetailText>
        </div>
        <div className="w-full">
          <DetailText label="Description">{dataDetail?.description}</DetailText>
        </div>
      </BaseContainer>

      <BaseContainer header={"HISTORY LOG INFORMATION"}>
        <div className="w-full grid grid-cols-5 gap-4">
          {/* History Log Information */}
          <DetailText label="Record Id">{dataDetail?.id}</DetailText>
          <DetailText label="Created Date">{dataDetail?.createdDate ? moment(dataDetail.createdDate, dateFormatting.meas_date).format(dateFormatting.dateTime) : ""}</DetailText>
          <DetailText label="Created By">{dataDetail?.createdBy}</DetailText>
          <DetailText label="Updated Date">{dataDetail?.updatedDate ? moment(dataDetail.updatedDate, dateFormatting.meas_date).format(dateFormatting.dateTime) : ""}</DetailText>
          <DetailText label="Updated By">{dataDetail?.updatedBy}</DetailText>
        </div>
      </BaseContainer>
    </Fragment>
  );
};

export default MultiDestinationDetailInfo;
