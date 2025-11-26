import { Fragment } from "react";
import React from "react";
import DetailText from "../../../../../../components/DetailText";

const AccountConfirm = ({
  data_header = [],
  data_detail = {},
}) => {
  // useEffect(() => {},[]);
  return (
    <Fragment>
      <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
          {data_header[0]}
        </div>

        <div className="w-full grid grid-cols-3 gap-3">
          {/* Account information */}

          <DetailText label="Account Group">
            {data_detail?.accountGroup}
          </DetailText>
          <DetailText label="Customer Management">
            {data_detail?.customerManagement}
          </DetailText>
        </div>

        <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
          {data_header[1]}
        </div>

        {/* account location information */}

        <div className="w-full grid grid-cols-3 gap-3">
          <DetailText label="SOR">
            {data_detail?.sor}
          </DetailText>
          <DetailText label="Cost-Center">
            {data_detail?.costCenter}
          </DetailText>
          <DetailText label="Meter Reading Code">
            {data_detail?.meterReadingCodes}
          </DetailText>
          </div>

        <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
          {data_header[2]}
        </div>

        {/* account identification information */}

        <div className="w-full grid grid-cols-3 gap-3">
          <DetailText label="Account Name">
            {data_detail?.accountName}
          </DetailText>
          <DetailText label="Account Registration Number">
            {data_detail?.accountRegistrationNumber}
          </DetailText>
          <DetailText label="Category">{data_detail?.category}</DetailText>
          <div className="col-span-3">
          <DetailText label="Description">
            {data_detail?.description}
          </DetailText>
          </div>
        </div>

        <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
          {data_header[3]}
        </div>

        {/* segment information */}

        <div className="w-full grid grid-cols-3 gap-3">
          <DetailText label="Segment">
            {data_detail?.accountSegment}
          </DetailText>
          <DetailText label="Account Group Type">
            {data_detail?.accountGroupType}
          </DetailText>
          <DetailText label="Account Type">
            {data_detail?.accountType}
          </DetailText>
          <DetailText label="Classification Type">
            {data_detail?.classificationType}
          </DetailText>
          <DetailText label="Priority">
            {data_detail?.priority}
          </DetailText>
          <DetailText label="Corporate Customer">{data_detail?.corporateCustomer ? "Yes": "No"}</DetailText>
          <DetailText label="Rating & Billing Exception">
            {data_detail?.ratingBilling ? "Yes" : "No"}
          </DetailText>
        </div>

        <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
          {data_header[4]}
        </div>

        {/* Budget information */}

        <div className="w-full grid grid-cols-3 gap-3">
          <DetailText label="Industrial Sector">
            {data_detail?.industrialSector}
          </DetailText>
        </div>

        <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
          {data_header[5]}
        </div>

        {/* Budget information */}

        <div className="w-full grid grid-cols-3 gap-3">
          <DetailText label="Budget Year">
            {data_detail?.budgetYear}
          </DetailText>
          <DetailText label="Budget">{data_detail?.budget}</DetailText>
          <DetailText label="Teritory">
            {data_detail?.teritory}
          </DetailText>
        </div>
    </Fragment>
  );
};

export default AccountConfirm;
