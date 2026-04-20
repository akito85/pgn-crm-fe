import { dateFormatting } from "../../../../../../../utils";
import NxDetailText from "../../../../../../../components/Nx/NxDetailText";
import NxBaseContainer from "../../../../../../../components/Nx/NxBaseContainer";
import NxDate from "../../../../../../../components/Nx/NxDatePicker";
import StatusComponent from "../../../../../../../components/StatusComponent";

/**
 * Presentational info panel for a multi destination record.
 * Displays account details, address, geo, dates, status, and description.
 *
 * @param {object} props
 * @param {object} [props.detail={}] - Multi destination detail record
 */
const MultiDestinationDetailInfo = ({ detail = {} }) => {
  const {
    accountNumber,
    accountName,
    sor,
    costCenter,
    meterReadingCodes,
    segment,
    accountGroupType,
    accountType,
    premiseAddress,
    subDistrict,
    district,
    city,
    province,
    country,
    longitude,
    latitude,
    startDate,
    endDate,
    status,
    statusApproval,
    description
  } = detail;

  return (
    <NxBaseContainer border>
      <div className="flex flex-col gap-y-4">
        <div className="w-full grid grid-cols-3 gap-4">
          {/* Multi Destination Information */}
          <NxDetailText label="Account">{`${accountNumber}-${accountName}`}</NxDetailText>
          <NxDetailText label="Account SOR">{sor}</NxDetailText>
          <NxDetailText label="Cost Center">{costCenter}</NxDetailText>
          <NxDetailText label="Metering Reading Code">
            {meterReadingCodes}
          </NxDetailText>
          <NxDetailText label="Segment">{segment}</NxDetailText>
          <NxDetailText label="Account Group Type">
            {accountGroupType}
          </NxDetailText>
          <NxDetailText label="Account Type">{accountType}</NxDetailText>
          <NxDetailText label="Premise Address">{premiseAddress}</NxDetailText>
          <NxDetailText label="Subdistrict">{subDistrict}</NxDetailText>
          <NxDetailText label="District">{district}</NxDetailText>
          <NxDetailText label="City">{city}</NxDetailText>
          <NxDetailText label="Province">{province}</NxDetailText>
          <NxDetailText label="Country">{country}</NxDetailText>
          <NxDetailText label="Longitude">{longitude}</NxDetailText>
          <NxDetailText label="Latitude">{latitude}</NxDetailText>
          <NxDetailText label="Start Date">
            {NxDate.formatDate(startDate, dateFormatting.date)}
          </NxDetailText>
          <NxDetailText label="End Date">
            {NxDate.formatDate(endDate, dateFormatting.date)}
          </NxDetailText>
          <NxDetailText label="Status">
            <StatusComponent colour={status}>{status}</StatusComponent>
          </NxDetailText>
          <NxDetailText label="Status Approval">
            <StatusComponent colour={statusApproval}>{statusApproval}</StatusComponent>
          </NxDetailText>
        </div>
        <div className="w-full">
          <NxDetailText label="Description">{description}</NxDetailText>
        </div>
      </div>
    </NxBaseContainer>
  );
};

export default MultiDestinationDetailInfo;
