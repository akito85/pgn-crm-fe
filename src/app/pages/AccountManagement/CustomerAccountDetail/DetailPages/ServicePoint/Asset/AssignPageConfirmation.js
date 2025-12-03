import { Fragment } from "react";
import React from "react";
import moment from "moment";
import DetailText from "../../../../../../../components/DetailText";

const AssignPageConfirmation = ({ data = {} }) => {
  return (
    <Fragment>
      <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
        {"ASSET ASSIGNMENT INFORMATION"}
      </div>

      <div className="w-full grid grid-cols-3 gap-3">
        <DetailText label="Premise Address">{data?.premiseAddress}</DetailText>
        <DetailText label="Service Point">{data?.servicePoint}</DetailText>
        <DetailText label="Install Date">
          {moment(data?.installDate).format("DD MMM YYYY")}
        </DetailText>
        <div className="col-span-3">
          <DetailText label="Remark">{data?.remark}</DetailText>
        </div>
      </div>

      <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
        {"ASSET INFORMATION"}
      </div>

      <div className="w-full grid grid-cols-3 gap-3">
        <DetailText label="Serial Number">{data?.serialNumber}</DetailText>
        <DetailText label="Asset Name">{data?.assetNameValue}</DetailText>
        <DetailText label="Asset Type">{data?.typeValue}</DetailText>

        {/* line2 */}
        <DetailText label="Service Type">{data?.serviceTypeValue}</DetailText>
        <DetailText label="Product Name">{data?.productNameValue}</DetailText>
        <DetailText label="Custody Transfer">
          {data?.custodyTransfer ? "Yes" : "No"}
        </DetailText>

        {/* line3 */}
        <DetailText label="Brand">{data?.brandValue}</DetailText>
        <DetailText label="Year">
          {moment(data?.year).format("YYYY")}
        </DetailText>
      </div>

      <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
        {"ASSET ATTRIBUTE"}
      </div>

      <div className="w-full grid grid-cols-3 gap-3">
        <DetailText label="Inlet Diameter">{data?.inletDiameter}</DetailText>
        <DetailText label="Outlet Diameter">{data?.outletDiameter}</DetailText>
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
        <DetailText label="G Size">{data?.gsizeValue}</DetailText>

        {/* line4 */}
        <DetailText label="Setting Pressure">
          {data?.settingPressure}
        </DetailText>
        <DetailText label="Length">{data?.length}</DetailText>
        <DetailText label="Bolt Hole Amount">{data?.boltHoleAmount}</DetailText>

        {/* line5 */}
        <DetailText label="Minimum Capacity">
          {data?.minimumCapacity}
        </DetailText>
        <DetailText label="Maximum Capacity">
          {data?.maximumCapacity}
        </DetailText>
        <DetailText label="Class/ANSI">{data?.ansiValue}</DetailText>

        <div className="col-span-3">
          <DetailText label="Description">{data?.description}</DetailText>
        </div>
      </div>
    </Fragment>
  );
};

export default AssignPageConfirmation;
