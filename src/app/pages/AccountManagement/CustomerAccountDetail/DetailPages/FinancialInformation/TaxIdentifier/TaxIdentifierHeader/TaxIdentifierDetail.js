import { Fragment } from "react";
import React, { useEffect, useRef } from "react";
import DetailText from "../../../../../../../../components/DetailText";
import CardComponent from "../../../../../../../../components/Card/CardComponent";
import moment from "moment";
import { dateFormatting } from "../../../../../../../../utils";

const TaxIdentifierDetail = ({ data_detail = {} }) => {
  //utils
  // console.log(data_detail)
  const renderDate = (date) => {
    if (date) {
      return moment(date).format(dateFormatting.dateTime);
    } else {
      return "";
    }
  };

  return (
    // <Spin spinning={loading} className={"w-full top-20"} tip={"Loading..."}>
    <Fragment>
      <CardComponent header={"TAX IDENTIFIER INFORMATION"}>
        <div className="w-full grid grid-cols-4 gap-3">
          <DetailText label="Tax Identifier Type">
            {data_detail?.taxIdentifierTypeValue}
          </DetailText>
          <DetailText label="Tax Identifier Number">
            {data_detail?.taxIdentifierNumber}
          </DetailText>
          <DetailText label="Tax Identifier Name">
            {data_detail?.taxIdentifierName}
          </DetailText>
          <DetailText label="Status">{data_detail?.status}</DetailText>
          <div className="col-span-3">
            <DetailText label="Tax Identifier Address">
              {data_detail?.taxIdentifierAddressValue}
            </DetailText>
          </div>
        </div>
      </CardComponent>
      <CardComponent header={"HISTORY LOG INFORMATION"}>
        <div className="w-full grid grid-cols-5 gap-5">
          <DetailText label="Record ID">{data_detail?.id}</DetailText>
          <DetailText label="Created Date">
            {moment(data_detail?.createdDate).format(dateFormatting.dateTime)}
          </DetailText>
          <DetailText label="Created By">{data_detail?.createdBy}</DetailText>
          <DetailText label="Updated Date">
            {renderDate(data_detail?.updatedDate)}
          </DetailText>
          <DetailText label="Updated By">{data_detail?.updatedBy}</DetailText>
        </div>
      </CardComponent>
    </Fragment>
    // </Spin>
  );
};
export default TaxIdentifierDetail;
