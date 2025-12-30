import { Fragment } from "react";
import React from "react";
import DetailText from "../../../../../../../../components/DetailText";
import moment from "moment";

const TaxRelationConfirm = ({
  data = {},
}) => {
  // useEffect(() => {},[]);

  return (
    <Fragment>
        <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
          {"ACCOUNT TAX RELATION CONFIRMATION"}
        </div>

        <div className="w-full grid grid-cols-3 gap-3">

          {/* Line 1 */}
          <DetailText label="Account Number">
            {data?.accountNumber}
          </DetailText>
          <DetailText label="Customer Name">
            {data?.customerName}
            </DetailText>
          <DetailText label="Account Name">
            {data?.accountName}
          </DetailText>

          {/* line 2 */}
					<DetailText label="Related Account Tax Identifier Type">
            {data?.taxIdentifierTypeValue}
          </DetailText>
          <DetailText label="Related Account Tax Identifier Number">
            {data?.taxIdentifierNumber}
            </DetailText>
          <DetailText label="Related Account Tax Identifier Name">
            {data?.taxIdentifierName}
          </DetailText>

          {/* line 3 */}
          <div className="col-span-3">
          <DetailText label="Related Account Tax Identifier Address">
            {data?.taxIdentifierAddressValue}
          </DetailText>
          <DetailText label="Start Date">
            {moment(data?.startDate).format("DD MMM YYYY")}
          </DetailText>
          <DetailText label="Description">
            {data?.description}
          </DetailText>
          </div>
        </div>
    </Fragment>
  );
};

export default TaxRelationConfirm;
