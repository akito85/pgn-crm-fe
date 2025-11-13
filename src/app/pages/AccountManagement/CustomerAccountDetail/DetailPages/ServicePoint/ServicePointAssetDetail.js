import { Fragment } from "react";
import React from "react";
import moment from "moment";
import DetailText from "../../../../../../components/DetailText";
import CardComponent from "../../../../../../components/Card/CardComponent";
import { dateFormatting } from "../../../../../../utils";

const ServicePointAssetDetail = ({ data = {} }) => {
  const renderDate = (date) => {
    if (date) {
      return moment(date).format(dateFormatting.dateTime);
    } else {
      return "";
    }
  };  return (
    <Fragment>
      <CardComponent header={"ASSET ASSIGNMENT INFORMATION"}>

        <div className="w-full grid grid-cols-3 gap-3">
          <DetailText label="Install Date">
            {moment(data?.installDate).format(dateFormatting.dateTime)}
          </DetailText>
          <DetailText label="Uninstall Date">
            {renderDate(data?.unInstallDate)}
          </DetailText>
          <DetailText label="Remark">{data?.remark}</DetailText>
          
        </div>
      </CardComponent>

      <CardComponent header={"ASSET INFORMATION"}>

        <div className="w-full grid grid-cols-4 gap-3">
          <DetailText label="Serial Number">{data?.serialNumber}</DetailText>
          <DetailText label="Asset Name">{data?.assetName}</DetailText>
          <DetailText label="Asset Type">{data?.type}</DetailText>

          {/* line2 */}
          <DetailText label="Product Name">{data?.productName}</DetailText>
          <DetailText label="Custody Transfer">
            {data?.custodyTransfer === "Y" ? "Yes" : "No"}
          </DetailText>

          {/* line3 */}
          <DetailText label="Brand">{data?.brand}</DetailText>
          <DetailText label="Year">{data?.year}</DetailText>
        </div>
      </CardComponent>

      <CardComponent header={"ASSET ATTRIBUTE"}>

        <div className="w-full grid grid-cols-4 gap-3">
          <DetailText label="Inlet Diameter">{data?.inletDiameter}</DetailText>
          <DetailText label="Outlet Diameter">
            {data?.outletDiameter}
          </DetailText>
          <DetailText label="Maximum Inlet Pressure">
            {data?.maximumInletPressure}
          </DetailText>

          {/* line2 */}
          <DetailText label="Maximum Outlet Pressure">
            {data?.maximumOutletPressure}
          </DetailText>
          <DetailText label="Minimum Inlet Pressure">
            {data?.minimumInletPressure}
          </DetailText>
          <DetailText label="Minimum Outlet Pressure">
            {data?.minimumOutletPressure}
          </DetailText>

          {/* line3 */}
          <DetailText label="Max Flow Capacity Per Stream">
            {data?.maxFlowCapacityPerStream}
          </DetailText>
          <DetailText label="Stream Amount">{data?.streamAmount}</DetailText>
          <DetailText label="G Size">{data?.gsize}</DetailText>

          {/* line4 */}
          <DetailText label="Setting Pressure">
            {data?.settingPressure}
          </DetailText>
          <DetailText label="Length">{data?.length}</DetailText>
          <DetailText label="Bolt Hole Amount">
            {data?.boltHoleAmount}
          </DetailText>

          {/* line5 */}
          <DetailText label="Minimum Capacity">
            {data?.minimumCapacity}
          </DetailText>
          <DetailText label="Maximum Capacity">
            {data?.maximumCapacity}
          </DetailText>
          <DetailText label="Class/ANSI">{data?.ansi}</DetailText>

          <div className="col-span-3">
            <DetailText label="Description">{data?.description}</DetailText>
          </div>
        </div>
      </CardComponent>

      <CardComponent header={"HISTORY LOG INFORMATION"}>
        <div className="w-full grid grid-cols-5 gap-5">
          <DetailText label="Record ID">{data?.id}</DetailText>
          <DetailText label="Created Date">
            {moment(data?.createdDate).format(dateFormatting.dateTime)}
          </DetailText>
          <DetailText label="Created By">{data?.createdBy}</DetailText>
          <DetailText label="Updated Date">
            {renderDate(data?.updatedDate)}
          </DetailText>
          <DetailText label="Updated By">{data?.updatedBy}</DetailText>
        </div>
      </CardComponent>
    </Fragment>
  );
};

export default ServicePointAssetDetail;
