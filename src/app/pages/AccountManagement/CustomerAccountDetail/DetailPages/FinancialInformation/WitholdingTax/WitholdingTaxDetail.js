import { Fragment } from "react";
import React, { useEffect, useRef } from "react";
import DetailText from "../../../../../../../components/DetailText";
import CardComponent from "../../../../../../../components/Card/CardComponent";
import moment from "moment";
import { dateFormatting } from "../../../../../../../utils";

const WitholdingTaxDetail = ({
    data_detail = {}
}) => {

  //utils
  const renderDate = (date) => {
    if(date){
      return moment(date).format(dateFormatting.dateTime)
    } else {return ""}
  }

  return (
    // <Spin spinning={loading} className={"w-full top-20"} tip={"Loading..."}>
    <Fragment>
      <CardComponent header={"CUSTOMER MANAGEMENT INFORMATION"}>
        <div className="w-full grid grid-cols-3 gap-3">
          <DetailText label="Start Date">{moment(data_detail?.startDate).format("DD MMM YYYY")}</DetailText>
          <DetailText label="End Date">{data_detail?.endDate ? moment(data_detail?.endDate).format(dateFormatting.date) : ""}</DetailText>
          <DetailText label="Description">{data_detail?.description}</DetailText>
        </div>
      </CardComponent>
      <CardComponent header={"HISTORY LOG INFORMATION"}>
        <div className="w-full grid grid-cols-5 gap-5">
          <DetailText label="Record ID">{data_detail?.id}</DetailText>
          <DetailText label="Created Date">{moment(data_detail?.createdDate).format(dateFormatting.dateTime)}</DetailText>
          <DetailText label="Created By">{data_detail?.createdBy}</DetailText>
          <DetailText label="Updated Date">{renderDate(data_detail?.updatedDate)}</DetailText>
          <DetailText label="Updated By">{data_detail?.updatedBy}</DetailText>
        </div>
      </CardComponent>
    </Fragment>
    // </Spin>
  );
};
export default WitholdingTaxDetail;
