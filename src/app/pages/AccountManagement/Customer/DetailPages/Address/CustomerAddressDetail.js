import { Fragment } from "react";
import React from "react";
import DetailText from "../../../../../../components/DetailText";
import CardComponent from "../../../../../../components/Card/CardComponent";
import moment from "moment";
import GoogleMapsCustom from "../../../CustomerAccountDetail/DetailPages/AccountAddress/GoogleMapsCustom";

const CustomerAddressDetail = ({ data_detail = {} }) => {
  let selectedLocationDetail = {
    lat: parseFloat(data_detail?.latitude),
    lng: parseFloat(data_detail?.longitude),
  };

  const renderDate = (date) => {
    if (date) {
      return moment(date).format("DD MMM YYYY");
    } else {
      return "";
    }
  };

  return (
    <Fragment>
      <CardComponent header={"ADDRESS INFORMATION"} cols={4}>
        {/* SECTION ADDRESS INFORMATION */}
        <DetailText label="Country">{data_detail?.country}</DetailText>
        <DetailText label="Province">{data_detail?.province}</DetailText>
        <DetailText label="City">{data_detail?.city}</DetailText>
        <DetailText label="District">{data_detail?.district}</DetailText>
        <DetailText label="Sub District">{data_detail?.subDistrict}</DetailText>
        <DetailText label="Postal Code">{data_detail?.postalCode}</DetailText>
        <DetailText label="Building">{data_detail?.bulding}</DetailText>
        <DetailText label="Floor">{data_detail?.floor}</DetailText>
        <DetailText label="House Name">{data_detail?.houseName}</DetailText>
        <DetailText label="Street Name">{data_detail?.streetName}</DetailText>
        <DetailText label="Block">{data_detail?.block}</DetailText>
        <DetailText label="House Number">{data_detail?.houseNumber}</DetailText>
        <DetailText label="RT">{data_detail?.neighborhood1}</DetailText>
        <DetailText label="RW">{data_detail?.neighborhood2}</DetailText>
        <DetailText label="Type">{data_detail?.type}</DetailText>
        <DetailText label="Additional Note">
          {data_detail?.additionalInfo}
        </DetailText>
        <div className="col-span-4">
          <DetailText label="Address">{data_detail?.fullAddress}</DetailText>
        </div>
        <div className="col-span-4">
          <DetailText label="Description">
            {data_detail?.description_mAddress}
          </DetailText>
        </div>

        {/* SECTION ADDRESS COORDINATE */}
        <div className="col-span-4 text-primary text-xs font-semibold uppercase py-[30px]">
          ADDRESS COORDINATE
        </div>
        <DetailText label="Source">{data_detail?.source}</DetailText>
        <DetailText label="Longitude">{data_detail?.latitude}</DetailText>
        <DetailText label="Latitude">{data_detail?.longitude}</DetailText>
        <DetailText label="Altitude"></DetailText>

        {/* SECTION ADDRESS PURPOSE INFORMATION */}
        <div className="col-span-4 text-center">
          <div className="col-span-4 text-center">
            <GoogleMapsCustom
              zoom={19}
              selectedLocation={selectedLocationDetail}
            />
          </div>
        </div>

        {/* SECTION ADDRESS PURPOSE INFORMATION */}
        <div className="col-span-4 text-primary text-xs font-semibold uppercase py-[30px]">
          ADDRESS PURPOSE INFORMATION
        </div>

        <DetailText label="Business Purpose">
          {data_detail?.businessPurpose}
        </DetailText>
        <DetailText label="Premise">
          {data_detail?.premiseFlag ? "Yes" : "No"}
        </DetailText>
        <DetailText label="Primary">
          {data_detail?.primaryFlag ? "Yes" : "No"}
        </DetailText>
        <div className="col-span-4">
          <DetailText label="Remark">
            {data_detail?.description_accountAddress}
          </DetailText>
        </div>
      </CardComponent>

      <CardComponent header={"HISTORY LOG INFORMATION"} cols={5}>
        <DetailText label="Record ID">
          {data_detail?.accountAddressId}
        </DetailText>
        <DetailText label="Created Date">
          {renderDate(data_detail?.createdDate)}
        </DetailText>
        <DetailText label="Created By">{data_detail?.createdBy}</DetailText>
        <DetailText label="Update Date">
          {renderDate(data_detail?.updatedDate)}
        </DetailText>
        <DetailText label="Updated By">{data_detail?.updatedBy}</DetailText>
      </CardComponent>
    </Fragment>
  );
};
export default CustomerAddressDetail;
