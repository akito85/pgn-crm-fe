import { Fragment } from "react";
import React from "react";
import DetailText from "../../../../../../../../components/DetailText";
import moment from "moment";

const TaxIdentifierConfirm = ({ data = {}, filterTax = [] }) => {
  // useEffect(() => {},[]);
  return (
    <Fragment>
      <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
        {"TAX IDENTIFIER INFORMATION"}
      </div>

      <div className="w-full grid grid-cols-3 gap-2">
        {/* Account information */}

        <DetailText label="Tax Identifier Type">
          {filterTax?.find((item) => item.id === data?.taxIdentifierType)?.text}
        </DetailText>
        <DetailText label="Tax Identifier Number">
          {data?.taxIdentifierNumber}
        </DetailText>
        <DetailText label="Tax Identifier Name">
          {data?.taxIdentifierName}
        </DetailText>
        <div className="col-span-3">
          <DetailText label="Address">{data?.taxIdentifierAddress}</DetailText>
        </div>
      </div>
      <div className="w-full grid grid-cols-2 gap-2">
        <DetailText label="Start Date">{moment(data?.startDate).format("DD MMM YYYY")}</DetailText>
        <DetailText label="Description">{data?.description}</DetailText>
      </div>
    </Fragment>
  );
};

export default TaxIdentifierConfirm;
