import React from "react";
import CardComponent from "../../../../components/Card/CardComponent";
import DetailText from "../../../../components/DetailText";
import moment from "moment";
import {
  dateFormatting,
  hasValue,
  renderDateConverter,
  toTitleCase,
} from "../../../../utils";

const DetailGroupAccessLayout = ({ data }) => {
  return (
    <>
      <CardComponent header={"GROUP ACCESS INFORMATION"} cols={4}>
        <DetailText label={"Group Access"}>{data?.groupAccess}</DetailText>
        <DetailText label={"Start Date"}>
          {hasValue(data?.startDate) &&
            renderDateConverter(data?.startDate, "dateCapital")}
        </DetailText>
        <DetailText label={"End Date"}>
          {hasValue(data?.endDate) &&
            renderDateConverter(data?.endDate, " dateCapital")}
        </DetailText>
        <DetailText label={"Status"}>{toTitleCase(data?.status)}</DetailText>
      </CardComponent>
      <CardComponent header={"HISTORY LOG INFORMATION"} cols={5}>
        <DetailText label={"Record"}>{data?.userGaId}</DetailText>
        <DetailText label={"Created Date"}>
          {hasValue(data?.createdDate) &&
            moment(data?.createdDate).format(dateFormatting.dateTime)}
        </DetailText>
        <DetailText label={"Created By"}>{data?.createdBy}</DetailText>
        <DetailText label={"Updated Date"}>
          {hasValue(data?.updatedDate) &&
            moment(data?.updatedDate).format(dateFormatting.dateTime)}
        </DetailText>
        <DetailText label={"Updated By"}>{data?.updatedBy}</DetailText>
      </CardComponent>
    </>
  );
};

export default DetailGroupAccessLayout;
