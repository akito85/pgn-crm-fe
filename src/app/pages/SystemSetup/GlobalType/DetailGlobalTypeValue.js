import React from "react";
import CardComponent from "../../../../components/Card/CardComponent";
import DetailText from "../../../../components/DetailText";
import moment from "moment";
import { dateFormatting, toTitleCase } from "../../../../utils";

const DetailGlobalTypeValue = (props) => {
  const { data } = props;
  return (
    <>
      <CardComponent header={"GLOBAL TYPE VALUE INFORMATION"} cols={4}>
        <DetailText label="Display Text">
          {data?.name ? data.name : ""}
        </DetailText>
        <DetailText label="Value">
          {data?.glbValue ? data.glbValue : ""}
        </DetailText>
        <DetailText label="Order">
          {data?.glbOrder ? data.glbOrder : ""}
        </DetailText>
        <DetailText label="Description">
          {data?.description ? data.description : ""}
        </DetailText>
        <DetailText label="Parent Group">
          {data?.parentGroup ? data.parentGroup : ""}
        </DetailText>
        <DetailText label="Parent Value">
          {data?.parentValue ? data.parentValue : ""}
        </DetailText>
        <DetailText label="Status">
          {data?.status ? toTitleCase(data.status) : ""}
        </DetailText>
      </CardComponent>

      <CardComponent header={"HISTORY LOG INFORMATION"} cols={5}>
        <DetailText label="Record Id">{data?.glbTypeValId}</DetailText>
        <DetailText label="Created Date">
          {data?.createdDate
            ? moment(data.createdDate).format(dateFormatting.dateTime)
            : ""}
        </DetailText>
        <DetailText label="Created By">
          {data?.createdBy ? data.createdBy : ""}
        </DetailText>
        <DetailText label="Updated Date">
          {data?.updatedDate
            ? moment(data.updatedDate).format(dateFormatting.dateTime)
            : ""}
        </DetailText>
        <DetailText label="Updated By">
          {data?.updatedBy ? data.updatedBy : ""}
        </DetailText>
      </CardComponent>
    </>
  );
};

export default DetailGlobalTypeValue;
