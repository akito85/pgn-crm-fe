import { Fragment } from "react";
import React from "react";
import DetailText from "../../../../../../../../components/DetailText";
import CardComponent from "../../../../../../../../components/Card/CardComponent";
import moment from "moment";
import { dateFormatting } from "../../../../../../../../utils";

const TaxRelationDetail = ({
    data_detail = {}
}) => {

  //utils
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
      <CardComponent header={"TAX RELATION INFORMATION"}>
        <div className="w-full grid grid-cols-3 gap-3">
          <DetailText label="Account Number">{data_detail?.accountNumber}</DetailText>
          <DetailText label="Account Name">{data_detail?.accountName}</DetailText>
          <DetailText label="Tax Identifier Number">{data_detail?.taxIdentifierNumber}</DetailText>
          <DetailText label="Start Date">{moment(data_detail?.startDate).format("DD MMM YYYY")}</DetailText>
          <DetailText label="End Date">{data_detail?.endDate ? moment(data_detail?.endDate).format(dateFormatting.date) : ""}</DetailText>
        </div>
      </CardComponent>
      <CardComponent header={"HISTORY LOG INFORMATION"}>
        <div className="w-full grid grid-cols-4 gap-5">
          <DetailText label="Created Date">{moment(data_detail?.startDate).format(dateFormatting.dateTime)}</DetailText>
          <DetailText label="Created By">{data_detail?.createdBy}</DetailText>
          <DetailText label="Updated Date">{renderDate(data_detail?.endDate)}</DetailText>
          <DetailText label="Updated By">{data_detail?.updatedBy}</DetailText>
        </div>
      </CardComponent>
    </Fragment>
    // </Spin>
  );
};
export default TaxRelationDetail;
